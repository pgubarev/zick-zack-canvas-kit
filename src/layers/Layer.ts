import { Container, DisplayObject } from '../display';
import { TConfig } from './configs';
import { createCanvasContext, createCanvasAndContext } from './utils';
import { EventProxyHandler } from './events';

export class Layer {
  public name: string;
  public config: TConfig;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public stage: Container;

  private eventsEnabled = false;
  private interactedItems: DisplayObject[];

  constructor(name: string, config: TConfig, existingCanvas?: HTMLCanvasElement) {
    this.name = name;
    this.config = config;

    this.interactedItems = null;

    if (!existingCanvas) {
        this.ctx = createCanvasAndContext(config);
        this.canvas = this.ctx.canvas;
    } else {
        this.canvas = existingCanvas;
        this.ctx = createCanvasContext(existingCanvas, config);
    }

    this.stage = new Container();

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  render() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stage.render(this.ctx);
  }

  private handlePointerDown(event: PointerEvent) {
    this.stage.propagate(event, 'pointerdown');
  }
  private handlePointerUp(event: PointerEvent) {
    this.stage.propagate(event, 'pointerup');
  }
  private handlePointerMove(event: PointerEvent) {
    const wrappedEvent = new Proxy(event, new EventProxyHandler());
    this.stage.propagate(wrappedEvent, 'pointermove');

    if (this.interactedItems && wrappedEvent.interactedItems) {
      const currentEventInteracted: DisplayObject[] = wrappedEvent.interactedItems;

      for (let i = 0; i < this.interactedItems.length; i++) {
        if (!currentEventInteracted.includes(this.interactedItems[i])) {
          this.interactedItems[i].propagate(event, 'pointerupoutside');
        }
      }

      this.interactedItems.length = 0;
    }

    this.interactedItems = wrappedEvent.interactedItems;
  }

  enableCanvasEvents() {
    if (this.eventsEnabled) return;
    this.eventsEnabled = true;

    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
  }

  disableCanvasEvents() {
    if (!this.eventsEnabled) return;
    this.eventsEnabled = false;

    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
  }
}

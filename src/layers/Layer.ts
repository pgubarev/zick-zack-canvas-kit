import { Container } from '../display';
import { TConfig } from './configs';
import { createCanvasContext, createCanvasAndContext } from './utils';
import { handlePointerEvent, ZickZackEvent } from '../events';

export class Layer {
  public name: string;
  public config: TConfig;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public stage: Container;
  private lastPointerEvent: ZickZackEvent | null;

  private eventsEnabled = false;

  constructor(name: string, config: TConfig, existingCanvas?: HTMLCanvasElement) {
    this.name = name;
    this.config = config;

    if (!existingCanvas) {
        this.ctx = createCanvasAndContext(config);
        this.canvas = this.ctx.canvas;
    } else {
        this.canvas = existingCanvas;
        this.ctx = createCanvasContext(existingCanvas, config);
    }

    this.stage = new Container();

    this.lastPointerEvent = null;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  render() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stage.render(this.ctx);
  }

  private handlePointerDown(canvasEvent: PointerEvent) {
    const event = new ZickZackEvent(canvasEvent, 'pointerdown');
    handlePointerEvent(event, null, this.stage);
  }
  private handlePointerUp(canvasEvent: PointerEvent) {
    const event = new ZickZackEvent(canvasEvent, 'pointerup');
    handlePointerEvent(event, null, this.stage);
  }
  private handlePointerMove(canvasEvent: PointerEvent) {
    const event = new ZickZackEvent(canvasEvent, 'pointermove');
    handlePointerEvent(event, this.lastPointerEvent, this.stage);

    this.lastPointerEvent = event;
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

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
    this.handlePointerLeave = this.handlePointerLeave.bind(this);
  }

  render() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stage.render(this.ctx);
  }

  private handlePointerDown(canvasEvent: PointerEvent) {
    const event = new ZickZackEvent(canvasEvent, 'pointerdown');
    handlePointerEvent(event, null, this.stage);
    event.destroy();

    if (this.lastPointerEvent !== null) this.lastPointerEvent.destroy();
    this.lastPointerEvent = null;
  }
  private handlePointerUp(canvasEvent: PointerEvent) {
    const event = new ZickZackEvent(canvasEvent, 'pointerup');
    handlePointerEvent(event, null, this.stage);
    event.destroy();

    if (this.lastPointerEvent !== null) this.lastPointerEvent.destroy();
    this.lastPointerEvent = null;
  }
  private handlePointerMove(canvasEvent: PointerEvent) {
    const event = new ZickZackEvent(canvasEvent, 'pointermove');
    handlePointerEvent(event, this.lastPointerEvent, this.stage);

    if (this.lastPointerEvent !== null) this.lastPointerEvent.destroy();
    this.lastPointerEvent = event;
  }

  private handlePointerLeave(canvasEvent: PointerEvent) {
    if (this.lastPointerEvent === null) return;

    const event = new ZickZackEvent(canvasEvent, 'pointerupoutside');
    handlePointerEvent(event, this.lastPointerEvent, this.stage);

    event.destroy();
    this.lastPointerEvent.destroy();
    this.lastPointerEvent = null;
  }

  enableCanvasEvents() {
    if (this.eventsEnabled) return;
    this.eventsEnabled = true;

    this.canvas.addEventListener('mouseup', this.handlePointerUp);
    this.canvas.addEventListener('mousedown', this.handlePointerDown);
    this.canvas.addEventListener('mousemove', this.handlePointerMove);
    this.canvas.addEventListener('mouseout', this.handlePointerLeave);

    this.canvas.addEventListener('touchstart', this.handlePointerUp);
    this.canvas.addEventListener('touchend', this.handlePointerDown);
    this.canvas.addEventListener('touchmove', this.handlePointerMove);
    this.canvas.addEventListener('touchcancel', this.handlePointerLeave);
  }

  disableCanvasEvents() {
    if (!this.eventsEnabled) return;
    this.eventsEnabled = false;

    this.canvas.removeEventListener('mouseup', this.handlePointerUp);
    this.canvas.removeEventListener('mousedown', this.handlePointerDown);
    this.canvas.removeEventListener('mousemove', this.handlePointerMove);
    this.canvas.removeEventListener('mouseout', this.handlePointerLeave);

    this.canvas.removeEventListener('touchstart', this.handlePointerUp);
    this.canvas.removeEventListener('touchend', this.handlePointerDown);
    this.canvas.removeEventListener('touchmove', this.handlePointerMove);
    this.canvas.removeEventListener('touchcancel', this.handlePointerLeave);
  }
}

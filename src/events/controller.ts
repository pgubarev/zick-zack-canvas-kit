import { Container } from '../display';
import { ZickZackEvent } from './events';
import { handlePointerEvent } from './handler';

export class EventsController {
  protected lastPointerEvent: ZickZackEvent | null;
  protected eventsEnabled = false;

  protected canvas: HTMLCanvasElement;
  protected stage: Container;

  constructor(canvas: HTMLCanvasElement, stage: Container) {
    this.canvas = canvas;
    this.stage = stage;

    this.lastPointerEvent = null;

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerLeave = this.handlePointerLeave.bind(this);

    // Disable touch actions because we operate only with pointer events
    this.canvas.style.touchAction = 'none';
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

    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
    this.canvas.addEventListener('pointerup', this.handlePointerUp);
    this.canvas.addEventListener('pointermove', this.handlePointerMove);
    this.canvas.addEventListener('pointerleave', this.handlePointerLeave);
  }

  disableCanvasEvents() {
    if (!this.eventsEnabled) return;
    this.eventsEnabled = false;

    this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    this.canvas.removeEventListener('pointerup', this.handlePointerUp);
    this.canvas.removeEventListener('pointermove', this.handlePointerMove);
    this.canvas.removeEventListener('pointerleave', this.handlePointerLeave);
  }
}


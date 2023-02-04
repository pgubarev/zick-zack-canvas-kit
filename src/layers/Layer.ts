import { Container } from '../display';
import { TConfig } from './configs';
import { createCanvasContext } from './utils';

export class Layer {
  public name: string;
  public config: TConfig;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public stage: Container;

  private eventsEnabled = false;

  constructor(name: string, config: TConfig) {
    this.name = name;
    this.config = config;

    this.ctx = createCanvasContext(config);
    this.canvas = this.ctx.canvas;

    this.stage = new Container();

    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
  }

  render() {
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
    this.stage.propagate(event, 'pointermove');
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

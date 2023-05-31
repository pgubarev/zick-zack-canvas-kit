import { Container } from '../display';
import { TConfig } from './configs';
import { createCanvasContext, createCanvasAndContext } from './utils';
import { EventsController } from '../events';

export class Layer {
  public name: string;
  public config: TConfig;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public stage: Container;

  private eventsController: EventsController;

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
    this.eventsController = new EventsController(this.canvas, this.stage);
  }

  render() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stage.render(this.ctx);
  }

  enableCanvasEvents() {
    this.eventsController.enableCanvasEvents();
  }

  disableCanvasEvents() {
    this.eventsController.disableCanvasEvents();
  }
}

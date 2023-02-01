import { Container } from '../display';
import { TConfig } from './configs';
import { createCanvasContext } from './utils';

export class Layer {
  public name: string;
  public config: TConfig;

  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  public tmpCanvas: HTMLCanvasElement;
  public tmpCtx: CanvasRenderingContext2D;

  public stage: Container;

  constructor(name: string, config: TConfig) {
    this.name = name;
    this.config = config;

    this.ctx = createCanvasContext(config);
    this.canvas = this.ctx.canvas;

    this.tmpCtx = createCanvasContext(config);
    this.tmpCanvas = this.ctx.canvas;

    this.stage = new Container();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stage.render(this.ctx, this.tmpCtx);
  }
}

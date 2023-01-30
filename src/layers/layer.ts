import { Container } from 'display';
import { TConfig } from './configs';

export class Layer {
  public name: string;
  public config: TConfig;
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public stage: Container;

  constructor(name: string, config: TConfig, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.name = name;
    this.config = config;
    this.canvas = canvas;
    this.ctx = ctx;

    this.stage = new Container();
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.stage.render(this.ctx);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

}

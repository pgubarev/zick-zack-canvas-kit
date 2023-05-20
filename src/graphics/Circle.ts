import { BasicGraphic } from '../display';

export class Circle extends BasicGraphic {
  public fillStyle: string | CanvasGradient | CanvasPattern = null;

  private _radius: number;
  public startAngle: number;
  public endAngle: number;
  public counterclockwise: boolean;
  public stroke: boolean;

  constructor(
      radius: number,
      fillStyle: string | CanvasGradient | CanvasPattern,
      startAngle = 0,
      endAngle = 2 * Math.PI,
      counterclockwise = false,
      stroke = false,
  ) {
    super();

    this.fillStyle = fillStyle;

    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.counterclockwise = counterclockwise;
    this.stroke = stroke;
  }

  set radius(value: number) {
      this._radius = value;
      this._width = this._radius * 2;
      this._height = this._radius * 2;
  }

  get radius(): number {
      return this._radius;
  }

  destroy() {
    super.destroy();
    this.fillStyle = null;
  }

  renderGraphic(ctx: CanvasRenderingContext2D) {
    if (this.stroke) {
        ctx.strokeStyle = this.fillStyle;
    } else {
        ctx.fillStyle = this.fillStyle;
    }

    ctx.beginPath();
    ctx.arc(this._x + this._radius, this._y + this._radius, this._radius, this.startAngle, this.endAngle, this.counterclockwise);
    if (this.stroke) {
        ctx.stroke();
    } else {
        ctx.fill();
    }
  }

  containsPoint(clickX: number, clickY: number): boolean {
    const x = (clickX - this.globalX)**2;
    const y = (clickY - this.globalY)**2;

    return Math.sqrt(x + y) < this.radius;
  }
}

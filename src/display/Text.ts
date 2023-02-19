import { DisplayObject } from './DisplayObject';
import { getTemporaryCanvasContext } from '../layers/utils';

export type TextStyle = {
  font: string;
  size: number;
  color: string;
};

export class Text extends DisplayObject {
  private _text: string;

  private metrix: TextMetrics;
  private drawingOffset: number;

  public style: TextStyle;

  constructor(text: string, style: TextStyle) {
    super();
    this._text = text;
    this.style = style;

    this.recalculateSize();
  }

  destroy() {
    super.destroy();
    this.style = null;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.beforeRender(ctx);
    ctx.font = `${this.style.size}px ${this.style.font}`;
    ctx.fillStyle = this.style.color;
    ctx.fillText(this._text, this._x, this._y + this.drawingOffset);
    this.afterRender(ctx);
  }

  get text(): string {
    return this._text;
  }
  set text(value: string) {
    this._text = value;
    this.recalculateSize();
  }

  get height(): number {
    return this.style.size;
  }

  recalculateSize() {
    const tmpContext = getTemporaryCanvasContext();
    tmpContext.font = `${this.style.size}px ${this.style.font}`;

    this.metrix = tmpContext.measureText(this._text);
    this._width = this.metrix.width;
    this._height = this.metrix.actualBoundingBoxAscent + this.metrix.actualBoundingBoxDescent;

    this.drawingOffset =
      this.metrix.actualBoundingBoxAscent + (this.metrix.fontBoundingBoxDescent - this.metrix.actualBoundingBoxDescent);
  }
}

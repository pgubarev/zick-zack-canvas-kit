import { DisplayObject } from '../DisplayObject';
import { getTemporaryCanvasContext } from '../../layers/utils';
import { TextStyle } from './types';


export class Text extends DisplayObject {
  private _text: string;

  private metrix: TextMetrics;
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

    if (this.style.fillStyle) {
      ctx.fillStyle = this.style.fillStyle;
      ctx.fillText(this._text, this._x, this._y + this._height);
    }

    if (this.style.strokeStyle) {
      if (this.style.strokeLineWidth) ctx.lineWidth = this.style.strokeLineWidth;
      ctx.strokeStyle = this.style.strokeStyle;
      ctx.strokeText(this._text, this._x, this._y + this._height);
    }

    this.afterRender(ctx);
  }

  get text(): string {
    return this._text;
  }
  set text(value: string) {
    this._text = value;
    this.recalculateSize();
  }

  recalculateSize() {
    const tmpContext = getTemporaryCanvasContext();
    tmpContext.font = `${this.style.size}px ${this.style.font}`;

    this.metrix = tmpContext.measureText(this._text);
    this._width = this.metrix.width;
    this._height = this.metrix.fontBoundingBoxAscent - this.metrix.fontBoundingBoxDescent;
  }
}

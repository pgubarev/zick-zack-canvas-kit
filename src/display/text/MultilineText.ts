import { DisplayObject } from '../DisplayObject';
import { getTemporaryCanvasContext } from '../../layers/utils';
import { TextStyle } from './types';


export class MultilineText extends DisplayObject {
  private _text: string[];

  private metrix: TextMetrics;
  private _lineHeight: number;
  public style: TextStyle;
  public splitChar = '\n';

  constructor(text: string, style: TextStyle, splitChar = '\n') {
    super();
    this.splitChar = splitChar;
    this._text = text.split(splitChar);
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

      for (let i = 0; i < this._text.length; i++) {
        ctx.fillText(this._text[i], this._x, this._y + (i + 1) * this._lineHeight,);
      }
    }

    if (this.style.strokeStyle) {
      if (this.style.strokeLineWidth) ctx.lineWidth = this.style.strokeLineWidth;
      ctx.strokeStyle = this.style.strokeStyle;

      for (let i = 0; i < this._text.length; i++)
        ctx.strokeText(this._text[i], this._x, this._y + (i + 1) * this._lineHeight);
    }

    this.afterRender(ctx);
  }

  get text(): string {
    return this._text.join(this.splitChar);
  }
  set text(value: string) {
    this._text = value.split(this.splitChar);
    this.recalculateSize();
  }

  recalculateSize() {
    const tmpContext = getTemporaryCanvasContext();
    tmpContext.font = `${this.style.size}px ${this.style.font}`;

    let largestLine: TextMetrics = null;

    for (let i = 0; i < this._text.length; i++) {
        const metrix = tmpContext.measureText(this._text[i]);

        if (!largestLine || largestLine.width < metrix.width)
          largestLine = metrix;
    }

    this.metrix = largestLine;
    this._width = this.metrix.width;

    this._lineHeight = this.metrix.actualBoundingBoxAscent + this.metrix.actualBoundingBoxDescent;
    this._height = this._text.length * this._lineHeight;
  }
}

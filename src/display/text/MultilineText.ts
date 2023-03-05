import { DisplayObject } from '../DisplayObject';
import { getTemporaryCanvasContext } from '../../layers/utils';
import { TextStyle } from './types';


type MultilineTextStyle = {
  'textAlign': 'left' | 'center' | 'right';
} & TextStyle

export class MultilineText extends DisplayObject {
  private _text: string[];

  private metrix: TextMetrics[];
  private _lineHeight: number;
  public style: MultilineTextStyle;
  public splitChar = '\n';

  constructor(text: string, style: MultilineTextStyle, splitChar = '\n') {
    super();
    this.splitChar = splitChar;
    this._text = text.split(splitChar);
    this.style = style;

    this.metrix = [];
    this.metrix.length = this._text.length;

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
        if (!this.style.textAlign || this.style.textAlign === 'left')
          ctx.fillText(this._text[i], this._x, this._y + (i + 1) * this._lineHeight);
        else if (this.style.textAlign === 'center') {
          ctx.fillText(this._text[i], this._x + (this._width - this.metrix[i].width) / 2, this._y + (i + 1) * this._lineHeight);
        } else {
          ctx.fillText(this._text[i], this._x + this._width - this.metrix[i].width, this._y + (i + 1) * this._lineHeight);
        }
      }
    }

    if (this.style.strokeStyle) {
      if (this.style.strokeLineWidth) ctx.lineWidth = this.style.strokeLineWidth;
      ctx.strokeStyle = this.style.strokeStyle;

      for (let i = 0; i < this._text.length; i++) {
        if (!this.style.textAlign || this.style.textAlign === 'left')
          ctx.strokeText(this._text[i], this._x, this._y + (i + 1) * this._lineHeight);
        else if (this.style.textAlign === 'center') {
          ctx.strokeText(this._text[i], this._x + (this._width - this.metrix[i].width) / 2, this._y + (i + 1) * this._lineHeight);
        } else {
          ctx.strokeText(this._text[i], this._x + this._width - this.metrix[i].width, this._y + (i + 1) * this._lineHeight);
        }
      }
    }

    this.afterRender(ctx);
  }

  get text(): string {
    return this._text.join(this.splitChar);
  }
  set text(value: string) {
    this._text = value.split(this.splitChar);
    this.metrix.length = this._text.length;
    this.recalculateSize();
  }

  recalculateSize() {
    const tmpContext = getTemporaryCanvasContext();
    tmpContext.font = `${this.style.size}px ${this.style.font}`;

    let largestLine: TextMetrics = null;

    for (let i = 0; i < this._text.length; i++) {
        this.metrix[i] = tmpContext.measureText(this._text[i]);

        if (!largestLine || largestLine.width < this.metrix[i].width)
          largestLine = this.metrix[i];
    }

    this._width = largestLine.width;

    this._lineHeight = largestLine.actualBoundingBoxAscent + largestLine.actualBoundingBoxDescent;
    this._height = this._text.length * this._lineHeight;
  }
}

import { TBoundRect } from '../common';
import { DisplayObject } from './DisplayObject';

export class Sprite extends DisplayObject {
  protected sourceImage: HTMLImageElement;

  public sourceX: number;
  public sourceY: number;
  public sourceWidth: number;
  public sourceHeight: number;

  constructor(sourceImage: HTMLImageElement, sourceRect?: TBoundRect) {
    super();
    this.sourceImage = sourceImage;

    this.sourceX = sourceRect?.x || 0;
    this.sourceY = sourceRect?.y || 0;
    this.sourceWidth = sourceRect?.width || this.sourceImage.width;
    this.sourceHeight = sourceRect?.height || this.sourceImage.height;

    this._width = this.sourceWidth;
    this._height = this.sourceHeight;
  }

  destroy() {
    super.destroy();

    this.sourceImage = null;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.beforeRender(ctx);
    ctx.drawImage(
      this.sourceImage,
      this.sourceX,
      this.sourceY,
      this.sourceWidth,
      this.sourceHeight,
      this._x,
      this._y,
      this._width,
      this._height,
    );
    this.afterRender(ctx);
  }

  get width(): number {
    return this._width;
  }
  set width(value: number) {
    this._width = value | 0;
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    this._height = value | 0;
  }
}

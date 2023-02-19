import { TBoundRect } from 'common';

import { DisplayObject } from './DisplayObject';
import { RasterCanvasImageSource } from './types';

export class Sprite extends DisplayObject {
  protected sourceImage: RasterCanvasImageSource;

  public sourceX: number;
  public sourceY: number;
  public sourceWidth: number;
  public sourceHeight: number;

  constructor(sourceImage: RasterCanvasImageSource, sourceRect?: TBoundRect) {
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
}

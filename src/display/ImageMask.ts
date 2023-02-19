import { TBoundRect } from 'common';
import { applyContextSettings } from 'utils';
import { getTemporaryCanvas } from 'layers/utils';

import { BaseDisplayObject } from './DisplayObject';
import { IMask } from './interfaces';
import { RasterCanvasImageSource, RenderFunction } from './types';

export class ImageMask extends BaseDisplayObject implements IMask {
  public maskImage: RasterCanvasImageSource;

  private tmpCanvas: HTMLCanvasElement;
  private tmpCtx: CanvasRenderingContext2D;

  public sourceX: number;
  public sourceY: number;
  public sourceWidth: number;
  public sourceHeight: number;

  constructor(image: RasterCanvasImageSource, sourceRect?: TBoundRect) {
    super();

    this.maskImage = image;

    this.sourceX = sourceRect?.x || 0;
    this.sourceY = sourceRect?.y || 0;
    this.sourceWidth = sourceRect?.width || image.width;
    this.sourceHeight = sourceRect?.height || image.height;

    this._width = this.sourceWidth;
    this._height = this.sourceHeight;

    this.tmpCanvas = getTemporaryCanvas();
    this.tmpCanvas.width = Math.max(this.tmpCanvas.width, this._width);
    this.tmpCanvas.height = Math.max(this.tmpCanvas.height, this._height);

    this.tmpCtx = this.tmpCanvas.getContext('2d');
  }

  destroy() {
    super.destroy();

    this.maskImage = null;
    this.tmpCtx = null;
  }

  private prepareMask() {
    this.tmpCtx.globalCompositeOperation = 'source-over';
    this.tmpCtx.clearRect(0, 0, this._width, this._height);
  }

  renderWithMask(ctx: CanvasRenderingContext2D, originalRenderFunction: RenderFunction) {
    applyContextSettings(ctx, this.tmpCtx);
    this.prepareMask();
    originalRenderFunction.apply(this.parent, [this.tmpCtx]);
    this.render(ctx);
  }

  render(ctx: CanvasRenderingContext2D) {
    this.tmpCtx.globalCompositeOperation = 'destination-in';
    this.tmpCtx.drawImage(
      this.maskImage,
      this.sourceX,
      this.sourceY,
      this.sourceWidth,
      this.sourceHeight,
      0,
      0,
      this._width,
      this._height,
    );

    this.tmpCtx.globalCompositeOperation = 'source-over';
    ctx.drawImage(
      this.tmpCtx.canvas,
      0,
      0,
      this._width,
      this._height,
      this._x,
      this._y,
      this._width,
      this._height,
    );
  }

  set width(value: number) {
    this._width = value | 0;
    this.tmpCanvas.width = Math.max(this.tmpCanvas.width, this._width);
  }
  set height(value: number) {
    this._height = value | 0;
    this.tmpCanvas.height = Math.max(this.tmpCanvas.height, this._height);
  }
}

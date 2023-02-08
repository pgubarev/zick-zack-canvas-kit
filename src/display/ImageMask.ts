import { TBoundRect } from '../common';
import { BaseDisplayObject } from './DisplayObject';
import { IMask } from './interfaces';
import { RenderFunction } from './types';
import { getTemporaryCanvas } from '../layers/utils';
import { applyContextSettings } from '../utils/canvas';

export class ImageMask extends BaseDisplayObject implements IMask {
  public maskImage: HTMLImageElement;

  public sourceRect: TBoundRect;

  private tmpCanvas: HTMLCanvasElement;
  private tmpCtx: CanvasRenderingContext2D;

  constructor(image: HTMLImageElement, sourceRect: TBoundRect) {
    super();

    this.sourceRect = sourceRect;
    this.maskImage = image;

    this._width = this.sourceRect.width;
    this._height = this.sourceRect.height;

    this.tmpCanvas = getTemporaryCanvas();
    this.tmpCanvas.width = Math.max(this.tmpCanvas.width, this._width);
    this.tmpCanvas.height = Math.max(this.tmpCanvas.height, this._height);

    this.tmpCtx = this.tmpCanvas.getContext('2d');
  }

  destroy() {
    super.destroy();

    this.maskImage = null;
    this.sourceRect = null;

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
      this.sourceRect.x,
      this.sourceRect.y,
      this.sourceRect.width,
      this.sourceRect.height,
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
    this._width = value;
    this.tmpCanvas.width = Math.max(this.tmpCanvas.width, this._width);
  }
  set height(value: number) {
    this._height = value;
    this.tmpCanvas.height = Math.max(this.tmpCanvas.height, this._height);
  }
}

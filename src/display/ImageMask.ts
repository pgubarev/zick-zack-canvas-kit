import { TBoundRect } from '../common';
import { BaseDisplayObject } from './DisplayObject';
import { IMask } from './interfaces';
import { RasterCanvasImageSource, RenderFunction } from './types';
import { getTemporaryCanvasContext } from '../layers/utils';
import { applyContextSettings, rotateCanvas } from '../utils/canvas';

export class ImageMask extends BaseDisplayObject implements IMask {
  public maskImage: RasterCanvasImageSource;

  public tmpCanvas: HTMLCanvasElement;
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

    this.tmpCtx = getTemporaryCanvasContext(true);

    this.tmpCanvas = this.tmpCtx.canvas;
    this.tmpCanvas.width = Math.max(this.tmpCanvas.width, this._width);
    this.tmpCanvas.height = Math.max(this.tmpCanvas.height, this._height);
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

  private renderOriginal(originalRenderFunction: RenderFunction) {
    this.tmpCtx.translate(-this.x, -this.y);
    if (this._rotation !== 0) rotateCanvas(this.tmpCtx, -this._rotation, this.x + this.anchorX, this.y + this.anchorY);
    originalRenderFunction.apply(this.parent, [this.tmpCtx]);
    if (this._rotation !== 0) rotateCanvas(this.tmpCtx, this._rotation, this.x + this.anchorX, this.y + this.anchorY);
    this.tmpCtx.translate(this.x, this.y);
  }

  renderWithMask(ctx: CanvasRenderingContext2D, originalRenderFunction: RenderFunction) {
    applyContextSettings(ctx, this.tmpCtx);

    this.prepareMask();
    this.renderOriginal(originalRenderFunction);
    this.render(ctx);
  }

  render(ctx: CanvasRenderingContext2D) {
    const maskGlobalAnchorX = this.globalX + this.anchorX;
    const maskGlobalAnchorY = this.globalY + this.anchorY;

    if (this._rotation !== 0) rotateCanvas(ctx, this._rotation, maskGlobalAnchorX, maskGlobalAnchorY);
    ctx.drawImage(this.tmpCtx.canvas, 0, 0, this._width, this._height, this._x, this._y, this._width, this._height);
    if (this._rotation !== 0) rotateCanvas(ctx, -this._rotation, maskGlobalAnchorX, maskGlobalAnchorY);
  }

  get width(): number {
    return this._width;
  }
  set width(value: number) {
    this._width = value | 0;
    this.tmpCanvas.width = Math.max(this.tmpCanvas.width, this._width);
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    this._height = value | 0;
    this.tmpCanvas.height = Math.max(this.tmpCanvas.height, this._height);
  }
}

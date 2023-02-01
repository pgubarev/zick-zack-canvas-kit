import { TBoundRect } from '../common';
import {BaseDisplayObject} from './DisplayObject';
import { IMask } from './interfaces';
import { RenderFunction } from './types';

export class ImageMask extends BaseDisplayObject implements IMask {
    public maskImage: HTMLImageElement;

    public sourceRect: TBoundRect;

    constructor(image: HTMLImageElement, sourceRect: TBoundRect) {
        super();

        this.sourceRect = sourceRect;
        this.maskImage = image;
    }

    destroy() {
        super.destroy();

        this.maskImage = null;
        this.sourceRect = null;
    }

    private prepareMask(tmpCtx: CanvasRenderingContext2D) {
        // eslint-disable-next-line no-param-reassign
        tmpCtx.globalCompositeOperation = 'source-over';
        tmpCtx.setTransform(1, 0, 0, 1, 0, 0);

        tmpCtx.clearRect(0, 0, tmpCtx.canvas.width, tmpCtx.canvas.height);
        tmpCtx.drawImage(
            this.maskImage,
            this.sourceRect.x, this.sourceRect.y, this.sourceRect.width, this.sourceRect.height,
            0, 0, this._width, this._height,
        );

        tmpCtx.translate(-this.parent.globalX, -this.parent.globalY);
        // eslint-disable-next-line no-param-reassign
        tmpCtx.globalCompositeOperation = 'source-in';
    }

    renderWithMask(
        ctx: CanvasRenderingContext2D,
        tmpCtx: CanvasRenderingContext2D,
        originalRenderFunction: RenderFunction,
    ) {
        if (tmpCtx === null) throw new Error(
            'Temporary canvas are not provided, probably because of nested imageMask'
        );

        this.prepareMask(tmpCtx);
        originalRenderFunction.apply(this.parent, [tmpCtx, tmpCtx]);
        this.render(ctx, tmpCtx);
    }

    render(ctx: CanvasRenderingContext2D, tmpCtx: CanvasRenderingContext2D) {
        tmpCtx.setTransform(1, 0, 0, 1, 0, 0);
        // eslint-disable-next-line no-param-reassign
        tmpCtx.globalCompositeOperation = 'source-over';

        ctx.drawImage(
            tmpCtx.canvas,
            0, 0, this._width, this._height,
            this._globalX, this._globalY, this._width, this._height,
        );
    };

    set width(value: number) { this._width = value }
    set height(value: number) { this._height = value }
}

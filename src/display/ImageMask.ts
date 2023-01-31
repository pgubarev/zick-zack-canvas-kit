import { TBoundRect } from 'common';
import { createCanvasContext, LayersMap } from 'layers';
import { DisplayObject } from './DisplayObject';

export class ImageMask extends DisplayObject {
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public maskImage: HTMLImageElement;

    public sourceRect: TBoundRect;

    constructor(image: HTMLImageElement, sourceRect: TBoundRect, layerName = 'default') {
        super();

        this.sourceRect = sourceRect;
        this.maskImage = image;

        if (!LayersMap.has(layerName)) throw new Error(`Layer with name ${layerName} not found`);

        const { config } = LayersMap.get(layerName);

        this.canvas = document.createElement('canvas');
        this.canvas.width = this.sourceRect.width;
        this.canvas.height = this.sourceRect.height;

        this.ctx = createCanvasContext(this.canvas, config);
    }

    destroy() {
        super.destroy();

        this.maskImage = null;
        this.ctx = null;
        this.canvas = null;
        this.sourceRect = null;
    }

    renderWithMask(ctx: CanvasRenderingContext2D, children: DisplayObject[]) {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(
            this.maskImage,
            this.sourceRect.x, this.sourceRect.y, this.sourceRect.width, this.sourceRect.height,
            0, 0, this.canvas.width, this.canvas.height,
        );

        this.ctx.translate(-this.parent.globalX, -this.parent.globalY);
        this.ctx.globalCompositeOperation = 'source-in';

        for (let i = 0; i < children.length; i++) {
            children[i].render(this.ctx);
        }

        this.render(ctx);
    }

    render(ctx: CanvasRenderingContext2D) {
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.globalCompositeOperation = 'source-over';

        ctx.drawImage(
            this.canvas,
            0, 0, this.canvas.width, this.canvas.height,
            this._globalX, this._globalY, this.canvas.width, this.canvas.height,
        );
    }

    set width(value: number) { this.canvas.width = value }
    set height(value: number) { this.canvas.height = value }
}

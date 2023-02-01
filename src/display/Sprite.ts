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
        ctx.drawImage(
            this.sourceImage,
            this.sourceX, this.sourceY, this.sourceWidth, this.sourceHeight,
            this.globalX, this.globalY, this._width, this._height,
        );
    }

    get width(): number { return this.sourceImage?.width || 0 }
    set width(value: number) { this._width = value }

    get height(): number { return this.sourceImage?.height || 0 }
    set height(value: number) { this._height = value }
}

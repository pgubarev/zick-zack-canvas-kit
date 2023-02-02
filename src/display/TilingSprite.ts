import {DisplayObject} from "./DisplayObject";

export class TilingSprite extends DisplayObject {
    private pattern: CanvasPattern;

    constructor(pattern: CanvasPattern) {
        super();
        this.pattern = pattern;
    }

    destroy() {
        super.destroy();
        this.pattern = null;
    }

    render(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.pattern;
        ctx.fillRect(this.globalX, this.globalY, this._width, this._height);
    }

    get width(): number { return this._width; }
    set width(value: number) { this._width = value }

    get height(): number { return this._height; }
    set height(value: number) { this._height = value }
}

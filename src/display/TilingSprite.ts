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
        // ctx.save();
        ctx.fillStyle = this.pattern;
        ctx.fillRect(this.globalX, this.globalY, this._width, this._height);
        // ctx.restore();
    }

    set width(value: number) { this._width = value }
    set height(value: number) { this._height = value }
}

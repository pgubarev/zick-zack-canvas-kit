import { BasicGraphic } from 'display';

export class Rectangle extends BasicGraphic {
    public fillStyle: string | CanvasGradient | CanvasPattern = null;

    constructor(fillStyle: string | CanvasGradient | CanvasPattern) {
        super();
        this.fillStyle = fillStyle;
    }

    destroy() {
        super.destroy();
        this.fillStyle = null;
    }

    renderGraphic(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.fillStyle;
        ctx.fillRect(this._x, this._y, this._width, this._height);
    }
}

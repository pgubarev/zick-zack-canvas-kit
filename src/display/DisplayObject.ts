import { IDisplayable } from './interfaces';

export abstract class DisplayObject implements IDisplayable {
    protected _x = 0;
    protected _y = 0;

    protected _globalX = 0;
    protected _globalY = 0;

    protected _height = 0;
    protected _width = 0;

    public parent: DisplayObject = null;

    protected _mask: DisplayObject = null;

    abstract render(ctx: CanvasRenderingContext2D)

    destroy() {
        this.parent = null;

        if (this._mask !== null) {
            this._mask.destroy();
            this._mask = null;
        }
    }

    get height(): number { return this._height }
    get width(): number { return this._width }

    get x(): number { return this._x }
    set x(value: number) {
        if (this.parent === null) {
            this._x = value;
            this._globalX = value;
        } else {
            this._globalX = this.parent.globalX + value;
            this._x = value;
        }

        if (this._mask !== null) this._mask.updatePosition();
    }

    get y(): number { return this._y }
    set y(value: number) {
        if (this.parent === null) {
            this._y = value;
            this._globalY = value;
        } else {
            this._globalY = this.parent.globalY + value;
            this._y = value;
        }

        if (this._mask !== null) this._mask.updatePosition();
    }

    get globalX(): number { return this._globalX }
    get globalY(): number { return this._globalY }

    updatePosition() {
        if (this.parent === null) return;

        this._globalX = this.parent.globalX + this._x;
        this._globalY = this.parent.globalY + this._y;

        if (this._mask !== null) this._mask.updatePosition();
    }

    get mask(): DisplayObject {
        return this._mask;
    }
    set mask(value: DisplayObject) {
        if (this._mask !== null) {
            this._mask.parent = null;
        }

        if (value !== null) {
            if (value?.mask) throw new Error('Nested masks are not supported');

            // It's looks like bad practice, but link to parent have to be added here
            // eslint-disable-next-line no-param-reassign
            value.parent = this;
            value.updatePosition();
        }

        this._mask = value;
    }
}

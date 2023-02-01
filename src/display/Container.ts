import { rotateCanvas } from '../utils/canvas';
import { DisplayObject } from './DisplayObject';
import { IContainer } from './interfaces';

export class Container extends DisplayObject implements IContainer {
    children: DisplayObject[] = [];

    destroy(): void {
        this.children.forEach(child => child.destroy());
        this.children = null;

        super.destroy();
    }

    render(ctx: CanvasRenderingContext2D, tmpCtx: CanvasRenderingContext2D): void {
        if (this._mask === null) {
            this.renderChildren(ctx, tmpCtx);
            return;
        }

        this._mask.renderWithMask(ctx, tmpCtx, this.renderChildren);
    }

    private renderChildren(ctx: CanvasRenderingContext2D, tmpCtx: CanvasRenderingContext2D): void {
        if (this.rotation !== 0)
            rotateCanvas(ctx, this.rotation, this.anchorX, this.anchorY);

        for (let i = 0; i < this.children.length; i++) {
            // TODO: it would be greate to add some logic to skip rendering
            //  for children outside container bounds
            this.children[i].render(ctx, tmpCtx);
        }

        if (this.rotation !== 0)
            rotateCanvas(ctx, -this.rotation, this.anchorX, this.anchorY);
    }

    appendChild(child: DisplayObject): void {
        this.children.push(child);

        // It's looks like bad practice, but link to parent have to be added here
        // eslint-disable-next-line no-param-reassign
        child.parent = this;
        child.updatePosition();
        this.recalculateSize();
    }

    removeChild(child: DisplayObject): void {
        const index = this.children.indexOf(child);
        if (index === -1) return;

        this.children.splice(index, 1);

        // It's looks like bad practice, but link to parent have to be removed here
        // eslint-disable-next-line no-param-reassign
        child.parent = null;
        this.recalculateSize();
    }

    get x(): number { return this._x }
    set x(value: number) {
        super.x = value;
        this._updateChildrenPositions();
    }

    get y(): number { return this._y }
    set y(value: number) {
        super.y = value;
        this._updateChildrenPositions();
    }

    updatePosition() {
        super.updatePosition();
        this._updateChildrenPositions();
    }

    private recalculateSize() {
        if (this.children.length === 0) {
            this._width = 0;
            this._height = 0;
            return
        }

        for (let i = 0; i < this.children.length; i++) {
            this._width  = Math.max(this.children[i].x + this.children[i].width, this._width );
            this._height = Math.max(this.children[i].y + this.children[i].height, this._height);
        }
    }

    protected _updateChildrenPositions() {
        if (this.children.length === 0) return;

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updatePosition();
        }
    }

    propagate(event: PointerEvent, type: string) {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].containsPoint(event.clientX, event.clientY))
                this.children[i].propagate(event, type);
        }

        if (this._emitter === null) return;
        this._emitter.emit(type, event);
    }
}

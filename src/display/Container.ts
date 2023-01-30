import { DisplayObject } from './DisplayObject';
import { IContainer } from './interfaces';
import { ImageMask } from './ImageMask';


export class Container extends DisplayObject implements IContainer {
    children: DisplayObject[] = [];

    destroy(): void {
        this.children.forEach(child => child.destroy());
        this.children = null;

        super.destroy();
    }

    render(ctx: CanvasRenderingContext2D): void {
        if (this._mask === null) {
            this.renderChildren(ctx);
            return;
        }

        if (this._mask instanceof ImageMask) {
            this._mask.renderWithMask(ctx, this.children);
        }

        // TODO: add support for clip mask
    }

    private renderChildren(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.children.length; i++) {
            // TODO: it would be greate to add some logic to skip rendering
            //  for children outside container bounds
            this.children[i].render(ctx);
        }
    }

    appendChild(child: DisplayObject): void {
        this.children.push(child);

        // It's looks like bad practice, but link to parent have to be added here
        // eslint-disable-next-line no-param-reassign
        child.parent = this;
        child.updatePosition();
    }

    removeChild(child: DisplayObject): void {
        const index = this.children.indexOf(child);
        if (index === -1) return;

        this.children.splice(index, 1);

        // It's looks like bad practice, but link to parent have to be removed here
        // eslint-disable-next-line no-param-reassign
        child.parent = null;
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

    protected _updateChildrenPositions() {
        if (this.children.length === 0) return;

        for (let i = 0; i < this.children.length; i++) {
            this.children[i].updatePosition();
        }
    }
}

import { DisplayObject } from './DisplayObject';
import { IContainer } from './interfaces';

export class Container extends DisplayObject implements IContainer {
  children: DisplayObject[] = [];

  destroy(): void {
    super.destroy();
    this.children.forEach((child) => child.destroy());
    this.children = null;

    super.destroy();
  }

  beforeRender(ctx:CanvasRenderingContext2D) {
    ctx.translate(this._x, this._y);
    super.beforeRender(ctx);
  }

  afterRender(ctx:CanvasRenderingContext2D) {
    super.afterRender(ctx);
    ctx.translate(-this._x, -this._y);
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.beforeRender(ctx);

    if (this._mask === null) {
      this.renderChildren(ctx);
      this.afterRender(ctx);
      return;
    }

    this._mask.renderWithMask(ctx, this.renderChildren);
    this.afterRender(ctx);
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
    child.parent = this;
    child.updatePosition();
    this.recalculateSize();
  }

  removeChild(child: DisplayObject): void {
    const index = this.children.indexOf(child);
    if (index === -1) return;

    this.children.splice(index, 1);

    // It's looks like bad practice, but link to parent have to be removed here
    child.parent = null;
    this.recalculateSize();
  }

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    super.x = value;
    this._updateChildrenPositions();
  }

  get y(): number {
    return this._y;
  }
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
      return;
    }

    for (let i = 0; i < this.children.length; i++) {
      this._width = Math.max(this.children[i].x + this.children[i].width, this._width) | 0;
      this._height = Math.max(this.children[i].y + this.children[i].height, this._height) | 0;
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
      if (this.children[i].containsPoint(event.clientX, event.clientY)) this.children[i].propagate(event, type);
    }

    if (this._events === null) return;
    this._events.emit(type, event);
  }
}

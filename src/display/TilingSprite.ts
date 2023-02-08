import { DisplayObject } from './DisplayObject';

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
    this.beforeRender(ctx);
    ctx.fillStyle = this.pattern;
    ctx.fillRect(this._x, this._y, this._width, this._height);
    this.afterRender(ctx);
  }

  get width(): number {
    return this._width;
  }
  set width(value: number) {
    this._width = value | 0;
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    this._height = value | 0;
  }
}

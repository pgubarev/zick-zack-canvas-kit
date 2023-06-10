import { Container, DisplayObject } from '../display';
import { getTemporaryCanvasContext } from '../layers/utils';
import { ZickZackEvent } from '../events';

export type TScrollSettings = {
  visibleAreaWidth: number;
  visibleAreaHeight: number;
  scrollDirection: 'horizontal' | 'vertical' | 'both' | 'disabled';
};

export class ScrollContainer extends Container {
  public content: DisplayObject;
  public scrollDirection: 'horizontal' | 'vertical' | 'both' | 'disabled';

  protected readonly visibleAreaWidth: number;
  protected readonly visibleAreaHeight: number;

  protected tmpCanvas: HTMLCanvasElement;
  protected tmpCtx: CanvasRenderingContext2D;

  protected lastX: number | null;
  protected lastY: number | null;

  protected deltaX: number;
  protected deltaY: number;

  protected dragging: boolean;
  protected scrolling: boolean;

  constructor(content: DisplayObject, config: TScrollSettings) {
    super();
    this.interactive = true;

    this.content = content;
    this.content.x = 0;
    this.content.y = 0;

    if (this.content.parent) {
      throw new Error('Scroll content should not be be added to any other container');
    }

    this.scrollDirection = config.scrollDirection;
    this.visibleAreaWidth = config.visibleAreaWidth;
    this.visibleAreaHeight = config.visibleAreaHeight;

    this.tmpCtx = getTemporaryCanvasContext(true);
    this.tmpCanvas = this.tmpCtx.canvas;
    this.tmpCanvas.width = this.visibleAreaWidth;
    this.tmpCanvas.height = this.visibleAreaHeight;

    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragCanceled = this.onDragCanceled.bind(this);

    this.events.on('pointerdown', this.onDragStart);
    this.events.on('pointerup', this.onDragEnd);
    this.events.on('pointerupoutside', this.onDragCanceled);
    this.events.on('pointermove', this.onDragMove);

    this._width = this.visibleAreaWidth;
    this._height = this.visibleAreaHeight;

    this.deltaX = 0;
    this.deltaY = 0;
  }

  destroy() {
    super.destroy();

    this.tmpCanvas = null;
    this.tmpCtx = null;
  }

  render(ctx: CanvasRenderingContext2D): void {
    this.beforeRender(ctx);
    this.tmpCtx.clearRect(0, 0, this.visibleAreaWidth, this.visibleAreaHeight);
    this.content.render(this.tmpCtx);
    ctx.drawImage(
      this.tmpCanvas,
      0,
      0,
      this.visibleAreaWidth,
      this.visibleAreaHeight,
      0,
      0,
      this.visibleAreaWidth,
      this.visibleAreaHeight,
    );
    this.afterRender(ctx);
  }

  preventScrolling() {
    this.scrolling = false;
  }

  scrollTo(x: number, y: number, canceled: boolean) {
    this.content.x = x;
    this.content.y = y;
  }

  protected getYInAvailableArea(y: number): number {
    if (y > 0 || this.content.height < this.visibleAreaHeight) {
      return 0;
    }

    if (y + this.content.height < this.visibleAreaHeight) {
      return -this.content.height + this.visibleAreaHeight;
    }

    return y;
  }

  protected getXInAvailableArea(x: number): number {
    if (x > 0 || this.content.width < this.visibleAreaWidth) {
      return 0;
    }

    if (x + this.content.width < this.visibleAreaWidth) {
      return -this.content.width + this.visibleAreaWidth;
    }

    return x;
  }

  private onDragStart(event: ZickZackEvent) {
    this.preventScrolling();

    this.lastX = event.pointerX;
    this.lastY = event.pointerY;
    this.dragging = true;

    this.deltaX = 0;
    this.deltaY = 0;
  }

  onDragMove(event: ZickZackEvent) {
    if (!this.dragging) return;

    let toX = this.content.x;
    let toY = this.content.y;

    if (this.scrollDirection === 'vertical' || this.scrollDirection === 'both') {
      this.deltaY += event.pointerY - this.lastY;
      toY += event.pointerY - this.lastY;
    }

    if (this.scrollDirection === 'horizontal' || this.scrollDirection === 'both') {
      this.deltaX += event.pointerX - this.lastX;
      toX += event.pointerX - this.lastX;
    }

    this.scrollTo(toX, toY, false);

    this.lastX = event.pointerX;
    this.lastY = event.pointerY;
  }

  onDragEnd() {
    let toX = this.content.x + this.deltaX;
    let toY = this.content.y + this.deltaY;

    if (this.scrollDirection === 'vertical' || this.scrollDirection === 'both') {
      toY = this.getYInAvailableArea(toY);
    }

    if (this.scrollDirection === 'horizontal' || this.scrollDirection === 'both') {
      toX = this.getXInAvailableArea(toX);
    }

    this.dragging = false;
    this.scrollTo(toX, toY, false);
  }

  onDragCanceled() {
    this.dragging = false;

    let toX = this.content.x + this.deltaX;
    let toY = this.content.y + this.deltaY;

    if (this.scrollDirection === 'vertical' || this.scrollDirection === 'both') {
      toY = this.getYInAvailableArea(toY);
    }

    if (this.scrollDirection === 'horizontal' || this.scrollDirection === 'both') {
      toX = this.getXInAvailableArea(toX);
    }

    this.scrollTo(toX, toY, true);
  }
}

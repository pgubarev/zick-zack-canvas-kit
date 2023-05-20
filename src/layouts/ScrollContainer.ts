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

    private readonly visibleAreaWidth: number;
    private readonly visibleAreaHeight: number;

    private tmpCanvas: HTMLCanvasElement;
    private tmpCtx: CanvasRenderingContext2D;

    private lastX: number | null;
    private lastY: number | null;
    private dragging: boolean;
    private scrolling: boolean;

    constructor(content: DisplayObject, config: TScrollSettings) {
        super();
        this.interactive = true;

        this.content = content;
        this.content.x = 0;
        this.content.y = 0;
        if (this.content.parent) {
            throw new Error("Scroll content should not be be added to any other container");
        }

        this.scrollDirection = config.scrollDirection;
        this.visibleAreaWidth = config.visibleAreaWidth;
        this.visibleAreaHeight = config.visibleAreaHeight;

        this.tmpCtx = getTemporaryCanvasContext(true);
        this.tmpCanvas = this.tmpCtx.canvas;
        this.tmpCanvas.width = this.visibleAreaWidth;
        this.tmpCanvas.height = this.visibleAreaHeight;

		this.onDragEnd = this.onDragEnd.bind(this)
		this.onDragMove = this.onDragMove.bind(this)
		this.onDragStart = this.onDragStart.bind(this)

		this.events.on('pointerdown', this.onDragStart);
		this.events.on('pointerup', this.onDragEnd);
        this.events.on('pointerupoutside', this.onDragEnd);
        this.events.on('pointermove', this.onDragMove);

        this._width = this.visibleAreaWidth;
        this._height = this.visibleAreaHeight;
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
            0, 0, this.visibleAreaWidth, this.visibleAreaHeight,
            0, 0, this.visibleAreaWidth, this.visibleAreaHeight,
        );
        this.afterRender(ctx);
    }

    preventScrolling() {
        this.scrolling = false;
    }

    scrollTo(x: number, y: number) {
        this.content.x = x;
        this.content.y = y;
    }

    private onDragStart(event: ZickZackEvent) {
		this.preventScrolling();

		this.lastX = event.pointerX;
		this.lastY = event.pointerY;
		this.dragging = true
	}

	onDragMove(event: ZickZackEvent) {
		if (!this.dragging) return

		if (this.scrollDirection === 'vertical' || this.scrollDirection === 'both') {
			this.content.y += (event.pointerY - this.lastY);
		}

		if (this.scrollDirection === 'horizontal' || this.scrollDirection === 'both') {
			this.content.x += (event.pointerX - this.lastX)
		}

		this.lastX = event.pointerX;
		this.lastY = event.pointerY;
	}

	onDragEnd() {
        let toX = this.content.x;
        let toY = this.content.y;

		if (this.scrollDirection === 'vertical' || this.scrollDirection === 'both') {
			if (this.content.y > 0)
				toY = 0

			if (this.content.y + this.content.height < this.visibleAreaHeight)
				toY = -this.content.height + this.visibleAreaHeight

			if (this.content.height < this.visibleAreaHeight)
				toY = 0
		}

		if (this.scrollDirection === 'horizontal' || this.scrollDirection === 'both') {
			if (this.content.x > 0)
				toX = 0

			if (this.content.x + this.content.width < this.visibleAreaWidth)
				toX = -this.content.width + this.visibleAreaWidth

			if (this.content.width < this.visibleAreaWidth)
				toX = 0
		}

        this.scrollTo(toX, toY);
		this.dragging = false;
	}
}

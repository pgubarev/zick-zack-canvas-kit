import { DisplayObject } from './DisplayObject';

type TextStyle = {
    font: string;
    size: number;
    color: string;
};

export class Text extends DisplayObject {
    private _text: string;
    private needRecalculateWidth: boolean;
    public style: TextStyle;

    constructor(text: string, style: TextStyle) {
        super();
        this._text = text;
        this.style = style;
        this.needRecalculateWidth = true;
    }

    destroy() {
        super.destroy();
        this.style = null;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.beforeRender(ctx);
        ctx.font = `${this.style.size}px ${this.style.font}`;
        ctx.fillStyle = this.style.color;
        ctx.fillText(this._text, this.globalX, this.globalY);

        if (this.needRecalculateWidth) {
            this._width = ctx.measureText(this._text).width;
            this.needRecalculateWidth = false;
        }

        this.afterRender(ctx);
    }

    get text(): string { return this._text; }
    set text(value: string) { this._text = value; }

    get height(): number { return this.style.size; }
}

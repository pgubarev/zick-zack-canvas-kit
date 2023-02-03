import { DisplayObject } from './DisplayObject';
import { getTemporaryCanvas } from '../layers/utils';

type TextStyle = {
    font: string;
    size: number;
    color: string;
};

export class Text extends DisplayObject {
    private _text: string;
    public style: TextStyle;

    private tmpContext: CanvasRenderingContext2D = null;

    constructor(text: string, style: TextStyle) {
        super();
        this._text = text;
        this.style = style;
    }

    destroy() {
        super.destroy();
        this.style = null;
        this.tmpContext = null;
    }

    render(ctx: CanvasRenderingContext2D) {
        this.beforeRender(ctx);
        ctx.font = `${this.style.size}px ${this.style.font}`;
        ctx.fillStyle = this.style.color;
        ctx.fillText(this._text, this.globalX, this.globalY);
        this.afterRender(ctx);
    }

    get text(): string { return this._text; }
    set text(value: string) { this._text = value; }

    get height(): number { return this.style.size; }
    get width(): number {
        if (this.tmpContext === null)
            this.tmpContext = getTemporaryCanvas().getContext('2d');

        this.tmpContext.font = `${this.style.size}px ${this.style.font}`;
        return this.tmpContext.measureText(this._text).width;
    }
}

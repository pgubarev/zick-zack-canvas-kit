import { DisplayObject } from './DisplayObject';


export abstract class BasicGraphic extends DisplayObject {

    render(ctx: CanvasRenderingContext2D) {
        this.beforeRender(ctx);
        this.renderGraphic(ctx);
        this.afterRender(ctx);
    }

    abstract renderGraphic(ctx: CanvasRenderingContext2D);
}

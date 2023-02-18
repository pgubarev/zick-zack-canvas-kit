import { IDisplayable } from "../display/interfaces";
import { getTemporaryCanvas } from '../layers/utils';

export async function createBitmapDataFrom(displayObject: IDisplayable): Promise<ImageBitmap> {
    const tmpCanvas = getTemporaryCanvas();
    tmpCanvas.width = Math.max(displayObject.width, tmpCanvas.width);
    tmpCanvas.height = Math.max(displayObject.height, tmpCanvas.height);

    const tmpCtx = tmpCanvas.getContext("2d");

    tmpCtx.setTransform(1, 0, 0, 1, 0, 0);
    tmpCtx.clearRect(0, 0, displayObject.width, displayObject.height);

    displayObject.render(tmpCtx);

    return createImageBitmap(tmpCtx.canvas, 0, 0, displayObject.width, displayObject.height);
}

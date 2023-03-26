import { IDisplayable } from '../display/interfaces';
import { getTemporaryCanvasContext } from '../layers/utils';

export async function createBitmapDataFrom(displayObject: IDisplayable): Promise<ImageBitmap> {
  const tmpCtx = getTemporaryCanvasContext();

  tmpCtx.canvas.width = Math.max(displayObject.width, tmpCtx.canvas.width);
  tmpCtx.canvas.height = Math.max(displayObject.height, tmpCtx.canvas.height);

  tmpCtx.setTransform(1, 0, 0, 1, 0, 0);
  tmpCtx.clearRect(0, 0, displayObject.width, displayObject.height);

  displayObject.render(tmpCtx);

  return createImageBitmap(tmpCtx.canvas, 0, 0, displayObject.width, displayObject.height);
}

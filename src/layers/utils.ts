import { TConfig } from './configs';

export function createCanvasContext(config: TConfig): CanvasRenderingContext2D {
  const canvas = <HTMLCanvasElement>document.createElement('canvas');
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  if (config.usePixelated) canvas.style.imageRendering = 'pixelated';

  const ctx = canvas.getContext('2d');

  // Set up image smoothing
  if (config.imageSmoothingQuality === undefined || config.imageSmoothingQuality === 'disabled') {
    // @ts-ignore
    ctx.mozImageSmoothingEnabled = false;
    // @ts-ignore
    ctx.webkitImageSmoothingEnabled = false;
    // @ts-ignore
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
  } else {
    // @ts-ignore
    ctx.mozImageSmoothingEnabled = true;
    // @ts-ignore
    ctx.webkitImageSmoothingEnabled = true;
    // @ts-ignore
    ctx.msImageSmoothingEnabled = true;
    ctx.imageSmoothingEnabled = true;

    ctx.imageSmoothingQuality = config.imageSmoothingQuality;
  }

  return ctx;
}

let temporaryCanvas: HTMLCanvasElement = null;

export function getTemporaryCanvas(): HTMLCanvasElement {
  if (temporaryCanvas === null)
    temporaryCanvas = <HTMLCanvasElement>document.createElement('canvas');

  return temporaryCanvas;
}

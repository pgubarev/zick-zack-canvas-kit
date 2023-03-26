import { CONFIG, TConfig } from './configs';
import { setSmoothlingSetting } from '../utils/canvas';

export function createCanvasAndContext(config: TConfig): CanvasRenderingContext2D {
  const canvas = <HTMLCanvasElement>document.createElement('canvas');
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  if (config.usePixelated) canvas.style.imageRendering = 'pixelated';

  const ctx = canvas.getContext('2d');
  setSmoothlingSetting(ctx, config.imageSmoothingQuality);

  return ctx;
}

export function createCanvasContext(canvas: HTMLCanvasElement, config: TConfig): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  setSmoothlingSetting(ctx, config.imageSmoothingQuality);

  return ctx;
}

let temporaryCanvas: HTMLCanvasElement = null;
let temporaryCanvasContext: CanvasRenderingContext2D = null;

function createTemporaryCanvas(): HTMLCanvasElement {
  const canvas = <HTMLCanvasElement>document.createElement('canvas');
  if (CONFIG.usePixelated) canvas.style.imageRendering = 'pixelated';

  return canvas;
}

export function getTemporaryCanvasContext(create = false): CanvasRenderingContext2D {
  if (create) {
    const canvas = createTemporaryCanvas();
    const ctx = canvas.getContext('2d');
    setSmoothlingSetting(ctx);
    return ctx;
  }

  if (temporaryCanvas === null) {
    temporaryCanvas = createTemporaryCanvas();
    temporaryCanvasContext = temporaryCanvas.getContext('2d');
    setSmoothlingSetting(temporaryCanvasContext);
  }
  return temporaryCanvasContext;
}

import { setSmoothlingSetting } from 'utils';
import { CONFIG } from './configs';
import { TConfig } from './types';

export function createCanvasContext(config: TConfig): CanvasRenderingContext2D {
  const canvas = <HTMLCanvasElement>document.createElement('canvas');
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  if (config.usePixelated) {
    canvas.style.imageRendering = 'pixelated';
  }

  const ctx = canvas.getContext('2d');
  setSmoothlingSetting(ctx);

  return ctx;
}

let temporaryCanvas: HTMLCanvasElement = null;
let temporaryCanvasContext: CanvasRenderingContext2D = null;

function setUpTemporaryCanvas() {
  temporaryCanvas = <HTMLCanvasElement>document.createElement('canvas');
  if (CONFIG.usePixelated) temporaryCanvas.style.imageRendering = 'pixelated';

  temporaryCanvasContext = temporaryCanvas.getContext('2d');
  setSmoothlingSetting(temporaryCanvasContext);
}

export function getTemporaryCanvas(): HTMLCanvasElement {
  if (temporaryCanvas === null) setUpTemporaryCanvas();
  return temporaryCanvas;
}

export function getTemporaryCanvasContext(): CanvasRenderingContext2D {
  if (temporaryCanvas === null) setUpTemporaryCanvas();
  return temporaryCanvasContext;
}

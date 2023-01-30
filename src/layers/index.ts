import { Layer } from './layer';
import { TConfigOptions, createApplicationConfig } from "./configs";

function createCanvasContext(canvas, options: TConfigOptions): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');

  // Set up image smoothing
  if (options.imageSmoothingQuality === undefined || options.imageSmoothingQuality === 'disabled') {
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

    ctx.imageSmoothingQuality = options.imageSmoothingQuality;
  }

  return ctx;
}

export function createLayer(name: string, options: TConfigOptions) {
  const config = createApplicationConfig(options);

  const canvas = <HTMLCanvasElement>document.createElement('canvas');
  canvas.id = name;
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  if (options.usePixelated) canvas.style.imageRendering = 'pixelated';

  const ctx = createCanvasContext(canvas, options);

  document.body.appendChild(canvas);

  return new Layer(name, config, canvas, ctx);
}

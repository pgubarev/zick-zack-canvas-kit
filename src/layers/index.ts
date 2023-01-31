import { Layer } from './Layer';
import {TConfigOptions, createApplicationConfig, TConfig} from "./configs";

export function createCanvasContext(canvas, options: TConfig): CanvasRenderingContext2D {
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

export const LayersMap: Map<string, Layer> = new Map();

export function createLayer(options: TConfigOptions, name = 'default') {
  if (LayersMap.has(name)) throw new Error(`Layer with name ${name} already exists`);

  const config = createApplicationConfig(options);

  const canvas = <HTMLCanvasElement>document.createElement('canvas');
  canvas.id = name;
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  if (config.usePixelated) canvas.style.imageRendering = 'pixelated';

  const ctx = createCanvasContext(canvas, config);

  document.body.appendChild(canvas);

  const layer = new Layer(name, config, canvas, ctx);
  LayersMap.set(name, layer);
  return layer;
}

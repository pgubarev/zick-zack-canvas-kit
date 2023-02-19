export type RenderFunction = (ctx: CanvasRenderingContext2D, tmpCtx?: CanvasRenderingContext2D) => void;

// Same as CanvasImageSource, but without SVG support
export type RasterCanvasImageSource =
  | HTMLImageElement
  | HTMLVideoElement
  | HTMLCanvasElement
  | ImageBitmap
  | OffscreenCanvas;

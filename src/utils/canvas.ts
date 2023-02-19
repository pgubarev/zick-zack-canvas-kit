export function rotateCanvas(ctx: CanvasRenderingContext2D, angele: number, anchorX: number, anchorY: number) {
  ctx.translate(anchorX, anchorY);
  ctx.rotate(angele);
  ctx.translate(-anchorX, -anchorY);
}

export function applyContextSettings(fromContext: CanvasRenderingContext2D, toContext: CanvasRenderingContext2D) {
  // @ts-ignore
  toContext.mozImageSmoothingEnabled = fromContext.mozImageSmoothingEnabled;
  // @ts-ignore
  toContext.webkitImageSmoothingEnabled = fromContext.webkitImageSmoothingEnabled;
  // @ts-ignore
  toContext.msImageSmoothingEnabled = fromContext.msImageSmoothingEnabled;
  toContext.imageSmoothingEnabled = fromContext.imageSmoothingEnabled;

  toContext.imageSmoothingQuality = fromContext.imageSmoothingQuality;
}

export function setSmoothlingSetting(
  ctx: CanvasRenderingContext2D,
  imageSmoothingQuality?: ImageSmoothingQuality | 'disabled',
) {
  // Set up image smoothing
  if (imageSmoothingQuality === undefined || imageSmoothingQuality === 'disabled') {
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

    ctx.imageSmoothingQuality = imageSmoothingQuality;
  }
}

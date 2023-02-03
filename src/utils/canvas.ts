
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

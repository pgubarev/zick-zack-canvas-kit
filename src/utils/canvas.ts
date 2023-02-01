
export function rotateCanvas(ctx: CanvasRenderingContext2D, angele: number, anchorX: number, anchorY: number) {
    ctx.translate(anchorX, anchorY);
    ctx.rotate(angele);
    ctx.translate(-anchorX, -anchorY);
}

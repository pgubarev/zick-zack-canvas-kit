export interface IDisplayable {
  render(ctx: CanvasRenderingContext2D): void;
  destroy(): void;

  get x(): number;
  set x(value: number);

  get y(): number;
  set y(value: number);

  get width(): number;
  get height(): number;

  get globalX(): number;
  get globalY(): number;

  updatePosition(): void;
}

export interface IContainer extends IDisplayable {
  children: IDisplayable[];

  appendChild(child: IDisplayable): void;
  removeChild(child: IDisplayable): void;
}

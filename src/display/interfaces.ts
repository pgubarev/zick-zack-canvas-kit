import { RenderFunction } from './types';

export interface IDisplayable {
  render(ctx: CanvasRenderingContext2D): void;
  destroy(): void;

  get x(): number;
  set x(value: number);

  get y(): number;
  set y(value: number);

  get width(): number;
  set width(value: number);

  get height(): number;
  set height(value: number);

  get globalX(): number;
  get globalY(): number;

  containsPoint(clickX: number, clickY: number): boolean;
  updatePosition(): void;
  parent: IDisplayable;

  get anchorX(): number;
  set anchorX(value: number);

  get anchorY(): number;
  set anchorY(value: number);

  get rotation(): number;
  set rotation(value: number);
}

export interface IMask extends IDisplayable {
  renderWithMask(ctx: CanvasRenderingContext2D, originalRenderFunction: RenderFunction): void;
}

export interface IContainer extends IDisplayable {
  children: IDisplayable[];

  appendChild(child: IDisplayable): void;
  removeChild(child: IDisplayable): void;
}

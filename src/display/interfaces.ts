import { EventEmitter } from 'eventemitter3';

import { RenderFunction } from './types';

export interface IDisplayable {
  render(ctx: CanvasRenderingContext2D, tmpCtx: CanvasRenderingContext2D): void;
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

  parent: IDisplayable;

  get anchorX(): number;
  set anchorX(value: number);

  get anchorY(): number;
  set anchorY(value: number);
}

export interface IMask extends IDisplayable {
  renderWithMask(
      ctx: CanvasRenderingContext2D,
      tmpCtx: CanvasRenderingContext2D,
      originalRenderFunction: RenderFunction,
  );
}

export interface IContainer extends IDisplayable {
  children: IDisplayable[];

  appendChild(child: IDisplayable): void;
  removeChild(child: IDisplayable): void;
}

export interface IClickable {
  containsPoint(clickX: number, clickY: number): boolean;
  propagate(event: PointerEvent, type: string);

  get emitter(): EventEmitter;
}

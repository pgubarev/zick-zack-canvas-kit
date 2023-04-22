import { EventEmitter } from 'eventemitter3';

import { IDisplayable, IMask } from './interfaces';
import { IInteractive } from '../events/interfaces';
import { rotateCanvas } from '../utils/canvas';

export abstract class BaseDisplayObject implements IDisplayable {
  protected _x = 0;
  protected _y = 0;

  protected _globalX = 0;
  protected _globalY = 0;

  protected _height = 0;
  protected _width = 0;

  protected _rotation = 0;
  protected _anchorX = 0;
  protected _anchorY = 0;

  public parent: IDisplayable = null;

  abstract render(ctx: CanvasRenderingContext2D): void;

  destroy() {
    this.parent = null;
  }

  get height(): number {
    return this._height;
  }
  set height(value: number) {
    this._height = value | 0;
  }
  get width(): number {
    return this._width;
  }
  set width(value: number) {
    this._width = value | 0;
  }

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    this._x = value | 0;
    this._globalX = this.parent === null ? this._x : this.parent.globalX + this._x;
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    this._y = value | 0;
    this._globalY = this.parent === null ? this._y : this.parent.globalY + this._y;
  }

  get globalX(): number {
    return this._globalX;
  }
  get globalY(): number {
    return this._globalY;
  }

  updatePosition() {
    this._globalX = this.parent.globalX + this._x;
    this._globalY = this.parent.globalY + this._y;
  }

  get anchorX(): number {
    return this._anchorX;
  }
  set anchorX(value: number) {
    this._anchorX = value | 0;
  }

  get anchorY(): number {
    return this._anchorY;
  }
  set anchorY(value: number) {
    this._anchorY = value | 0;
  }

  get rotation(): number {
    return this._rotation;
  }
  set rotation(value: number) {
    this._rotation = value;
  }

  containsPoint(clickX: number, clickY: number): boolean {
    return (
      this._globalX <= clickX &&
      this._globalX + this._width >= clickX &&
      this._globalY <= clickY &&
      this._globalY + this._height >= clickY
    );
  }
}

export abstract class DisplayObject extends BaseDisplayObject implements IInteractive {
  protected _mask: IMask = null;
  protected _events: EventEmitter = null;

  protected _alpha: number;

  public interactive: boolean;

  constructor() {
    super();

    this.interactive = false;
  }

  destroy() {
    super.destroy();

    if (this._events !== null) {
      this._events.removeAllListeners();
      this._events = null;
    }

    if (this._mask !== null) {
      this._mask.destroy();
      this._mask = null;
    }
  }

  get x(): number {
    return this._x;
  }
  set x(value: number) {
    super.x = value;
    if (this._mask !== null) this._mask.updatePosition();
  }

  get y(): number {
    return this._y;
  }
  set y(value: number) {
    super.y = value;
    if (this._mask !== null) this._mask.updatePosition();
  }

  updatePosition() {
    if (this.parent === null) return;

    super.updatePosition();
    if (this._mask !== null) this._mask.updatePosition();
  }

  get alpha(): number {
    return this._alpha;
  }
  set alpha(value: number) {
    this._alpha = value;
  }

  get mask(): IMask {
    return this._mask;
  }
  set mask(value: IMask) {
    if (this._mask !== null) {
      this._mask.parent = null;
    }

    if (value !== null) {
      // It's looks like bad practice, but link to parent have to be added here
      value.parent = this;
      value.updatePosition();
    }

    this._mask = value;
  }

  beforeRender(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha -= 1 - this._alpha;

    if (this._rotation !== 0) rotateCanvas(ctx, this._rotation, this.anchorX, this.anchorY);
  }
  afterRender(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha += 1 - this._alpha;

    if (this._rotation !== 0) rotateCanvas(ctx, -this._rotation, this.anchorX, this.anchorY);
  }

  containsPoint(clickX: number, clickY: number): boolean {
    if (this._mask !== null) return this._mask.containsPoint(clickX, clickY);
    return super.containsPoint(clickX, clickY);
  }

  get events(): EventEmitter {
    // Try to implement on demand creation for Event emitter
    if (this._events === null) this._events = new EventEmitter();
    return this._events;
  }
}

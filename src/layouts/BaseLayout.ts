import { Container, DisplayObject } from '../display';

export abstract class BaseLayout extends Container {
  protected _viewportHeight = 0;
  protected _viewportWidth = 0;
  protected _gap = 0;

  removeChild(elem: DisplayObject) {
    super.removeChild(elem);
    this.update();
  }

  abstract update();

  setViewport(vWidth: number, vHeight: number) {
    this._viewportHeight = vHeight;
    this._viewportWidth = vWidth;
  }

  get gap() { return this._gap; }
  set gap(value) {
    if (this._gap !== value) {
      this._gap = value;
      this.update();
    }
  }
}

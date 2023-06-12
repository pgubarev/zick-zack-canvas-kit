import { Container, DisplayObject } from '../display';

export abstract class BaseLayout extends Container {
  appendChild(elem: DisplayObject) {
    super.appendChild(elem);
    this.update();
  }

  removeChild(elem: DisplayObject) {
    super.removeChild(elem);
    this.update();
  }

  abstract update();
}

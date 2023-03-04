import { DisplayObject } from '../display';
import { HorizontalLayout } from './HorizontalLayout';

export class HorizontalCentredLayout extends HorizontalLayout {
  appendChild(elem: DisplayObject) {
    if (this.children.length > 0) {
      elem.y = (this._height - elem.height) / 2;

      const last = this.children[this.children.length - 1];
      elem.x = last.x + last.width + this._gap;
    } else {
      elem.y = 0;
      elem.x = 0;
    }

    super.appendChild(elem);
    if (elem.height > this._height) this.updateVerticalPositions();
  }

  updateVerticalPositions() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].y = (this._height - this.children[i].height) / 2;
    }
  }

  update() {
    super.update();
    this.updateVerticalPositions();
  }
}

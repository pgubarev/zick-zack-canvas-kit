import { DisplayObject } from '../display';
import { VerticalLayout } from './VerticalLayout';

export class VerticalCentredLayout extends VerticalLayout {
  appendChild(elem: DisplayObject) {
    if (this.children.length > 0) {
      elem.x = (this._width - elem.width) / 2;

      const last = this.children[this.children.length - 1];
      elem.y = last.y + last.height + this._gap;
    } else {
      elem.y = 0;
      elem.x = 0;
    }

    super.appendChild(elem);
    if (elem.width > this._width) this.updateHorizontalPositions();
  }

  updateHorizontalPositions() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].x = (this._width - this.children[i].width) / 2;
    }
  }

  update() {
    super.update();
    this.updateHorizontalPositions();
  }
}

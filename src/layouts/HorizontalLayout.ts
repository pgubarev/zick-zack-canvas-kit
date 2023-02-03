import { DisplayObject } from '../display';
import { BaseLayout } from './BaseLayout';

export class HorizontalLayout extends BaseLayout {
  appendChild(elem: DisplayObject) {
    elem.y = 0;
    if (this.children.length > 0) {
      const last = this.children[this.children.length - 1];
      elem.x = last.x + last.width + this._gap;
    } else {
      elem.x = 0;
    }

    super.appendChild(elem);
  }

  update() {
    if (this.children.length > 0) {
      this.children[0].x = 0;
      for (let i = 0; i < this.children.length; i++) {
        const prev = this.children[i - 1];
        this.children[i].x = prev.x + prev.width + this._gap;
      }
    }
  }
}

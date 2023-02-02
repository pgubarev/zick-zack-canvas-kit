import { DisplayObject } from '../display';
import { BaseLayout } from './BaseLayout';

export class UIVerticalLayout extends BaseLayout {
  appendChild(elem: DisplayObject) {
    elem.x = 0;
    if (this.children.length > 0) {
      const last = this.children[this.children.length - 1];
      elem.y = last.y + last.height + this._gap;
    } else {
      elem.y = 0;
    }

    super.appendChild(elem);
  }

  update() {
    if (this.children.length > 0) {
      this.children[0].y = 0;
      for (let i = 1; i < this.children.length; i++) {
        const prev = this.children[i - 1];
        this.children[i].y = prev.y + prev.height + this._gap;
      }
    }
  }
}

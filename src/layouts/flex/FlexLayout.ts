import { BaseLayout } from '../BaseLayout';

import { TFlexDirection, TFlexJustifyContent, TFlexAlignItems } from './types';

export class FlexLayout extends BaseLayout {
  protected _gap = 0;

  public direction: TFlexDirection;
  public justifyContent: TFlexJustifyContent;
  public alignItems: TFlexAlignItems;

  constructor() {
    super();

    this.direction = 'row';
    this.justifyContent = 'flex-start';
    this.alignItems = 'flex-start';
  }

  update() {
    const mainAxisSizeAttribute = this.direction === 'row' || this.direction === 'row-reverse' ? 'width' : 'height';
    const elementsTotalSize = this.children.reduce((accumulator, item) => accumulator + item[mainAxisSizeAttribute], 0);

    const crosAxisSizeAttribute = this.direction === 'row' || this.direction === 'row-reverse' ? 'height' : 'width';
    const crossAxisMaxElementSize = this.children.reduce((accumulator, item) => Math.max(accumulator, item[crosAxisSizeAttribute]), 0);

    const containerMainAxisTotalSize = this.direction === 'row' || this.direction === 'row-reverse' ? this._width : this._height;
    const containerCrossAxisTotalSize = Math.max(
      this.direction === 'row' || this.direction === 'row-reverse' ? this._width : this._height,
      crossAxisMaxElementSize,
    );

    const mainAxis = this.direction === 'row' || this.direction === 'row-reverse' ? 'x' : 'y';
    const crossAxis = this.direction === 'row' || this.direction === 'row-reverse' ? 'y' : 'x';

    const reversedOrder = this.direction === 'row-reverse' || this.direction === 'column-reverse';

    let gap = this._gap;
    if (this.justifyContent === 'space-between' || this.justifyContent == 'space-around') {
      gap = (containerMainAxisTotalSize - elementsTotalSize) / this.children.length;
    }

    let initialGap = 0;
    if (this.justifyContent === 'space-around') {
      initialGap = gap;
    }
    if (this.justifyContent === 'center') {
      const gapsSize = (this.children.length - 1) * this._gap;
      initialGap = (containerMainAxisTotalSize - gapsSize - elementsTotalSize) / 2;
    }
    if (this.justifyContent === 'flex-start' && reversedOrder) {
      const gapsSize = (this.children.length - 1) * this._gap;
      initialGap = containerMainAxisTotalSize - gapsSize - elementsTotalSize;
    }

    let nextItemPosition = initialGap;
    for (let i = 0; i < this.children.length; i++) {
      const currentChildren = this.children[reversedOrder ? this.children.length - 1 - i : i];

      // set position on main axis
      currentChildren[mainAxis] = nextItemPosition;
      nextItemPosition += currentChildren[mainAxisSizeAttribute] + gap;

      // set position on cross axis
      switch (this.alignItems) {
        case 'flex-start':
          currentChildren[crossAxis] = 0;
          break;
        case 'flex-end':
          currentChildren[crossAxis] = containerCrossAxisTotalSize - currentChildren[crosAxisSizeAttribute];
          break;
        case 'center':
          currentChildren[crossAxis] = (containerCrossAxisTotalSize - currentChildren[crosAxisSizeAttribute]) / 2;
          break;
        case 'baseline':
          currentChildren[crossAxis] = crossAxisMaxElementSize - currentChildren[crosAxisSizeAttribute];
          break;
      }
    }

    const contentSize = elementsTotalSize + (this.children.length - 1) * this._gap;
    this._width ||= this.direction === 'row' || this.direction === 'row-reverse' ? contentSize  : crossAxisMaxElementSize;
    this._height ||= this.direction === 'row' || this.direction === 'row-reverse' ? crossAxisMaxElementSize : contentSize;
  }

  get gap() {
    return this._gap;
  }
  set gap(value) {
    if (this._gap !== value) {
      this._gap = value;
      this.update();
    }
  }
}

import { IClickable } from '../display/interfaces';

export class PointerEventContext {
  public event: PointerEvent;
  public eventType: string;

  public interactedItems: IClickable[];

  constructor(event: PointerEvent, eventType: string) {
    this.event = event;
    this.eventType = eventType;

    this.interactedItems = [];
  }

  registerInteraction(item: IClickable) {
    if (this.eventType !== 'pointerupoutside') this.interactedItems.push(item);
  }

  destroy() {
    this.event = null;
    this.interactedItems.length = 0;
    this.interactedItems = null;
  }
}

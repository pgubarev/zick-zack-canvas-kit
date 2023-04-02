import { EventEmitter } from 'eventemitter3';


export interface IEvent {
  get type(): string;
  get original(): Event;

  stopImmediatePropagation(): void;
}

export interface IInteractive {
  containsPoint(clickX: number, clickY: number): boolean;
  handleEvent(event: IEvent): void;

  get events(): EventEmitter;
}

import { EventEmitter } from 'eventemitter3';

export interface IEvent {
  get type(): string;
  get original(): Event;

  stopImmediatePropagation(): void;
}

export interface IInteractive {
  interactive: boolean;

  get events(): EventEmitter;
}

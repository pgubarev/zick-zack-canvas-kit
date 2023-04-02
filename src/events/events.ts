import { EventPropagationStoped } from './errors';
import { IInteractive } from './interfaces';

export class ZickZackEvent {
  private _original: PointerEvent;

  private _interacted: IInteractive[];

  public readonly type: string;

  constructor(event: PointerEvent, type: string) {
    this._original = event;
    this._interacted = [];

    this.type = type;
  }

  destroy() {
    this._original = null;
    this._interacted = null;
  }

  get pointerX(): number {
    return this._original.clientX;
  }

  get pointerY(): number {
    return this._original.clientY;
  }

  get original(): Event {
    return this._original;
  }

  public stopImmediatePropagation(): void {
    throw new EventPropagationStoped();
  }

  public registerInteracted(interacted: IInteractive): void {
    this._interacted.push(interacted);
  }

  public get target(): IInteractive | null {
    return this._interacted.length === 0 ? null : this._interacted[this._interacted.length - 1];
  }

  public get interactedObjects(): IInteractive[] {
    return this._interacted;
  }
}

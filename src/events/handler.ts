import { Container } from '../display';
import { EventPropagationStoped } from './errors';
import { ZickZackEvent } from './events';

function propagate(event: ZickZackEvent, container: Container): void {
  for (let i = container.children.length - 1; i >= 0; i--) {
    if (container.children[i].containsPoint(event.pointerX, event.pointerY)) {
      if (container.children[i] instanceof Container) {
        propagate(event, <Container>container.children[i]);
        break;
      }

      if (container.children[i].interactive) {
        event.registerInteracted(container);
        container.children[i].events.emit(event.type, event);
      }
    }
  }

  if (container.interactive) {
    event.registerInteracted(container);
    container.events.emit(event.type, event);
  }
}

export function handlePointerEvent(event: ZickZackEvent, previous: ZickZackEvent | null, stage: Container): void {
  if (event.type === 'pointerupoutside') {
    for (let i = 0; i < previous.interactedObjects.length; i++)
      previous.interactedObjects[i].events.emit('pointerupoutside', event);
    return;
  }

  try {
    propagate(event, stage);
  } catch (error) {
    if (!(error instanceof EventPropagationStoped)) {
      throw error;
    }
  }

  if (previous === null) return;

  const pointerOutEvent = new ZickZackEvent(<PointerEvent>event.original, 'pointerupoutside');

  for (let i = 0; i < previous.interactedObjects.length; i++) {
    if (!event.interactedObjects.includes(previous.interactedObjects[i])) {
      previous.interactedObjects[i].events.emit('pointerupoutside', pointerOutEvent);
    }
  }

  pointerOutEvent.destroy();
}

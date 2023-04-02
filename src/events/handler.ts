import { Container } from '../display';
import { EventPropagationStoped } from './errors';
import { ZickZackEvent } from './events';

function propagate(event: ZickZackEvent, container: Container): void {
  for(let i = container.children.length - 1; i >= 0; i--) {
    if (container.children[i].containsPoint(event.pointerX, event.pointerY)) {
      if (container.children[i] instanceof Container) {
        propagate(event, <Container>container.children[i]);
        break;
      } else {
        event.registerInteracted(container.children[i]);
        container.children[i].handleEvent(event);
      }
    }
  }

  event.registerInteracted(container);
  container.handleEvent(event);
}

export function handlePointerEvent(event: ZickZackEvent, previous: ZickZackEvent | null, stage: Container): void {
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
      previous.interactedObjects[i].handleEvent(pointerOutEvent);
    }
  }

  pointerOutEvent.destroy();
}

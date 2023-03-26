export class EventProxyHandler {
  interactedItems: [];

  constructor() {
    this.interactedItems = [];
  }

  clear() {
    this.interactedItems = null;
  }

  get(obj, prop) {
    if (prop === 'interactedItems') {
      return this.interactedItems;
    }

    if (obj[prop] === 'function') {
      obj[prop] = obj[prop].bind(obj);
    }

    return obj[prop];
  }
}

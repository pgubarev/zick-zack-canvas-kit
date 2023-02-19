import { IResource } from './interfaces';

export class JsonResource implements IResource {
  public url: string;
  public data: object = null;

  constructor(url) {
    this.url = url;
  }

  destroy() {
    if (this.data !== null) {
      this.data = null;
    }
  }

  async load() {
    const response = await fetch(this.url);
    this.data = await response.json();
  }

  get isLoaded() {
    return this.data !== null;
  }
}

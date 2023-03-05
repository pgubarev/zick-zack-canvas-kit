import { IResource } from './interfaces';

export class ImageResource implements IResource {
  public url: string;
  public data: HTMLImageElement = null;

  private _loaded = false;

  constructor(url) {
    this.url = url;
  }

  destroy() {
    this._loaded = false;
    if (this.data !== null) {
      this.data = null;
    }
  }

  load(): Promise<void> {
    return new Promise<void>((resolve) => {
      this.data = new Image();
      this.data.crossOrigin = 'Anonymous';
      this.data.addEventListener(
        'load',
        () => {
          this._loaded = true;
          resolve();
        },
        { once: true },
      );
      this.data.src = this.url;
    });
  }

  get isLoaded() {
    return this._loaded;
  }
}

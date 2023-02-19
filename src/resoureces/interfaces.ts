export interface IResource {
  data: any;

  get isLoaded(): boolean;

  load(): Promise<void>;
  destroy();
}

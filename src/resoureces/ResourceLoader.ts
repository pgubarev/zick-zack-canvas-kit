import { FontResource } from './FontResource';
import { ImageResource } from './ImageResource';
import { IResource } from './interfaces';
import { JsonResource } from './JsonResource';
import { TexturePackerAtlas } from './TexturePackerAtlas';

type TResourceClass = new (url, ...params: any[]) => IResource;

export class ResourceLoader {
  private static resourceClassMap: Map<string, TResourceClass> = new Map();

  public static registerResourceType(typeAlias: string, resourceClass: TResourceClass) {
    ResourceLoader.resourceClassMap.set(typeAlias, resourceClass);
  }

  public resources: Map<string, IResource>;

  constructor() {
    this.resources = new Map();
  }

  add(typeAlias: string, url: string, ...additionalResourceParams: any[]): void {
    if (!ResourceLoader.resourceClassMap.has(typeAlias)) {
      throw new Error('Unknown resource type');
    }

    const ResourceClass = ResourceLoader.resourceClassMap.get(typeAlias);
    this.resources.set(url, new ResourceClass(url, ...additionalResourceParams));
  }

  load() {
    const promises = [];
    this.resources.forEach((resource) => {
      const promise = resource.load();
      promises.push(promise);
    });

    return Promise.all(promises);
  }
}

ResourceLoader.registerResourceType('image', ImageResource);
ResourceLoader.registerResourceType('json', JsonResource);
ResourceLoader.registerResourceType('font', FontResource);
ResourceLoader.registerResourceType('texturePack', TexturePackerAtlas);

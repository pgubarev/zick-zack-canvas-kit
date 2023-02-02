import { TBoundRect } from '../common';
import { IResource } from './interfaaces';
import { ImageResource } from './ImageResource';
import { JsonResource } from './JsonResource';

type TTextureConfig = {
    frame: TBoundRect;
}

type TTexturePackerAtlasConfig = {
    frames: { [ key: string ]: TTextureConfig };
}


export class TexturePackerAtlas implements IResource {
    public url: string;
    public atlasUrl: string;

    public data: HTMLImageElement = null;
    private config: TTexturePackerAtlasConfig = null;

    constructor(url: string, atlasUrl: string = undefined) {
        this.url = url;
        this.atlasUrl = atlasUrl || `${url.substring(0, url.length - 4)}png`;
    }

    destroy() {
        if (this.data !== null) {
            this.data = null;
        }
    }

    async load() {
        const imageResource = new ImageResource(this.atlasUrl);
        const configResource = new JsonResource(this.url);

        await Promise.all([imageResource.load(), configResource.load()]);

        this.data = imageResource.data;
        this.config = <TTexturePackerAtlasConfig>configResource.data;

        this.processConfig();
    }

    private processConfig() {
        // Process config and convert frames for each texture into TBoundRect objects
        Object.values(this.config.frames).forEach(
            textureConfig => {
                // @ts-ignore
                textureConfig.frame.width = textureConfig.frame.w;
                // @ts-ignore
                textureConfig.frame.height = textureConfig.frame.h;
            }
        );
    }

    get isLoaded() { return this.data !== null }

    getTextureSource(alias: string): TBoundRect {
        const textureInfo = this.config.frames[alias];
        if (textureInfo === undefined) throw new Error(`Unknown texture alias: ${alias}`);

        return textureInfo.frame;
    }
}

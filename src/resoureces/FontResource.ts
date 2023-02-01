import { IResource } from './interfaaces';


export class FontResource implements IResource {
    public url: string;
    public fontFamily: string;

    public data: FontFace = null;

    constructor(url, fontFamily: string) {
        this.url = url;
        this.fontFamily = fontFamily;
    }

    destroy() {
        if (this.data !== null) {
            this.data = null;
        }
    }

    async load() {
        const fontFace = new FontFace(this.fontFamily, `url(${this.url})`);
        await fontFace.load();
        this.data = fontFace;
    }

    get isLoaded() { return this.data !== null }
}

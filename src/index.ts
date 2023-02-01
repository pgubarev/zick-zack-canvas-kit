import { createLayer } from 'layers';
import { ResourceLoader, TexturePackerAtlas } from 'resoureces';
import { Container, ImageMask, TilingSprite, Sprite } from './display';

const layer = createLayer(
    {
        baseHeight: 1080,
        baseWidth: 1920,
        imageSmoothingQuality: 'high',
        usePixelated: true,
        canvasWidth: 500,
        canvasHeight: 500,
    },
);

document.body.appendChild(layer.canvas);

const url = 'https://avatars.githubusercontent.com/u/46652265?s=400&u=3e1fb5dc99a97838c4644a81f6b6bc77e7745202&v=4';
const atlasUrl = 'https://water-game-frontend.vercel.app/assets/themes/default.json';

const loader = new ResourceLoader();
loader.add('image', url);
loader.add('texturePack', atlasUrl);

loader.load().then(() => {
    const atlas = <TexturePackerAtlas>loader.resources.get(atlasUrl);

    const container = new Container();
    container.x = 0;
    container.y = 100;

    const ts = atlas.getTextureSource('color_3.png');

    createImageBitmap(
        atlas.data, ts.x, ts.y, ts.width, ts.height,
    ).then((bitMap) => {
        const pattern = layer.ctx.createPattern(bitMap, 'repeat');

        const tile = new TilingSprite(pattern);
        tile.x = -50;
        tile.y = 10;
        tile.width = 500;
        tile.height = 500;

        const jarMask = new ImageMask(atlas.data, atlas.getTextureSource('stack_mask.png'));
        const jarSprite = new Sprite(atlas.data, atlas.getTextureSource('stack.png'));

        jarMask.width = 204;
        jarMask.height = 318;

        jarSprite.width = 204;
        jarSprite.height = 318;

        const jarContainer = new Container();
        jarContainer.mask = jarMask;
        jarContainer.appendChild(tile);

        container.appendChild(jarContainer);
        container.appendChild(jarSprite);

        layer.stage.appendChild(container);

        const animate = () => {
            layer.render();
            container.x += 1;
            requestAnimationFrame(animate);
        }

        animate();
    });
});

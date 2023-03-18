import { Layer } from './Layer';
import { TConfigOptions, createLayerConfig } from './configs';

export const LayersMap: Map<string, Layer> = new Map();

export function createLayer(options: TConfigOptions, name = 'default') {
  if (LayersMap.has(name)) throw new Error(`Layer with name ${name} already exists`);

  const config = createLayerConfig(options);
  const layer = new Layer(name, config, options.existingCanvas);
  LayersMap.set(name, layer);

  return layer;
}

import { Layer } from './Layer';
import { createApplicationConfig } from './configs';
import { TConfigOptions } from './types';

export const LayersMap: Map<string, Layer> = new Map();

export function createLayer(options: TConfigOptions, name = 'default'): Layer {
  if (LayersMap.has(name)) throw new Error(`Layer with name ${name} already exists`);

  const config = createApplicationConfig(options);
  const layer = new Layer(name, config);
  LayersMap.set(name, layer);

  return layer;
}

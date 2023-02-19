import { getDocumentHeight, getDocumentWidth } from 'utils';
import { TConfigOptions, TConfig } from './types';

// TODO: createLayerConfig
export function createApplicationConfig(options: TConfigOptions): TConfig {
  const canvasWidth = options.canvasWidth || getDocumentWidth();
  const canvasHeight = options.canvasHeight || getDocumentHeight();

  const scaleFactor = Math.min(canvasWidth / options.baseWidth, canvasHeight / options.baseHeight);

  return {
    baseWidth: options.baseWidth,
    baseHeight: options.baseHeight,
    imageSmoothingQuality: options.imageSmoothingQuality || 'medium',
    usePixelated: options.usePixelated !== undefined ? options.usePixelated : true,
    canvasWidth,
    canvasHeight,
    scaleFactor,
  };
}

import { getDocumentHeight, getDocumentWidth } from 'utils';
import { TConfigOptions, TConfig, TGlobalConfig } from './types';

export const CONFIG: TGlobalConfig = {
  usePixelated: false,
  imageSmoothingQuality: 'medium',
};

export function createLayerConfig(options: TConfigOptions): TConfig {
  const canvasWidth = options.canvasWidth || getDocumentWidth();
  const canvasHeight = options.canvasHeight || getDocumentHeight();

  return {
    baseWidth: options.baseWidth,
    baseHeight: options.baseHeight,
    imageSmoothingQuality: options.imageSmoothingQuality || CONFIG.imageSmoothingQuality,
    usePixelated: options.usePixelated !== undefined ? options.usePixelated : true,
    canvasWidth,
    canvasHeight,
  };
}

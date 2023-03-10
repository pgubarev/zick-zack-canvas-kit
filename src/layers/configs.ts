import { getDocumentHeight, getDocumentWidth } from '../utils/browser';

type TGlobalConfig = {
  usePixelated: boolean;
  imageSmoothingQuality: ImageSmoothingQuality | 'disabled';
}

export type TConfigOptions = {
  baseWidth: number;
  baseHeight: number;

  canvasWidth?: number;
  canvasHeight?: number;
} & TGlobalConfig;

export type TConfig = {
  baseWidth: number;
  baseHeight: number;

  canvasWidth: number;
  canvasHeight: number;
} & TGlobalConfig;

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

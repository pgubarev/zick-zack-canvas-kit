import { getDocumentHeight, getDocumentWidth } from '../utils/browser';

export type TConfigOptions = {
  baseWidth: number,
  baseHeight: number,

  canvasWidth?: number,
  canvasHeight?: number,

  imageSmoothingQuality?: 'disabled' | 'low' | 'medium' | 'high',
  usePixelated?: boolean,
};

export type TConfig = {
  baseWidth: number,
  baseHeight: number,

  canvasWidth: number,
  canvasHeight: number,

  usePixelated: boolean,
  imageSmoothingQuality: 'disabled' | 'low' | 'medium' | 'high',

  scaleFactor: number,
}

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
  }
}

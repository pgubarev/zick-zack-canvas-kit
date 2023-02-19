type TImageSmoothingQuality = 'disabled' | 'low' | 'medium' | 'high';

// TODO: TLayerConfigOptions
export type TConfigOptions = {
  baseWidth: number;
  baseHeight: number;

  canvasWidth?: number;
  canvasHeight?: number;

  usePixelated?: boolean;
  imageSmoothingQuality?: TImageSmoothingQuality;
};

// TODO: TLayerConfig
export type TConfig = {
  baseWidth: number;
  baseHeight: number;

  canvasWidth: number;
  canvasHeight: number;

  usePixelated: boolean;
  imageSmoothingQuality: TImageSmoothingQuality;

  scaleFactor: number;
};

export type TImageSmoothingQuality = ImageSmoothingQuality | 'disabled';

export type TGlobalConfig = {
  usePixelated: boolean;
  imageSmoothingQuality: TImageSmoothingQuality;
}

// TODO: TLayerConfigOptions
export type TConfigOptions = {
  baseWidth: number;
  baseHeight: number;

  canvasWidth?: number;
  canvasHeight?: number;
} & TGlobalConfig;

// TODO: TLayerConfig
export type TConfig = {
  baseWidth: number;
  baseHeight: number;

  canvasWidth: number;
  canvasHeight: number;
} & TGlobalConfig;

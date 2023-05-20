export type TextStyle = {
  font: string;
  size: number;
  fillStyle?: string | CanvasGradient | CanvasPattern | null;
  strokeStyle?: string | CanvasGradient | CanvasPattern | null;
  strokeLineWidth?: number;
};

export type MultilineTextStyle = {
  textAlign: 'left' | 'center' | 'right';
} & TextStyle;

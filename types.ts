export type CropMarkType = 'none' | 'corners' | 'full';

export interface AppSettings {
  gridCols: number;
  gridRows: number;
  printerMargin: number;
  marginUnit: 'mm' | 'in';
  cropMarkType: CropMarkType;
  addOverlap: boolean;
}

export interface ImageInfo {
  url: string;
  width: number;
  height: number;
}

export interface ResolutionWarning {
  requiredWidth: number;
  requiredHeight: number;
  actualWidth: number;
  actualHeight: number;
}

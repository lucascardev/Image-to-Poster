import { MM_PER_INCH, RECOMMENDED_DPI } from './constants';

// A simple debounce function
export function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

// Convert dimensions to pixels for canvas operations
export const mmToPx = (mm: number) => (mm / MM_PER_INCH) * RECOMMENDED_DPI;

interface GridDimensionsInput {
  imageWidth: number;
  imageHeight: number;
  totalPrintableWidthPx: number;
  totalPrintableHeightPx: number;
}

interface GridDimensionsOutput {
  scaledImgWidth: number;
  scaledImgHeight: number;
  gridOffsetX: number;
  gridOffsetY: number;
}

export const calculateGridDimensions = ({
  imageWidth,
  imageHeight,
  totalPrintableWidthPx,
  totalPrintableHeightPx,
}: GridDimensionsInput): GridDimensionsOutput => {
  // Calculate scaled image dimensions to fit within the total grid, preserving aspect ratio
  const imageRatio = imageWidth / imageHeight;
  const totalGridRatio = totalPrintableWidthPx / totalPrintableHeightPx;

  let scaledImgWidth, scaledImgHeight, gridOffsetX, gridOffsetY;

  if (imageRatio > totalGridRatio) {
    // Pillarbox
    scaledImgWidth = totalPrintableWidthPx;
    scaledImgHeight = scaledImgWidth / imageRatio;
    gridOffsetX = 0;
    gridOffsetY = (totalPrintableHeightPx - scaledImgHeight) / 2;
  } else {
    // Letterbox
    scaledImgHeight = totalPrintableHeightPx;
    scaledImgWidth = scaledImgHeight * imageRatio;
    gridOffsetY = 0;
    gridOffsetX = (totalPrintableWidthPx - scaledImgWidth) / 2;
  }

  return { scaledImgWidth, scaledImgHeight, gridOffsetX, gridOffsetY };
};

import { describe, it, expect, vi } from 'vitest';
import { debounce, mmToPx, calculateGridDimensions } from '../utils';

describe('debounce', () => {
  it('should execute the function after the specified wait time', () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(func).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('should reset the timer if called again within the wait time', () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncedFunc = debounce(func, 100);

    debouncedFunc();
    vi.advanceTimersByTime(50);
    debouncedFunc();
    vi.advanceTimersByTime(50);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(func).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});

describe('mmToPx', () => {
    // recommened_dpi is 150, mm_per_inch is 25.4
    // 25.4mm = 1 inch = 150px
    it('should convert mm to px correctly', () => {
        expect(mmToPx(25.4)).toBe(150);
        expect(mmToPx(0)).toBe(0);
        expect(mmToPx(50.8)).toBe(300);
    });
});

describe('calculateGridDimensions', () => {
    it('should calculate dimensions for Letterbox (wide image)', () => {
        // Mock inputs: Grid area 1000x500 (2:1 ratio). Image 400x100 (4:1 ratio).
        // Image is wider than grid. Wraps in letterbox (bars top/bottom).
        // Wait, Letterbox means it fits width, has emptiness on height (or vice versa depending on definition).
        // Logic says: if imageRatio > totalGridRatio (image wider than grid ratio) => Pillarbox????
        // Let's check logic in utils.ts:
        // if (imageRatio > totalGridRatio) { // Pillarbox (comment says pillarbox)
        //    scaledImgWidth = totalPrintableWidthPx;
        //    scaledImgHeight = scaledImgWidth / imageRatio;
        //    gridOffsetX = 0;
        //    gridOffsetY = (totalPrintableHeightPx - scaledImgHeight) / 2;
        // }
        // If image is wider (large ratio) than grid, it fits width-wise and has vertical bars. That is normally called Letterbox.
        // Pillarbox is vertical bars? Yes. Wait.
        // Letterbox = horizontal black bars (image wide, screen tall/square).
        // Pillarbox = vertical black bars (image tall, screen wide).
        // If imageRatio (w/h) > gridRatio (w/h). e.g. Image 2.0, Grid 1.0.
        // Image is wider. So it fits the WIDTH. Height is smaller than Grid Height.
        // So we have space on top/bottom. That is LETTERBOX.
        // The comment in usage might be confused or I am.
        // If logic is: scaledWidth = GridWidth. scaledHeight = GridWidth / ImgRatio.
        // OffsetY = (GridHeight - ScaledHeight) / 2.
        // This puts image in middle vertically. Bars on top/bottom. Correct.
        
        const input = {
            imageWidth: 200, imageHeight: 100, // Ratio 2
            totalPrintableWidthPx: 100, totalPrintableHeightPx: 100 // Ratio 1
        };
        // Expect: Width = 100. Height = 50. OffsetX = 0. OffsetY = 25.
        const result = calculateGridDimensions(input);
        expect(result).toEqual({
            scaledImgWidth: 100,
            scaledImgHeight: 50,
            gridOffsetX: 0,
            gridOffsetY: 25
        });
    });

    it('should calculate dimensions for Pillarbox (tall image)', () => {
        // Image 100x200 (0.5). Grid 100x100 (1).
        // Image is taller. Fits Height.
        const input = {
            imageWidth: 100, imageHeight: 200, // Ratio 0.5
            totalPrintableWidthPx: 100, totalPrintableHeightPx: 100 // Ratio 1
        };
        // Expect: Height = 100. Width = 50. OffsetX = 25. OffsetY = 0.
        const result = calculateGridDimensions(input);
        expect(result).toEqual({
            scaledImgWidth: 50,
            scaledImgHeight: 100,
            gridOffsetX: 25,
            gridOffsetY: 0
        });
    });
});

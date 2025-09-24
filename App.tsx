import React, { useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';

// Components
import SettingsPanel from './components/SettingsPanel';
import PreviewArea from './components/PreviewArea';
import Instructions from './components/Instructions';
import ResolutionWarningDisplay from './components/ResolutionWarningDisplay';
import DownloadPanel from './components/DownloadPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import DonationModal from './components/DonationModal';
import HowItWorks from './components/HowItWorks';
import InstallInstructions from './components/InstallInstructions';
import StatsWidget from './components/StatsWidget';
import AdPlaceholder from './components/AdPlaceholder';
import ThreeBackground from './components/ThreeBackground';
import { LogoIcon, PixIcon, CloseIcon, ExpandIcon } from './components/Icons';

// Types and Constants
import type { AppSettings, ImageInfo, ResolutionWarning } from './types';
import { A4_WIDTH_MM, A4_HEIGHT_MM, MM_PER_INCH, RECOMMENDED_DPI } from './constants';
import { useTranslations } from './hooks/useTranslations';

const initialSettings: AppSettings = {
  gridCols: 3,
  gridRows: 2,
  printerMargin: 6,
  marginUnit: 'mm',
  cropMarkType: 'corners',
  addOverlap: true,
};

// A simple debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
}

// --- Start of embedded FullscreenPreviewModal ---
interface FullscreenPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  src: string | null;
}

const FullscreenPreviewModal: React.FC<FullscreenPreviewModalProps> = ({ isOpen, onClose, src }) => {
  const { t } = useTranslations();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !src) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
        <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={t('closeButton')}
            >
              <CloseIcon className="w-6 h-6" />
            </button>
            
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="max-w-[95vw] max-h-[95vh]">
                    <img 
                        src={src} 
                        alt={t('fullscreenPreviewAlt')}
                        className="w-auto h-auto max-w-full max-h-full object-contain rounded-md shadow-2xl"
                    />
                </div>
            </div>
        </div>
    </div>
  );
};
// --- End of embedded FullscreenPreviewModal ---

function App() {
  const { t } = useTranslations();
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [resolutionWarning, setResolutionWarning] = useState<ResolutionWarning | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [postersCreatedCount, setPostersCreatedCount] = useState(1247); // Start with a realistic number
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullPreviewSrc, setFullPreviewSrc] = useState<string | null>(null);


  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const handleOpenFullscreen = () => {
    setIsFullscreenOpen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  const generatePages = useCallback(async () => {
    if (!imageInfo || !imageRef.current || !imageRef.current.complete || imageRef.current.naturalWidth === 0) {
        setPages([]);
        return;
    }
    setIsLoading(true);

    const img = imageRef.current;
    const newPages: string[] = [];

    const marginInMm = settings.marginUnit === 'in'
        ? settings.printerMargin * MM_PER_INCH
        : settings.printerMargin;

    const overlapWidthMm = settings.addOverlap ? Math.min(marginInMm, 10) : 0;

    const pagePrintableWidthMm = A4_WIDTH_MM - (marginInMm * 2);
    const pagePrintableHeightMm = A4_HEIGHT_MM - (marginInMm * 2);

    // Convert dimensions to pixels for canvas operations
    const mmToPx = (mm: number) => (mm / MM_PER_INCH) * RECOMMENDED_DPI;

    const pagePrintableWidthPx = mmToPx(pagePrintableWidthMm);
    const pagePrintableHeightPx = mmToPx(pagePrintableHeightMm);

    const totalPrintableWidthPx = pagePrintableWidthPx * settings.gridCols;
    const totalPrintableHeightPx = pagePrintableHeightPx * settings.gridRows;

    // Create a large canvas for the entire poster layout
    const largeCanvas = document.createElement('canvas');
    largeCanvas.width = totalPrintableWidthPx;
    largeCanvas.height = totalPrintableHeightPx;
    const largeCtx = largeCanvas.getContext('2d');
    if (!largeCtx) {
        setIsLoading(false);
        return;
    }

    // Fill with white to handle letterboxing/pillarboxing
    largeCtx.fillStyle = 'white';
    largeCtx.fillRect(0, 0, largeCanvas.width, largeCanvas.height);

    // Calculate scaled image dimensions to fit within the large canvas, preserving aspect ratio
    const imageRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = largeCanvas.width / largeCanvas.height;

    let scaledWidth, scaledHeight, offsetX, offsetY;

    if (imageRatio > canvasRatio) {
        // Image is wider than the grid, so fit to width (pillarbox)
        scaledWidth = largeCanvas.width;
        scaledHeight = scaledWidth / imageRatio;
        offsetX = 0;
        offsetY = (largeCanvas.height - scaledHeight) / 2;
    } else {
        // Image is taller or same ratio, fit to height (letterbox)
        scaledHeight = largeCanvas.height;
        scaledWidth = scaledHeight * imageRatio;
        offsetY = 0;
        offsetX = (largeCanvas.width - scaledWidth) / 2;
    }

    // Draw the scaled image onto the large canvas, centered
    largeCtx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);

    // Resolution warning logic (remains the same and is still relevant)
    const requiredWidth = Math.round((pagePrintableWidthMm * settings.gridCols / MM_PER_INCH) * RECOMMENDED_DPI);
    const requiredHeight = Math.round((pagePrintableHeightMm * settings.gridRows / MM_PER_INCH) * RECOMMENDED_DPI);

    if (img.naturalWidth < requiredWidth || img.naturalHeight < requiredHeight) {
        setResolutionWarning({
            requiredWidth,
            requiredHeight,
            actualWidth: img.naturalWidth,
            actualHeight: img.naturalHeight,
        });
    } else {
        setResolutionWarning(null);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        setIsLoading(false);
        return;
    }

    canvas.width = mmToPx(A4_WIDTH_MM);
    canvas.height = mmToPx(A4_HEIGHT_MM);

    const marginPx = mmToPx(marginInMm);
    const overlapPx = mmToPx(overlapWidthMm);

    const tileWidthPx = pagePrintableWidthPx;
    const tileHeightPx = pagePrintableHeightPx;

    // Create a pattern for the stripes only once
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    let stripePattern: CanvasPattern | null = null;
    if (patternCtx) {
        const stripeWidth = mmToPx(2);
        patternCanvas.width = stripeWidth * 2;
        patternCanvas.height = stripeWidth * 2;
        patternCtx.strokeStyle = 'rgba(59, 130, 246, 0.5)'; // blue-500, 50% opacity
        patternCtx.lineWidth = mmToPx(0.5);
        patternCtx.beginPath();
        patternCtx.moveTo(0, stripeWidth * 2);
        patternCtx.lineTo(stripeWidth * 2, 0);
        patternCtx.stroke();
        stripePattern = ctx.createPattern(patternCanvas, 'repeat');
    }

    for (let row = 0; row < settings.gridRows; row++) {
        for (let col = 0; col < settings.gridCols; col++) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const hasRightTab = settings.addOverlap && col < settings.gridCols - 1;
            const hasBottomTab = settings.addOverlap && row < settings.gridRows - 1;

            // Source rectangle from the large composite canvas
            const sX_large = col * tileWidthPx;
            const sY_large = row * tileHeightPx;

            // The desired width/height from the large canvas, including overlap
            const sW_desired = tileWidthPx + (hasRightTab ? overlapPx : 0);
            const sH_desired = tileHeightPx + (hasBottomTab ? overlapPx : 0);

            // The actual width/height we can take, clamped to the large canvas bounds
            const sW_actual = Math.min(sW_desired, largeCanvas.width - sX_large);
            const sH_actual = Math.min(sH_desired, largeCanvas.height - sY_large);

            // Destination rectangle on the page canvas. The destination dimensions
            // must match the source dimensions we are actually taking.
            const dX = marginPx;
            const dY = marginPx;
            const dW = sW_actual;
            const dH = sH_actual;

            // Draw the tile from the large canvas to the current page canvas
            if (sW_actual > 0 && sH_actual > 0) {
                ctx.drawImage(
                    largeCanvas,
                    sX_large, sY_large, sW_actual, sH_actual,
                    dX, dY, dW, dH
                );
            }

            // Add glue tab visualization (stripes)
            if (settings.addOverlap && stripePattern) {
                ctx.save();
                ctx.fillStyle = stripePattern;
                if (hasRightTab) {
                    ctx.fillRect(marginPx + tileWidthPx, marginPx, overlapPx, tileHeightPx);
                }
                if (hasBottomTab) {
                    ctx.fillRect(marginPx, marginPx + tileHeightPx, tileWidthPx, overlapPx);
                }
                if (hasRightTab && hasBottomTab) {
                    ctx.fillRect(marginPx + tileWidthPx, marginPx + tileHeightPx, overlapPx, overlapPx);
                }
                ctx.restore();
            }

            // Add crop marks
            if (settings.cropMarkType !== 'none') {
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // red-500
                ctx.lineWidth = 1;
                ctx.setLineDash([mmToPx(2), mmToPx(2)]);
                const lineLength = marginPx * 0.75;
                const rightEdge = marginPx + tileWidthPx;
                const bottomEdge = marginPx + tileHeightPx;
                ctx.beginPath();
                if (settings.cropMarkType === 'full') {
                    ctx.moveTo(0, marginPx); ctx.lineTo(canvas.width, marginPx);
                    ctx.moveTo(0, bottomEdge); ctx.lineTo(canvas.width, bottomEdge);
                    ctx.moveTo(marginPx, 0); ctx.lineTo(marginPx, canvas.height);
                    ctx.moveTo(rightEdge, 0); ctx.lineTo(rightEdge, canvas.height);
                } else { // corners
                    ctx.moveTo(marginPx, 0); ctx.lineTo(marginPx, lineLength);
                    ctx.moveTo(0, marginPx); ctx.lineTo(lineLength, marginPx);
                    ctx.moveTo(rightEdge, 0); ctx.lineTo(rightEdge, lineLength);
                    ctx.moveTo(canvas.width, marginPx); ctx.lineTo(rightEdge - lineLength, marginPx);
                    ctx.moveTo(marginPx, canvas.height); ctx.lineTo(marginPx, bottomEdge - lineLength);
                    ctx.moveTo(0, bottomEdge); ctx.lineTo(lineLength, bottomEdge);
                    ctx.moveTo(rightEdge, canvas.height); ctx.lineTo(rightEdge, bottomEdge - lineLength);
                    ctx.moveTo(canvas.width, bottomEdge); ctx.lineTo(rightEdge - lineLength, bottomEdge);
                }
                ctx.stroke();
            }
            newPages.push(canvas.toDataURL('image/jpeg', 0.95));
        }
    }
    setPages(newPages);
    setIsLoading(false);
}, [imageInfo, settings]);
  
  const generateFullPreview = useCallback(async (pageSources: string[]): Promise<string | null> => {
    if (pageSources.length === 0 || !settings) return null;

    const { gridCols, gridRows } = settings;
    
    // Load the first image to determine dimensions.
    const firstPageImg = new Image();
    firstPageImg.src = pageSources[0];
    await new Promise(resolve => { firstPageImg.onload = resolve; });

    const { naturalWidth: pageW, naturalHeight: pageH } = firstPageImg;

    if (pageW === 0 || pageH === 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = pageW * gridCols;
    canvas.height = pageH * gridRows;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Asynchronously load all page images
    const imagePromises = pageSources.map(src => {
        const img = new Image();
        img.src = src;
        return new Promise<HTMLImageElement>(resolve => { img.onload = () => resolve(img); });
    });
    
    const loadedImages = await Promise.all(imagePromises);

    // Draw images onto the canvas grid
    let imageIndex = 0;
    for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
            if (loadedImages[imageIndex]) {
                ctx.drawImage(loadedImages[imageIndex], col * pageW, row * pageH, pageW, pageH);
            }
            imageIndex++;
        }
    }

    return canvas.toDataURL('image/jpeg', 0.95);
  }, [settings]);

  // Effect to generate the full preview whenever the pages or grid changes
  useEffect(() => {
    const createPreview = async () => {
        if (pages.length > 0) {
            const src = await generateFullPreview(pages);
            setFullPreviewSrc(src);
        } else {
            setFullPreviewSrc(null);
        }
    };
    createPreview();
  }, [pages, settings.gridCols, settings.gridRows, generateFullPreview]);


  const debouncedGeneratePages = useCallback(debounce(generatePages, 300), [generatePages]);

  useEffect(() => {
    debouncedGeneratePages();
  }, [settings, imageInfo, debouncedGeneratePages]);

  const handleImageUpload = async (file: File) => {
    const startTime = Date.now();
    setIsUploading(true);
    
    try {
      const url = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                resolve(e.target.result as string)
            } else {
                reject(new Error("FileReader did not return a result."))
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });

      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = url;
        if (image.complete) resolve(image);
      });

      await img.decode();

      if (img.naturalWidth === 0 || img.naturalHeight === 0) {
        throw new Error("Image loaded with zero dimensions.");
      }

      const finishProcessing = () => {
        // Automatically adjust grid based on image resolution for best quality
        const marginInMm = settings.marginUnit === 'in'
            ? settings.printerMargin * MM_PER_INCH
            : settings.printerMargin;

        const pagePrintableWidthMm = A4_WIDTH_MM - (marginInMm * 2);
        const pagePrintableHeightMm = A4_HEIGHT_MM - (marginInMm * 2);

        const pagePrintableWidthPx = (pagePrintableWidthMm / MM_PER_INCH) * RECOMMENDED_DPI;
        const pagePrintableHeightPx = (pagePrintableHeightMm / MM_PER_INCH) * RECOMMENDED_DPI;

        let suggestedCols = 1;
        let suggestedRows = 1;

        if (pagePrintableWidthPx > 0 && pagePrintableHeightPx > 0) {
            suggestedCols = Math.round(img.naturalWidth / pagePrintableWidthPx);
            suggestedRows = Math.round(img.naturalHeight / pagePrintableHeightPx);
        }

        let newCols = Math.max(1, Math.min(10, suggestedCols));
        let newRows = Math.max(1, Math.min(10, suggestedRows));
        
        if (newCols === 1 && newRows === 1) {
            newCols = 2;
            newRows = 2;
        }

        setSettings(prev => ({
            ...prev,
            gridCols: newCols,
            gridRows: newRows,
        }));

        imageRef.current = img;
        setImageInfo({ url, width: img.naturalWidth, height: img.naturalHeight });
        setIsUploading(false);
      };
      
      const elapsedTime = Date.now() - startTime;
      const minLoadingTime = 2000;
      const remainingTime = minLoadingTime - elapsedTime;
      
      if (remainingTime > 0) {
          setTimeout(finishProcessing, remainingTime);
      } else {
          finishProcessing();
      }

    } catch (error) {
      console.error("Failed to upload and process image:", error);
      setIsUploading(false);
    }
  };


  const handleDownloadPdf = async () => {
    if (pages.length === 0) return;
    setIsGeneratingPdf(true);
    setPostersCreatedCount(c => c + 1);

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const smallBrandingText = "printmyposter.art";
    const largeBrandingText = t('brandingText');

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(pages[i], 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

      // Add small branding to the bottom margin of every page
      pdf.setFontSize(6);
      pdf.setTextColor(150, 150, 150); // Light gray
      const textDimensionsSmall = pdf.getTextDimensions(smallBrandingText);
      const textXSmall = (A4_WIDTH_MM - textDimensionsSmall.w) / 2; // Centered
      const textYSmall = A4_HEIGHT_MM - 2; // Position 2mm from the bottom
      pdf.text(smallBrandingText, textXSmall, textYSmall);
    }
    
    // Add larger branding mark to the last page
    if (pages.length > 0) {
        pdf.setPage(pages.length);

        pdf.setFontSize(10);
        pdf.setTextColor(128, 128, 128); // Medium gray
        
        const textDimensionsLarge = pdf.getTextDimensions(largeBrandingText);
        const textXLarge = (A4_WIDTH_MM - textDimensionsLarge.w) / 2; // Centered
        const textYLarge = A4_HEIGHT_MM - 6; // Position 6mm from the bottom, above the small one
        
        pdf.text(largeBrandingText, textXLarge, textYLarge);
    }

    setTimeout(() => {
      pdf.save('print-my-poster.pdf');
      setIsGeneratingPdf(false);
    }, 100);
  };
  
  // Fake poster count increment
  useEffect(() => {
    const interval = setInterval(() => {
      setPostersCreatedCount(c => c + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <ThreeBackground />
      <div className="relative min-h-screen font-sans">
        <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-40 border-b border-slate-200">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center py-6">
                    <div className="flex items-center gap-3">
                       <LogoIcon className="h-8 w-8 text-indigo-600" />
                       <div>
                         <h1 className="text-xl font-bold text-slate-800">{t('appTitle')}</h1>
                         <p className="text-sm text-slate-500 hidden sm:block">{t('appNewSubtitle')}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <StatsWidget count={postersCreatedCount} />
                        <LanguageSwitcher />
                        <button 
                            onClick={() => setIsDonationModalOpen(true)}
                            className="hidden sm:inline-flex items-center gap-2 bg-green-100 text-green-800 font-bold text-sm py-2 px-3 rounded-md hover:bg-green-200 transition-colors"
                        >
                            <PixIcon className="w-5 h-5" />
                            {t('donateWithPix')}
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main className="container mx-auto p-4 md:py-12 md:px-8">
            {!imageInfo && (
              <div className="mb-8">
                <HowItWorks />
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <SettingsPanel 
                  settings={settings}
                  onSettingsChange={setSettings}
                  onImageUpload={handleImageUpload}
                  hasImage={!!imageInfo}
                  isUploading={isUploading}
                />
              </div>
              <div className="lg:col-span-2 space-y-8">
                {resolutionWarning && (
                  <ResolutionWarningDisplay
                    warning={resolutionWarning}
                    cols={settings.gridCols}
                    rows={settings.gridRows}
                  />
                )}

                {pages.length > 0 ? (
                  <>
                    <PreviewArea pages={pages} isLoading={isLoading} settings={settings} onOpenFullscreen={handleOpenFullscreen} />
                    <AdPlaceholder type="sevenkbet" />
                    <DownloadPanel onDownload={handleDownloadPdf} disabled={isGeneratingPdf || isLoading || pages.length === 0} isGenerating={isGeneratingPdf} />
                    <Instructions settings={settings} />
                    <InstallInstructions />
                  </>
                ) : (
                  <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md">
                     <h2 className="text-2xl font-bold border-b pb-4 mb-6">{t('previewTitle')}</h2>
                     <div className="text-center py-12 px-6 border-2 border-slate-200 border-dashed rounded-lg">
                        <LogoIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-700">{t('uploadPromptTitle')}</h3>
                        <p className="text-slate-500 mt-2">{t('uploadPromptSubtitle')}</p>
                     </div>
                  </div>
                )}
              </div>
            </div>
        </main>
        <footer className="bg-slate-800/90 text-slate-400 mt-24 py-10 text-center text-sm">
             <p>{t('footerText', { year: new Date().getFullYear() })}</p>
        </footer>
      </div>
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
      <FullscreenPreviewModal 
        isOpen={isFullscreenOpen} 
        onClose={handleCloseFullscreen} 
        src={fullPreviewSrc} 
      />
    </>
  );
}

export default App;
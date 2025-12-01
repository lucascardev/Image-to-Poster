import React, { useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';

// Components
import SettingsPanel from './components/SettingsPanel';
import PreviewArea from './components/PreviewArea';
import Instructions from './components/Instructions';
import ResolutionWarningDisplay from './components/ResolutionWarningDisplay';
import DownloadPanel from './components/DownloadPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import HowItWorks from './components/HowItWorks';
import InstallInstructions from './components/InstallInstructions';
import StatsWidget from './components/StatsWidget';
import AdPlaceholder from './components/AdPlaceholder';
import ThreeBackground from './components/ThreeBackground';
import { LogoIcon, PayPalIcon, CloseIcon, ExpandIcon, ShareIcon, CheckCircleIcon, UploadIcon } from './components/Icons';
import AdCountdownModal from './components/AdCountdownModal';
import DonationCompleted from './components/DonationCompleted';
import DonationCanceled from './components/DonationCanceled';


// Types and Constants
import type { AppSettings, ImageInfo, ResolutionWarning } from './types';
import { A4_WIDTH_MM, A4_HEIGHT_MM, MM_PER_INCH, RECOMMENDED_DPI } from './constants';
import { useTranslations } from './hooks/useTranslations';
import { APP_VERSION } from './version';

const initialSettings: AppSettings = {
  gridCols: 3,
  gridRows: 2,
  printerMargin: 6,
  marginUnit: 'mm',
  cropMarkType: 'full',
  addOverlap: true,
};

// A simple debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      try {
        if (timeout) {
          clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            try {
                resolve(func(...args));
            } catch (error) {
                console.error("Error in debounced function:", error);
            }
        }, waitFor);
      } catch (error) {
          console.error("Error setting up debounce:", error);
      }
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
    try {
        if (e.key === 'Escape') onClose();
    } catch (error) {
        console.error("Error in handleKeyDown:", error);
    }
  }, [onClose]);

  useEffect(() => {
    try {
        if (isOpen) {
          window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
          window.removeEventListener('keydown', handleKeyDown);
        };
    } catch (error) {
        console.error("Error in useEffect (FullscreenPreviewModal):", error);
    }
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
  const { hash } = window.location;

  if (hash === '#/completed') {
    return <DonationCompleted />;
  }

  if (hash === '#/cancel') {
    return <DonationCanceled />;
  }

  const { t } = useTranslations();
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [resolutionWarning, setResolutionWarning] = useState<ResolutionWarning | null>(null);
  const [postersCreatedCount, setPostersCreatedCount] = useState(1247); // Start with a realistic number
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);
  const [fullPreviewSrc, setFullPreviewSrc] = useState<string | null>(null);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);


  const imageRef = useRef<HTMLImageElement | null>(null);
  
  // Effect to clean up object URLs on unmount or when image changes
  useEffect(() => {
    return () => {
      try {
          if (imageInfo && imageInfo.url.startsWith('blob:')) {
            URL.revokeObjectURL(imageInfo.url);
          }
      } catch (error) {
          console.error("Error cleaning up object URL:", error);
      }
    };
  }, [imageInfo]);


  const handleOpenFullscreen = () => {
    setIsFullscreenOpen(true);
  };
  
  const handleCloseFullscreen = () => {
    setIsFullscreenOpen(false);
  };

  const generatePages = useCallback(async () => {
    try {
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

        // Calculate scaled image dimensions to fit within the total grid, preserving aspect ratio
        const imageRatio = img.naturalWidth / img.naturalHeight;
        const totalGridRatio = totalPrintableWidthPx / totalPrintableHeightPx;

        let scaledImgWidth, scaledImgHeight, gridOffsetX, gridOffsetY;

        if (imageRatio > totalGridRatio) { // Pillarbox
            scaledImgWidth = totalPrintableWidthPx;
            scaledImgHeight = scaledImgWidth / imageRatio;
            gridOffsetX = 0;
            gridOffsetY = (totalPrintableHeightPx - scaledImgHeight) / 2;
        } else { // Letterbox
            scaledImgHeight = totalPrintableHeightPx;
            scaledImgWidth = scaledImgHeight * imageRatio;
            gridOffsetY = 0;
            gridOffsetX = (totalPrintableWidthPx - scaledImgWidth) / 2;
        }

        // Resolution warning logic, threshold lowered by half per user request
        const requiredWidth = Math.round((pagePrintableWidthMm * settings.gridCols / MM_PER_INCH) * (RECOMMENDED_DPI / 2));
        const requiredHeight = Math.round((pagePrintableHeightMm * settings.gridRows / MM_PER_INCH) * (RECOMMENDED_DPI / 2));

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
                
                // Calculate this tile's area in the overall grid, including overlap
                const tileGridX = col * tileWidthPx;
                const tileGridY = row * tileHeightPx;
                const tileGridW = tileWidthPx + (hasRightTab ? overlapPx : 0);
                const tileGridH = tileHeightPx + (hasBottomTab ? overlapPx : 0);
        
                // Find the intersection of this tile with the scaled image area
                const intersectX = Math.max(tileGridX, gridOffsetX);
                const intersectY = Math.max(tileGridY, gridOffsetY);
        
                const intersectW = Math.min(tileGridX + tileGridW, gridOffsetX + scaledImgWidth) - intersectX;
                const intersectH = Math.min(tileGridY + tileGridH, gridOffsetY + scaledImgHeight) - intersectY;
        
                // If there's an actual image portion to draw
                if (intersectW > 0 && intersectH > 0) {
                    const scaleFactor = img.naturalWidth / scaledImgWidth;
        
                    // Calculate source rect from original image
                    const sourceX = (intersectX - gridOffsetX) * scaleFactor;
                    const sourceY = (intersectY - gridOffsetY) * scaleFactor;
                    const sourceW = intersectW * scaleFactor;
                    const sourceH = intersectH * scaleFactor;
                    
                    // Calculate destination rect on the current page canvas
                    const destX = (intersectX - tileGridX) + marginPx;
                    const destY = (intersectY - tileGridY) + marginPx;
                    const destW = intersectW;
                    const destH = intersectH;
        
                    ctx.drawImage(
                        img,
                        sourceX, sourceY, sourceW, sourceH,
                        destX, destY, destW, destH
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

                // Add crop marks based on assembly logic
                if (settings.cropMarkType !== 'none') {
                    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)'; // red-500
                    ctx.lineWidth = 1;
                    ctx.setLineDash([mmToPx(2), mmToPx(2)]);
                    const lineLength = marginPx * 0.75;
                    const rightEdge = marginPx + tileWidthPx;
                    const bottomEdge = marginPx + tileHeightPx;

                    // Only draw crop marks for interior edges that need cutting: top and left.
                    const drawTop = row > 0;
                    const drawLeft = col > 0;

                    ctx.beginPath();
                    
                    if (settings.cropMarkType === 'full') {
                        // Dashed line across the top margin area to be cut
                        if (drawTop) { 
                            ctx.moveTo(0, marginPx); 
                            ctx.lineTo(canvas.width, marginPx); 
                        }
                        // Dashed line down the left margin area to be cut
                        if (drawLeft) { 
                            ctx.moveTo(marginPx, 0); 
                            ctx.lineTo(marginPx, canvas.height); 
                        }
                    } else { // corners
                        // Top edge marks (for cutting the top margin)
                        if (drawTop) {
                            ctx.moveTo(marginPx, 0); ctx.lineTo(marginPx, lineLength);         // Top-left corner (vertical part)
                            ctx.moveTo(rightEdge, 0); ctx.lineTo(rightEdge, lineLength);       // Top-right corner (vertical part)
                        }
                        // Left edge marks (for cutting the left margin)
                        if (drawLeft) {
                            ctx.moveTo(0, marginPx); ctx.lineTo(lineLength, marginPx);         // Top-left corner (horizontal part)
                            ctx.moveTo(0, bottomEdge); ctx.lineTo(lineLength, bottomEdge);     // Bottom-left corner (horizontal part)
                        }
                    }
                    ctx.stroke();
                }
                newPages.push(canvas.toDataURL('image/jpeg', 0.95));
            }
        }
        setPages(newPages);
        setIsLoading(false);
    } catch (error) {
        console.error("Error in generatePages:", error);
        setIsLoading(false);
    }
}, [imageInfo, settings]);
  
  const generateFullPreview = useCallback(async (pageSources: string[]): Promise<string | null> => {
    try {
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
    } catch (error) {
        console.error("Error in generateFullPreview:", error);
        return null;
    }
  }, [settings]);

  // Effect to generate the full preview whenever the pages or grid changes
  useEffect(() => {
    const createPreview = async () => {
        try {
            if (pages.length > 0) {
                const src = await generateFullPreview(pages);
                setFullPreviewSrc(src);
            } else {
                setFullPreviewSrc(null);
            }
        } catch (error) {
            console.error("Error creating preview in useEffect:", error);
        }
    };
    createPreview();
  }, [pages, settings.gridCols, settings.gridRows, generateFullPreview]);


  const debouncedGeneratePages = useCallback(debounce(generatePages, 300), [generatePages]);

  useEffect(() => {
    debouncedGeneratePages();
  }, [settings, imageInfo, debouncedGeneratePages]);

  const handleImageUpload = (file: File) => {
    try {
        setIsUploading(true);
        setUploadError(null);
        const startTime = Date.now();

        // Web Worker to decode the image in a separate thread, preventing main thread crashes.
        const workerCode = `
          self.onmessage = async (e) => {
            const file = e.data;
            try {
              const bitmap = await createImageBitmap(file);
              self.postMessage({ status: 'success', width: bitmap.width, height: bitmap.height });
              bitmap.close(); // Release memory in the worker
            } catch (error) {
              self.postMessage({ status: 'error', message: "Image could not be decoded. It may be too large or corrupted." });
            }
          };
        `;
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const workerUrl = URL.createObjectURL(blob);
        const worker = new Worker(workerUrl);

        worker.postMessage(file);

        worker.onmessage = (event) => {
          try {
              const { status, width, height, message } = event.data;

              if (status === 'error') {
                console.error("Worker error:", message);
                setUploadError(t('uploadErrorGeneral'));
                setIsUploading(false);
              } else {
                // Worker successfully got dimensions. Now load image on main thread for canvas drawing.
                const url = URL.createObjectURL(file);
                const image = new Image();

                image.onload = () => {
                    try {
                        if (width === 0 || height === 0) {
                            setUploadError(t('uploadErrorDimensions'));
                            setIsUploading(false);
                            URL.revokeObjectURL(url);
                            return;
                        }

                        const finishProcessing = () => {
                            try {
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
                                    suggestedCols = Math.round(width / pagePrintableWidthPx);
                                    suggestedRows = Math.round(height / pagePrintableHeightPx);
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
                                
                                imageRef.current = image;
                                setImageInfo({ url, width, height });
                                setIsUploading(false);
                            } catch (err) {
                                console.error("Error in finishProcessing:", err);
                                setUploadError(t('uploadErrorFallback'));
                                setIsUploading(false);
                            }
                        };

                        const elapsedTime = Date.now() - startTime;
                        const minLoadingTime = 1500; // Keep spinner for a minimum time for better UX
                        const remainingTime = minLoadingTime - elapsedTime;

                        if (remainingTime > 0) {
                            setTimeout(finishProcessing, remainingTime);
                        } else {
                            finishProcessing();
                        }
                    } catch (err) {
                        console.error("Error in image.onload:", err);
                        setUploadError(t('uploadErrorFallback'));
                        setIsUploading(false);
                        URL.revokeObjectURL(url);
                    }
                };

                image.onerror = () => {
                  setUploadError(t('uploadErrorGeneral'));
                  setIsUploading(false);
                  URL.revokeObjectURL(url);
                };

                image.src = url;
              }

              worker.terminate();
              URL.revokeObjectURL(workerUrl);
          } catch (error) {
              console.error("Error in worker.onmessage:", error);
              setUploadError(t('uploadErrorFallback'));
              setIsUploading(false);
          }
        };

        worker.onerror = (error) => {
          console.error("Worker failed catastrophically:", error.message);
          setUploadError(t('uploadErrorFallback'));
          setIsUploading(false);
          worker.terminate();
          URL.revokeObjectURL(workerUrl);
        };
    } catch (error) {
        console.error("Error in handleImageUpload:", error);
        setUploadError(t('uploadErrorFallback'));
        setIsUploading(false);
    }
  };


  const generateAndSavePdf = async () => {
    try {
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
          try {
              pdf.save('print-my-poster.pdf');
              setIsGeneratingPdf(false);
          } catch (e) {
              console.error("Error saving PDF:", e);
              setIsGeneratingPdf(false);
          }
        }, 100);
    } catch (error) {
        console.error("Error in generateAndSavePdf:", error);
        setIsGeneratingPdf(false);
    }
  };
  
  const handleDownloadClick = () => {
    setIsAdModalOpen(true);
  };

  const handleShare = async () => {
    try {
        const shareData = {
          title: t('shareTitle'),
          text: t('shareText'),
          url: 'https://www.printmyposter.art/',
        };

        if (navigator.share) {
          try {
            await navigator.share(shareData);
          } catch (error) {
            console.error('Error sharing:', error);
          }
        } else {
          try {
            await navigator.clipboard.writeText(shareData.url);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
          } catch (error) {
            console.error('Error copying to clipboard:', error);
            alert('Could not copy link to clipboard.');
          }
        }
    } catch (error) {
        console.error("Error in handleShare:", error);
    }
  };

  // Fake poster count increment
  useEffect(() => {
    const interval = setInterval(() => {
      try {
          setPostersCreatedCount(c => c + Math.floor(Math.random() * 3) + 1);
      } catch (e) {
          console.error("Error in poster count interval:", e);
      }
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
                        <button
                          onClick={handleShare}
                          className="hidden sm:inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold text-sm py-2 px-3 rounded-md hover:bg-slate-50 transition-all duration-200 border border-slate-200 shadow-sm min-w-[140px]"
                        >
                          {shareCopied ? (
                            <span className="flex items-center gap-2 text-green-600">
                              <CheckCircleIcon className="w-5 h-5" />
                              {t('linkCopied')}
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <ShareIcon className="w-5 h-5 text-indigo-600" />
                              {t('shareButton')}
                            </span>
                          )}
                        </button>
                        <LanguageSwitcher />
                        <a 
                            href="https://www.paypal.com/donate/?hosted_button_id=G5XFE9CREP54U"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:inline-flex items-center gap-2 bg-sky-100 text-sky-800 font-bold text-sm py-2 px-3 rounded-md hover:bg-sky-200 transition-colors"
                        >
                            <PayPalIcon className="w-5 h-5" />
                            {t('donateWithPayPal')}
                        </a>
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
            <div id="container-1b88d1385b49e0f8d92886dc4c59c255"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <SettingsPanel 
                  settings={settings}
                  onSettingsChange={setSettings}
                  onImageUpload={handleImageUpload}
                  hasImage={!!imageInfo}
                  isUploading={isUploading}
                  uploadError={uploadError}
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
                    <DownloadPanel onDownload={handleDownloadClick} disabled={isGeneratingPdf || isLoading || pages.length === 0} isGenerating={isGeneratingPdf} />
                    <Instructions settings={settings} />
                    <InstallInstructions />
                  </>
                ) : (
                   isUploading ? (
                     <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md min-h-[400px] flex items-center justify-center">
                       <div className="text-center">
                          <LogoIcon className="w-16 h-16 text-slate-300 mx-auto mb-4 animate-pulse" />
                          <h3 className="text-xl font-bold text-slate-700">{t('uploadingMessage')}</h3>
                          <p className="text-slate-500 mt-2">{t('uploadingSubtitle')}</p>
                       </div>
                    </div>
                   ) : (
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-md min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-300">
                      <div className="text-center">
                         <UploadIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                         <h3 className="text-xl font-bold text-slate-700">{t('uploadPromptTitle')}</h3>
                         <p className="text-slate-500 mt-2">{t('uploadPromptSubtitle')}</p>
                      </div>
                    </div>
                   )
                )}
              </div>
            </div>
        </main>
        <footer className="bg-slate-800/90 text-slate-400 mt-24 py-10 text-center text-sm">
             <p>{t('footerText', { year: new Date().getFullYear() })} | v{APP_VERSION}</p>
        </footer>
      </div>
      <FullscreenPreviewModal 
        isOpen={isFullscreenOpen} 
        onClose={handleCloseFullscreen} 
        src={fullPreviewSrc} 
      />
      <AdCountdownModal
        isOpen={isAdModalOpen}
        onClose={() => setIsAdModalOpen(false)}
        onDownload={generateAndSavePdf}
      />
    </>
  );
}

export default App;
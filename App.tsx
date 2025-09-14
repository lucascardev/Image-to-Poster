import React, { useState, useEffect, useCallback } from 'react';
import type { AppSettings, ImageInfo, ResolutionWarning } from './types';
import { A4_HEIGHT_MM, A4_WIDTH_MM, MM_PER_INCH, RECOMMENDED_DPI } from './constants';
import SettingsPanel from './components/SettingsPanel';
import PreviewArea from './components/PreviewArea';
import Instructions from './components/Instructions';
import ResolutionWarningDisplay from './components/ResolutionWarningDisplay';
import { LogoIcon, PixIcon } from './components/Icons';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslations } from './hooks/useTranslations';
import AdPlaceholder from './components/AdPlaceholder';
import InstallInstructions from './components/InstallInstructions';
import DonationModal from './components/DonationModal';
import HowItWorks from './components/HowItWorks';


const App: React.FC = () => {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    gridCols: 2,
    gridRows: 2,
    printerMargin: 5,
    marginUnit: 'mm',
    cropMarkType: 'none',
    addOverlap: true,
  });
  const [processedPages, setProcessedPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resolutionWarning, setResolutionWarning] = useState<ResolutionWarning | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const { t } = useTranslations();

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImageInfo({
          url: e.target?.result as string,
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processImage = useCallback(async () => {
    if (!imageInfo) return;

    setIsLoading(true);
    setResolutionWarning(null);

    // Resolution check
    const totalWidthInches = (settings.gridCols * A4_WIDTH_MM) / MM_PER_INCH;
    const totalHeightInches = (settings.gridRows * A4_HEIGHT_MM) / MM_PER_INCH;
    const requiredWidthPx = totalWidthInches * RECOMMENDED_DPI;
    const requiredHeightPx = totalHeightInches * RECOMMENDED_DPI;

    if (imageInfo.width < requiredWidthPx || imageInfo.height < requiredHeightPx) {
      setResolutionWarning({
        requiredWidth: Math.round(requiredWidthPx),
        requiredHeight: Math.round(requiredHeightPx),
        actualWidth: imageInfo.width,
        actualHeight: imageInfo.height,
      });
    }

    const pages: string[] = [];
    const imageElement = new Image();
    imageElement.src = imageInfo.url;
    await new Promise(resolve => imageElement.onload = resolve);

    const sourceCellWidth = imageElement.naturalWidth / settings.gridCols;
    const sourceCellHeight = imageElement.naturalHeight / settings.gridRows;
    
    const canvasWidth = (A4_WIDTH_MM / MM_PER_INCH) * 300;
    const canvasHeight = (A4_HEIGHT_MM / MM_PER_INCH) * 300;
    
    const marginInMm = settings.marginUnit === 'in' 
      ? settings.printerMargin * MM_PER_INCH
      : settings.printerMargin;
    
    const marginXPx = (marginInMm / A4_WIDTH_MM) * canvasWidth;
    const marginYPx = (marginInMm / A4_HEIGHT_MM) * canvasHeight;

    for (let row = 0; row < settings.gridRows; row++) {
      for (let col = 0; col < settings.gridCols; col++) {
        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) continue;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const sx = col * sourceCellWidth;
        const sy = row * sourceCellHeight;

        const OVERLAP_MM = 10;
        const overlapPxX = (OVERLAP_MM / A4_WIDTH_MM) * canvasWidth;
        const overlapPxY = (OVERLAP_MM / A4_HEIGHT_MM) * canvasHeight;

        const hasRightTab = settings.addOverlap && col < settings.gridCols - 1;
        const hasBottomTab = settings.addOverlap && row < settings.gridRows - 1;

        const printableWidth = canvas.width - (2 * marginXPx);
        const printableHeight = canvas.height - (2 * marginYPx);

        // Define the image's destination rectangle, shrinking it to make space for tabs
        const dWidth = printableWidth - (hasRightTab ? overlapPxX : 0);
        const dHeight = printableHeight - (hasBottomTab ? overlapPxY : 0);
        const dx = marginXPx;
        const dy = marginYPx;

        // Draw the image slice
        ctx.drawImage(
          imageElement,
          sx,
          sy,
          sourceCellWidth,
          sourceCellHeight,
          dx,
          dy,
          dWidth,
          dHeight
        );

        // Draw glue tabs in the empty margin space
        if (settings.addOverlap) {
            const patternCanvas = document.createElement('canvas');
            const patternCtx = patternCanvas.getContext('2d');
            patternCanvas.width = 8;
            patternCanvas.height = 8;
            if (patternCtx) {
                patternCtx.strokeStyle = 'rgba(59, 130, 246, 0.7)'; // blue-500
                patternCtx.lineWidth = 1.5;
                patternCtx.beginPath();
                patternCtx.moveTo(0, 8);
                patternCtx.lineTo(8, 0);
                patternCtx.stroke();
            }
            const pattern = ctx.createPattern(patternCanvas, 'repeat');
            if (pattern) {
                ctx.fillStyle = pattern;
            }
            
            if (hasRightTab) {
                ctx.fillRect(dx + dWidth, dy, overlapPxX, dHeight);
            }
            if (hasBottomTab) {
                ctx.fillRect(dx, dy + dHeight, dWidth, overlapPxY);
            }
            // Fill the corner if both tabs exist
            if (hasRightTab && hasBottomTab) {
                ctx.fillRect(dx + dWidth, dy + dHeight, overlapPxX, overlapPxY);
            }
        }
        
        // Define actual image edges for crop marks
        const imageEdgeTop = dy;
        const imageEdgeBottom = dy + dHeight;
        const imageEdgeLeft = dx;
        const imageEdgeRight = dx + dWidth;

        if (settings.cropMarkType !== 'none') {
            ctx.strokeStyle = 'rgba(220, 38, 38, 0.9)'; // More opaque red
            ctx.lineWidth = 3; 

            if (settings.cropMarkType === 'full') {
                ctx.setLineDash([8, 6]);
                ctx.beginPath();
                
                // Top horizontal line (always has a cuttable edge above it or is on the edge)
                ctx.moveTo(0, imageEdgeTop);
                ctx.lineTo(canvas.width, imageEdgeTop);

                // Left vertical line (always has a cuttable edge to its left or is on the edge)
                ctx.moveTo(imageEdgeLeft, 0);
                ctx.lineTo(imageEdgeLeft, canvas.height);

                // Bottom horizontal line (only if it's a cuttable edge)
                if (!hasBottomTab) {
                    ctx.moveTo(0, imageEdgeBottom);
                    ctx.lineTo(canvas.width, imageEdgeBottom);
                }

                // Right vertical line (only if it's a cuttable edge)
                if (!hasRightTab) {
                    ctx.moveTo(imageEdgeRight, 0);
                    ctx.lineTo(imageEdgeRight, canvas.height);
                }
                
                ctx.stroke();
                ctx.setLineDash([]);
            } else if (settings.cropMarkType === 'corners') {
                const markLength = 70; // Increased length
                ctx.beginPath();
                
                // Top-left corner (always cuttable)
                ctx.moveTo(0, imageEdgeTop); ctx.lineTo(markLength, imageEdgeTop);
                ctx.moveTo(imageEdgeLeft, 0); ctx.lineTo(imageEdgeLeft, markLength);
                
                // Top-right corner
                ctx.moveTo(canvas.width - markLength, imageEdgeTop); ctx.lineTo(canvas.width, imageEdgeTop);
                if (!hasRightTab) {
                    ctx.moveTo(imageEdgeRight, 0); ctx.lineTo(imageEdgeRight, markLength);
                }

                // Bottom-left corner
                ctx.moveTo(imageEdgeLeft, canvas.height - markLength); ctx.lineTo(imageEdgeLeft, canvas.height);
                if (!hasBottomTab) {
                    ctx.moveTo(0, imageEdgeBottom); ctx.lineTo(markLength, imageEdgeBottom);
                }
                
                // Bottom-right corner
                if (!hasBottomTab) {
                    ctx.moveTo(canvas.width - markLength, imageEdgeBottom); ctx.lineTo(canvas.width, imageEdgeBottom);
                }
                if (!hasRightTab) {
                    ctx.moveTo(imageEdgeRight, canvas.height - markLength); ctx.lineTo(imageEdgeRight, canvas.height);
                }
                
                ctx.stroke();
            }
        }

        const isLastPage = row === settings.gridRows - 1 && col === settings.gridCols - 1;
        if (isLastPage) {
            // --- Branding Card ---
            const cardPadding = 40;
            const lineSpacing = 10;
            const cornerRadius = 20;
            const cardOffset = 20;

            const line1 = t('brandingLine1', { appName: t('appTitle') });
            const line2 = t('brandingLine2');
            
            // Measure text for card dimensions
            ctx.font = 'bold 36px sans-serif';
            const line1Metrics = ctx.measureText(line1);
            ctx.font = '30px sans-serif';
            const line2Metrics = ctx.measureText(line2);

            const cardWidth = Math.max(line1Metrics.width, line2Metrics.width) + (cardPadding * 2);
            const cardHeight = 36 + 30 + lineSpacing + (cardPadding * 2); // font sizes + spacing + padding

            // Position card in bottom-right of printable area
            const cardX = canvas.width - marginXPx - cardWidth - cardOffset;
            const cardY = canvas.height - marginYPx - cardHeight - cardOffset;

            // Draw card background
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardWidth, cardHeight, cornerRadius);
            ctx.fill();
            ctx.stroke();

            // Draw text
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            ctx.fillStyle = '#334155'; // slate-700

            const textX = cardX + cardPadding;
            const textY1 = cardY + cardPadding;

            ctx.font = 'bold 36px sans-serif';
            ctx.fillText(line1, textX, textY1);

            const textY2 = textY1 + 36 + lineSpacing;
            ctx.font = '30px sans-serif';
            ctx.fillText(line2, textX, textY2);
        }

        pages.push(canvas.toDataURL('image/jpeg', 0.95));
      }
    }
    
    setProcessedPages(pages);
    setIsLoading(false);
  }, [imageInfo, settings, t]);

  useEffect(() => {
    if (imageInfo) {
      processImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageInfo, settings]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <LogoIcon className="h-12 w-12 text-indigo-600" />
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500">{t('appTitle')}</h1>
                <p className="text-slate-600 mt-1 font-medium">{t('appNewSubtitle')}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
          <AdPlaceholder type="sevenkbet" className="h-24 w-full max-w-4xl mx-auto mt-4" />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 max-w-7xl">
        {!imageInfo ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-12 mb-8">
              <HowItWorks />
            </div>
            <div className="lg:col-span-6">
               <SettingsPanel 
                settings={settings} 
                onSettingsChange={setSettings}
                onImageUpload={handleImageUpload}
                hasImage={!!imageInfo}
              />
            </div>
            <div className="lg:col-span-6">
              <InstallInstructions />
            </div>
          </div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
              <SettingsPanel 
                settings={settings} 
                onSettingsChange={setSettings}
                onImageUpload={handleImageUpload}
                hasImage={!!imageInfo}
              />
            </div>
            <div className="lg:col-span-6">
              {resolutionWarning && (
                <ResolutionWarningDisplay 
                  warning={resolutionWarning} 
                  cols={settings.gridCols}
                  rows={settings.gridRows}
                />
              )}
              <PreviewArea pages={processedPages} isLoading={isLoading} settings={settings} />
              <Instructions settings={settings} />
            </div>
            <div className="lg:col-span-3">
              <InstallInstructions />
            </div>
          </div>
        )}
      </main>

      <footer className="text-center p-4 text-slate-500 text-sm border-t border-slate-200 mt-8">
          <AdPlaceholder type="sevenkbet-alt" className="h-24 w-full max-w-4xl mx-auto mb-4" />
          <div className="container mx-auto max-w-7xl flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-left">
              <LogoIcon className="h-6 w-6 text-slate-400" />
              <p>{t('footerText', { year: new Date().getFullYear() })}</p>
            </div>
             <button
              onClick={() => setIsDonationModalOpen(true)}
              className="flex items-center gap-2 bg-green-100 text-green-800 font-bold py-2 px-4 rounded-md hover:bg-green-200 transition-colors"
            >
              <PixIcon className="w-5 h-5" />
              {t('donateWithPix')}
            </button>
          </div>
      </footer>

      <DonationModal 
        isOpen={isDonationModalOpen} 
        onClose={() => setIsDonationModalOpen(false)} 
      />
    </div>
  );
};

export default App;
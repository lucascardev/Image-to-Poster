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
import { LogoIcon, PixIcon } from './components/Icons';

// Types and Constants
import type { AppSettings, ImageInfo, ResolutionWarning } from './types';
import { A4_WIDTH_MM, A4_HEIGHT_MM, MM_PER_INCH, RECOMMENDED_DPI } from './constants';
import { useTranslations } from './hooks/useTranslations';

const initialSettings: AppSettings = {
  gridCols: 3,
  gridRows: 2,
  printerMargin: 5,
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

function App() {
  const { t } = useTranslations();
  const [settings, setSettings] = useState<AppSettings>(initialSettings);
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [resolutionWarning, setResolutionWarning] = useState<ResolutionWarning | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [postersCreatedCount, setPostersCreatedCount] = useState(1247); // Start with a realistic number

  const imageRef = useRef<HTMLImageElement | null>(null);

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
    
    // The overlap should be contained within the margin area
    const overlapWidthMm = settings.addOverlap ? Math.min(marginInMm, 10) : 0; // Cap overlap at 10mm

    const pagePrintableWidthMm = A4_WIDTH_MM - (marginInMm * 2);
    const pagePrintableHeightMm = A4_HEIGHT_MM - (marginInMm * 2);

    const totalPrintableWidthMm = (pagePrintableWidthMm * settings.gridCols);
    const totalPrintableHeightMm = (pagePrintableHeightMm * settings.gridRows);
    
    const totalImageAreaRatio = totalPrintableWidthMm / totalPrintableHeightMm;
    const imageRatio = img.naturalWidth / img.naturalHeight;

    let srcWidth, srcHeight, srcX, srcY;

    if (imageRatio > totalImageAreaRatio) {
      // Image is wider than the paper grid, so it will be cropped on the sides
      srcHeight = img.naturalHeight;
      srcWidth = srcHeight * totalImageAreaRatio;
      srcY = 0;
      srcX = (img.naturalWidth - srcWidth) / 2;
    } else {
      // Image is taller or same ratio, so it will be cropped top/bottom
      srcWidth = img.naturalWidth;
      srcHeight = srcWidth / totalImageAreaRatio;
      srcX = 0;
      srcY = (img.naturalHeight - srcHeight) / 2;
    }
    
    const requiredWidth = Math.round((totalPrintableWidthMm / MM_PER_INCH) * RECOMMENDED_DPI);
    const requiredHeight = Math.round((totalPrintableHeightMm / MM_PER_INCH) * RECOMMENDED_DPI);
    
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
    
    const mmToPx = (mm: number) => (mm / MM_PER_INCH) * RECOMMENDED_DPI;
    
    canvas.width = mmToPx(A4_WIDTH_MM);
    canvas.height = mmToPx(A4_HEIGHT_MM);

    const marginPx = mmToPx(marginInMm);
    const overlapPx = mmToPx(overlapWidthMm);

    const tileWidthPx = mmToPx(pagePrintableWidthMm);
    const tileHeightPx = mmToPx(pagePrintableHeightMm);

    for (let row = 0; row < settings.gridRows; row++) {
      for (let col = 0; col < settings.gridCols; col++) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const sX = srcX + (srcWidth / settings.gridCols) * col;
        const sY = srcY + (srcHeight / settings.gridRows) * row;
        const sW = srcWidth / settings.gridCols;
        const sH = srcHeight / settings.gridRows;
        
        const dX = marginPx - (col > 0 ? overlapPx : 0);
        const dY = marginPx - (row > 0 ? overlapPx : 0);
        const dW = tileWidthPx + (col > 0 ? overlapPx : 0) + (col < settings.gridCols -1 ? overlapPx : 0);
        const dH = tileHeightPx + (row > 0 ? overlapPx : 0) + (row < settings.gridRows - 1 ? overlapPx : 0);

        ctx.drawImage(
            img,
            sX - (sW/tileWidthPx) * (col > 0 ? overlapPx : 0), 
            sY - (sH/tileHeightPx) * (row > 0 ? overlapPx : 0), 
            sW + (sW/tileWidthPx) * ((col > 0 ? overlapPx : 0) + (col < settings.gridCols - 1 ? overlapPx : 0)), 
            sH + (sH/tileHeightPx) * ((row > 0 ? overlapPx : 0) + (row < settings.gridRows - 1 ? overlapPx : 0)),
            dX, dY, dW, dH);
        
        // Add overlap area visualization
        if (settings.addOverlap) {
          ctx.save();
          ctx.fillStyle = '#38bdf833'; // light blue with alpha
          
          if (col > 0) { // left overlap area
            ctx.fillRect(marginPx - overlapPx, marginPx - overlapPx, overlapPx, tileHeightPx + (overlapPx * 2));
          }
           if (row > 0) { // top overlap area
            ctx.fillRect(marginPx-overlapPx, marginPx - overlapPx, tileWidthPx + (overlapPx * 2), overlapPx);
          }
          ctx.restore();
          
          // Draw striped pattern on the glue tab area (outside printable area)
           ctx.save();
           const region = new Path2D();
           // Right overlap tab
           if (col < settings.gridCols - 1) {
             region.rect(marginPx + tileWidthPx, 0, marginPx, canvas.height);
           }
           // Bottom overlap tab
           if (row < settings.gridRows - 1) {
             region.rect(0, marginPx + tileHeightPx, canvas.width, marginPx);
           }
           ctx.clip(region);
          
           ctx.fillStyle = '#e0f2fe'; // light blue
           ctx.fillRect(0, 0, canvas.width, canvas.height);
          
           ctx.strokeStyle = '#38bdf8'; // darker blue
           ctx.lineWidth = 1;
           ctx.beginPath();
           for(let i = -canvas.height; i < canvas.width; i += 15) {
               ctx.moveTo(i, 0);
               ctx.lineTo(i + canvas.height, canvas.height);
           }
           ctx.stroke();
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
            if(settings.cropMarkType === 'full') {
                 // Horizontal lines
                ctx.moveTo(0, marginPx); ctx.lineTo(canvas.width, marginPx);
                ctx.moveTo(0, bottomEdge); ctx.lineTo(canvas.width, bottomEdge);

                // Vertical lines
                ctx.moveTo(marginPx, 0); ctx.lineTo(marginPx, canvas.height);
                ctx.moveTo(rightEdge, 0); ctx.lineTo(rightEdge, canvas.height);
            } else { // corners
                // TL
                ctx.moveTo(marginPx, 0); ctx.lineTo(marginPx, lineLength);
                ctx.moveTo(0, marginPx); ctx.lineTo(lineLength, marginPx);
                // TR
                ctx.moveTo(rightEdge, 0); ctx.lineTo(rightEdge, lineLength);
                ctx.moveTo(canvas.width, marginPx); ctx.lineTo(rightEdge - lineLength, marginPx);
                // BL
                ctx.moveTo(marginPx, canvas.height); ctx.lineTo(marginPx, bottomEdge - lineLength);
                ctx.moveTo(0, bottomEdge); ctx.lineTo(lineLength, bottomEdge);
                // BR
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

  const debouncedGeneratePages = useCallback(debounce(generatePages, 300), [generatePages]);

  useEffect(() => {
    debouncedGeneratePages();
  }, [settings, imageInfo, debouncedGeneratePages]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        imageRef.current = img;
        setImageInfo({ url, width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
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

    const appName = t('appTitle');
    const appUrl = t('brandingLine2');

    for (let i = 0; i < pages.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(pages[i], 'JPEG', 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM);

      // Add branding to the bottom margin
      pdf.setFontSize(6);
      pdf.setTextColor(150);
      const brandingText1 = t('brandingLine1', { appName });
      const brandingText2 = appUrl;
      pdf.text(brandingText1, A4_WIDTH_MM / 2, A4_HEIGHT_MM - 3, { align: 'center' });
      pdf.text(brandingText2, A4_WIDTH_MM / 2, A4_HEIGHT_MM - 1.5, { align: 'center' });
    }
    
    // Using a timeout to give user feedback before the save dialog blocks the UI
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
                    <PreviewArea pages={pages} isLoading={isLoading} settings={settings} />
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
    </>
  );
}

export default App;
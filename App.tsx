import React, { useState, useEffect, useCallback } from 'react';
import type { AppSettings, ImageInfo, ResolutionWarning } from './types';
import { A4_HEIGHT_MM, A4_WIDTH_MM, MM_PER_INCH, RECOMMENDED_DPI } from './constants';
import SettingsPanel from './components/SettingsPanel';
import PreviewArea from './components/PreviewArea';
import Instructions from './components/Instructions';
import ResolutionWarningDisplay from './components/ResolutionWarningDisplay';
import { UploadIcon, LogoIcon, PixIcon } from './components/Icons';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslations } from './hooks/useTranslations';
import AdPlaceholder from './components/AdPlaceholder';
import InstallInstructions from './components/InstallInstructions';
import DonationModal from './components/DonationModal';


const App: React.FC = () => {
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    gridCols: 2,
    gridRows: 2,
    printerMargin: 5,
    marginUnit: 'mm',
    cropMarkType: 'none',
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

        ctx.drawImage(
          imageElement,
          sx,
          sy,
          sourceCellWidth,
          sourceCellHeight,
          marginXPx,
          marginYPx,
          canvas.width - (2 * marginXPx),
          canvas.height - (2 * marginYPx)
        );
        
        if (settings.cropMarkType !== 'none') {
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
          ctx.lineWidth = 1;

          if (settings.cropMarkType === 'full') {
            ctx.setLineDash([5, 5]);

            // Horizontal lines
            ctx.beginPath();
            ctx.moveTo(0, marginYPx);
            ctx.lineTo(canvas.width, marginYPx);
            ctx.moveTo(0, canvas.height - marginYPx);
            ctx.lineTo(canvas.width, canvas.height - marginYPx);
            ctx.stroke();

            // Vertical lines
            ctx.beginPath();
            ctx.moveTo(marginXPx, 0);
            ctx.lineTo(marginXPx, canvas.height);
            ctx.moveTo(canvas.width - marginXPx, 0);
            ctx.lineTo(canvas.width - marginXPx, canvas.height);
            ctx.stroke();
            
            ctx.setLineDash([]);
          } else if (settings.cropMarkType === 'corners') {
            const markLength = 25;
            
            ctx.beginPath();
            // Top-left corner marks
            ctx.moveTo(0, marginYPx); ctx.lineTo(markLength, marginYPx);
            ctx.moveTo(marginXPx, 0); ctx.lineTo(marginXPx, markLength);
            
            // Top-right corner marks
            ctx.moveTo(canvas.width - markLength, marginYPx); ctx.lineTo(canvas.width, marginYPx);
            ctx.moveTo(canvas.width - marginXPx, 0); ctx.lineTo(canvas.width - marginXPx, markLength);
            
            // Bottom-left corner marks
            ctx.moveTo(0, canvas.height - marginYPx); ctx.lineTo(markLength, canvas.height - marginYPx);
            ctx.moveTo(marginXPx, canvas.height - markLength); ctx.lineTo(marginXPx, canvas.height);

            // Bottom-right corner marks
            ctx.moveTo(canvas.width - markLength, canvas.height - marginYPx); ctx.lineTo(canvas.width, canvas.height - marginYPx);
            ctx.moveTo(canvas.width - marginXPx, canvas.height - markLength); ctx.lineTo(canvas.width - marginXPx, canvas.height);
            ctx.stroke();
          }
        }

        pages.push(canvas.toDataURL('image/jpeg', 0.95));
      }
    }
    
    setProcessedPages(pages);
    setIsLoading(false);
  }, [imageInfo, settings]);

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
          <AdPlaceholder className="h-24 w-full max-w-4xl mx-auto mt-4" />
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 max-w-7xl">
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
            {!imageInfo ? (
              <div className="flex flex-col items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg p-12 h-full min-h-[400px]">
                <UploadIcon className="w-16 h-16 text-slate-400 mb-4" />
                <h3 className="text-xl font-semibold text-slate-600">{t('uploadPromptTitle')}</h3>
                <p className="text-slate-500 mt-1">{t('uploadPromptSubtitle')}</p>
              </div>
            ) : (
              <>
                <PreviewArea pages={processedPages} isLoading={isLoading} settings={settings} />
                <Instructions />
              </>
            )}
          </div>
           <div className="lg:col-span-3">
             <InstallInstructions />
           </div>
        </div>
      </main>

      <footer className="text-center p-4 text-slate-500 text-sm border-t border-slate-200 mt-8">
          <AdPlaceholder className="h-24 w-full max-w-4xl mx-auto mb-4" />
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
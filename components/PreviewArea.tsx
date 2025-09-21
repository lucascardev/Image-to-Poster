import React from 'react';
import { LoadingIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';
import { A4_WIDTH_MM, A4_HEIGHT_MM, MM_PER_INCH } from '../constants';
import type { AppSettings } from '../types';
import AdPlaceholder from './AdPlaceholder';

interface PreviewAreaProps {
  pages: string[];
  isLoading: boolean;
  settings: AppSettings;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ pages, isLoading, settings }) => {
  const { t } = useTranslations();
  
  const marginInMm = settings.marginUnit === 'in'
    ? settings.printerMargin * MM_PER_INCH
    : settings.printerMargin;

  const marginXPercentage = (marginInMm / A4_WIDTH_MM) * 100;
  const marginYPercentage = (marginInMm / A4_HEIGHT_MM) * 100;
  const calculatedBorderWidth = `${marginYPercentage}% ${marginXPercentage}%`;


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold border-b pb-4 mb-6">{t('previewTitle')}</h2>

      <AdPlaceholder type="honeygain" className="mb-6" />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <LoadingIcon className="w-12 h-12 text-indigo-500 animate-spin" />
          <p className="mt-4 text-slate-600 font-semibold">{t('loadingMessage')}</p>
        </div>
      ) : (
        <div id="print-area">
          <div
            className="grid gap-1 bg-slate-200 p-1 rounded-md"
            style={{ gridTemplateColumns: `repeat(${settings.gridCols}, 1fr)` }}
          >
            {pages.map((pageSrc, index) => (
              <div key={index} className="relative aspect-[210/297] bg-white overflow-hidden print-page">
                <img src={pageSrc} alt={t('pageAltText', { index: index + 1 })} className="w-full h-full object-contain print-page-image" />
                <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {index + 1}
                </div>
                <div
                  className="absolute top-0 left-0 right-0 bottom-0 border-red-500/50 border-dashed pointer-events-none"
                  style={{
                      borderWidth: calculatedBorderWidth,
                      boxSizing: 'border-box'
                  }}
                  aria-hidden="true"
                ></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewArea;
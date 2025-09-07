import React from 'react';
import type { ResolutionWarning } from '../types';
import { WarningIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface ResolutionWarningProps {
  warning: ResolutionWarning;
  cols: number;
  rows: number;
}

const ResolutionWarningDisplay: React.FC<ResolutionWarningProps> = ({ warning, cols, rows }) => {
  const { t } = useTranslations();
  
  const translatedMessage = t('warningMessage', {
    cols,
    rows,
    requiredWidth: warning.requiredWidth,
    requiredHeight: warning.requiredHeight,
    actualWidth: warning.actualWidth,
    actualHeight: warning.actualHeight
  });

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow">
      <div className="flex">
        <div className="flex-shrink-0">
          <WarningIcon className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-bold text-yellow-800">{t('warningTitle')}</p>
          <p
            className="mt-1 text-sm text-yellow-700"
            dangerouslySetInnerHTML={{ __html: translatedMessage }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResolutionWarningDisplay;

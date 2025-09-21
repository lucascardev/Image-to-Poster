import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { DownloadIcon } from './Icons';

interface StatsWidgetProps {
  count: number;
}

const StatsWidget: React.FC<StatsWidgetProps> = ({ count }) => {
  const { t, language } = useTranslations();

  return (
    <div className="flex items-center gap-3 bg-slate-100 rounded-lg px-3 py-2">
      <DownloadIcon className="w-5 h-5 text-indigo-500" />
      <div>
        <div className="font-bold text-slate-800 text-lg leading-none">
          {count.toLocaleString(language)}
        </div>
        <div className="text-xs text-slate-500 font-medium leading-none mt-1">
          {t('postersCreated')}
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
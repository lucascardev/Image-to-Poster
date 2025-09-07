import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface AdPlaceholderProps {
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ className }) => {
  const { t } = useTranslations();
  return (
    <div
      className={`flex items-center justify-center bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 text-sm ${className}`}
      aria-label={t('advertisement')}
    >
      <span>{t('advertisement')}</span>
    </div>
  );
};

export default AdPlaceholder;

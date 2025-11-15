import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { CheckCircleIcon } from './Icons';
import ThreeBackground from './ThreeBackground';

const DonationCompleted: React.FC = () => {
  const { t } = useTranslations();

  return (
    <>
      <ThreeBackground />
      <div className="relative min-h-screen font-sans flex items-center justify-center p-4">
        <div className="bg-white/80 backdrop-blur-lg rounded-lg shadow-xl p-8 max-w-lg text-center">
          <div className="mx-auto bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mb-6">
              <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">{t('donationCompletedTitle')}</h1>
          <p className="text-slate-600 mb-8">{t('donationCompletedDesc')}</p>
          <a
            href="/"
            className="inline-block bg-indigo-600 text-white font-bold py-3 px-8 rounded-md hover:bg-indigo-700 transition-colors text-lg"
          >
            {t('backToHomeButton')}
          </a>
        </div>
      </div>
    </>
  );
};

export default DonationCompleted;

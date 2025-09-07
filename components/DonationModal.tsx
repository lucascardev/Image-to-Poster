import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { CloseIcon, PixIcon } from './Icons';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={t('closeButton')}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
            <PixIcon className="w-10 h-10 text-green-700" />
        </div>
        
        <h2 id="donation-title" className="text-2xl font-bold text-slate-800 mb-2">{t('donationTitle')}</h2>
        <p className="text-slate-600 mb-6">{t('donationInstruction')}</p>

        <div className="bg-slate-100 p-4 rounded-lg">
            {/* Placeholder for a real QR Code */}
            <div className="w-48 h-48 bg-slate-300 mx-auto rounded-md flex items-center justify-center font-mono text-slate-500 mb-4">
                QR Code
            </div>
            <p className="text-sm font-semibold text-slate-700">{t('pixKeyLabel')}</p>
            <p className="font-mono bg-slate-200 text-slate-800 rounded px-2 py-1 inline-block mt-1">
                {t('pixKey')}
            </p>
        </div>

      </div>
    </div>
  );
};

export default DonationModal;
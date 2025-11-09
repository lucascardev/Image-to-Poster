import React, { useState, useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { DownloadIcon, LoadingIcon, CloseIcon, LockClosedIcon, CheckCircleIcon } from './Icons';

interface AdCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

const AD_LINK = "https://www.effectivegatecpm.com/sx4e2juqdp?key=329243324bd75ed09c3b022d56d0520b";
const COUNTDOWN_SECONDS = 15;

const AdCountdownModal: React.FC<AdCountdownModalProps> = ({ isOpen, onClose, onDownload }) => {
  const { t } = useTranslations();
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [adTabOpened, setAdTabOpened] = useState(false);

  // Reset state when modal is closed or re-opened
  useEffect(() => {
    if (isOpen) {
      setCountdown(COUNTDOWN_SECONDS);
      setAdTabOpened(false);
    }
  }, [isOpen]);

  // Countdown timer logic that only runs when the tab is hidden
  useEffect(() => {
    if (!isOpen || !adTabOpened || countdown <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown(current => (document.hidden ? Math.max(0, current - 1) : current));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isOpen, adTabOpened, countdown]);

  const handleUnlockClick = () => {
    window.open(AD_LINK, '_blank');
    setAdTabOpened(true);
  };

  const handleDownloadAndClose = () => {
    onDownload();
    onClose();
  };

  if (!isOpen) return null;

  const isUnlocked = adTabOpened && countdown <= 0;

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md text-center relative"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={t('closeButton')}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        {!isUnlocked && !adTabOpened && (
          <>
            <div className="mx-auto bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <LockClosedIcon className="w-10 h-10 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('adModalTitle')}</h2>
            <p className="text-slate-600 mb-6">{t('adModalDesc', { seconds: COUNTDOWN_SECONDS })}</p>
            <button
              onClick={handleUnlockClick}
              className="w-full inline-flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-md hover:bg-indigo-700 transition-colors text-lg shadow hover:shadow-lg"
            >
              {t('adModalButton')}
            </button>
          </>
        )}

        {!isUnlocked && adTabOpened && (
          <>
            <div className="mx-auto bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mb-4 relative">
              <LoadingIcon className="w-16 h-16 text-indigo-500 animate-spin" />
              <span className="absolute text-2xl font-bold text-indigo-700">{countdown}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('adModalWaitingTitle')}</h2>
            <p className="text-slate-600 mb-6">{t('adModalStayOnPage')}</p>
          </>
        )}
        
        {isUnlocked && (
          <>
            <div className="mx-auto bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('adModalUnlockedTitle')}</h2>
            <p className="text-slate-600 mb-6">{t('adModalUnlockedDesc')}</p>
            <button
              onClick={handleDownloadAndClose}
              className="w-full inline-flex items-center justify-center bg-green-600 text-white font-bold py-3 px-8 rounded-md hover:bg-green-700 transition-colors text-lg shadow hover:shadow-lg"
            >
              <DownloadIcon className="w-6 h-6 mr-3" />
              {t('adModalDownloadNow')}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdCountdownModal;
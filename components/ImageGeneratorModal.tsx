
import React from 'react';
import { CloseIcon, SparklesIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface ImageGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm" 
      role="dialog" 
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md relative p-8 text-center" 
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-500"
          aria-label={t('closeButton')}
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 p-4 rounded-full text-white w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
            <SparklesIcon className="w-10 h-10" />
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-3">{t('generatorTitle')}</h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
            {t('generatorInstruction')}
        </p>

        <a
            href="https://gemini.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3.5 px-6 rounded-lg hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-md w-full mb-6"
        >
            <SparklesIcon className="w-5 h-5" />
            <span>{t('openGeminiButton')}</span>
        </a>
        
        <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <strong>{t('tipLabel')}:</strong> {t('generatorSubInstruction')}
        </div>

      </div>
    </div>
  );
};

export default ImageGeneratorModal;

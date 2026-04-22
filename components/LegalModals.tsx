import React from 'react';
import { CloseIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<LegalModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-slate-600 text-sm leading-relaxed prose prose-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('privacyTitle')}>
      <p dangerouslySetInnerHTML={{ __html: t('privacyP1') }} />
      <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">{t('privacyH1')}</h3>
      <p>{t('privacyP2')}</p>
      
      <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">{t('privacyH2')}</h3>
      <p>{t('privacyP3')}</p>
      <p dangerouslySetInnerHTML={{ __html: t('privacyP4') }} />
      
      <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">{t('privacyH3')}</h3>
      <p>{t('privacyP5')}</p>
    </Modal>
  );
};

export const TermsOfServiceModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('termsTitle')}>
      <p dangerouslySetInnerHTML={{ __html: t('termsP1') }} />
      <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">{t('termsH1')}</h3>
      <p>{t('termsP2')}</p>
      
      <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">{t('termsH2')}</h3>
      <p>{t('termsP3')}</p>
      
      <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">{t('termsH3')}</h3>
      <p>{t('termsP4')}</p>
    </Modal>
  );
};

export const AboutModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { t } = useTranslations();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('aboutTitle')}>
      <p dangerouslySetInnerHTML={{ __html: t('aboutP1') }} />
      
      <h3 className="text-lg font-bold text-slate-800 mt-4 mb-2">{t('aboutH1')}</h3>
      <p dangerouslySetInnerHTML={{ __html: t('aboutP2') }} />
    </Modal>
  );
};

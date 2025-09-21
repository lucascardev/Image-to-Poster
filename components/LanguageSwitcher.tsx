import React from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { BrazilFlagIcon, UkFlagIcon } from './Icons';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslations();

  const handleLanguageChange = (lang: 'en' | 'pt-BR') => {
    setLanguage(lang);
  };

  const commonClasses = "flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200";
  const activeClasses = "bg-white text-indigo-600 shadow-md scale-105";
  const inactiveClasses = "text-slate-500 bg-slate-100 hover:bg-slate-200";

  return (
    <div className="flex items-center space-x-1 bg-slate-200 p-1 rounded-full">
      <button
        onClick={() => handleLanguageChange('pt-BR')}
        className={`${commonClasses} ${language === 'pt-BR' ? activeClasses : inactiveClasses}`}
        aria-pressed={language === 'pt-BR'}
      >
        <BrazilFlagIcon className="w-5 h-5" />
        <span>PT-BR</span>
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`${commonClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
        aria-pressed={language === 'en'}
      >
        <UkFlagIcon className="w-5 h-5" />
        <span>EN</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
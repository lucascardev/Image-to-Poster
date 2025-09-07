import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslations();

  const handleLanguageChange = (lang: 'en' | 'pt-BR') => {
    setLanguage(lang);
  };

  const commonClasses = "px-3 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors";
  const activeClasses = "bg-indigo-600 text-white";
  const inactiveClasses = "text-slate-600 bg-slate-200 hover:bg-slate-300";

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleLanguageChange('pt-BR')}
        className={`${commonClasses} ${language === 'pt-BR' ? activeClasses : inactiveClasses}`}
        aria-pressed={language === 'pt-BR'}
      >
        PT-BR
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        className={`${commonClasses} ${language === 'en' ? activeClasses : inactiveClasses}`}
        aria-pressed={language === 'en'}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;

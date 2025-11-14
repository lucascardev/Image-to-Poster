import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from '../hooks/useTranslations';
import { BrazilFlagIcon, UkFlagIcon, SpainFlagIcon, ChinaFlagIcon, JapanFlagIcon, GermanFlagIcon, ChevronDownIcon } from './Icons';

type Language = 'en' | 'pt-BR' | 'es' | 'zh' | 'ja' | 'de';

const languageOptions: { lang: Language; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { lang: 'pt-BR', label: 'PT-BR', Icon: BrazilFlagIcon },
  { lang: 'es', label: 'ES', Icon: SpainFlagIcon },
  { lang: 'de', label: 'DE', Icon: GermanFlagIcon },
  { lang: 'zh', label: 'CN', Icon: ChinaFlagIcon },
  { lang: 'ja', label: 'JP', Icon: JapanFlagIcon },
  { lang: 'en', label: 'EN', Icon: UkFlagIcon },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);
  
  const currentLanguageOption = languageOptions.find(opt => opt.lang === language) || languageOptions.find(opt => opt.lang === 'en')!;

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-bold bg-white rounded-md shadow-sm border border-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <currentLanguageOption.Icon className="w-5 h-5" />
        <span className="hidden sm:inline">{currentLanguageOption.label}</span>
        <ChevronDownIcon className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-slate-200 z-50 origin-top-right"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1" role="none">
            {languageOptions.map(({ lang, label, Icon }) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full text-left flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${
                  language === lang 
                  ? 'bg-indigo-50 text-indigo-700' 
                  : 'text-slate-700 hover:bg-slate-100'
                }`}
                role="menuitem"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
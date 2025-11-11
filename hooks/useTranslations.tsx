import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import enTranslations from './locales/en.ts';
import ptBRTranslations from './locales/pt-BR.ts';
import esTranslations from './locales/es.ts';
import zhTranslations from './locales/zh.ts';
import jaTranslations from './locales/ja.ts';

type Language = 'en' | 'pt-BR' | 'es' | 'zh' | 'ja';

interface TranslationsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

const availableLanguages: Language[] = ['en', 'pt-BR', 'es', 'zh', 'ja'];
const defaultLanguage: Language = 'en';

const translationsData: Record<Language, Record<string, string>> = {
  'en': enTranslations,
  'pt-BR': ptBRTranslations,
  'es': esTranslations,
  'zh': zhTranslations,
  'ja': jaTranslations,
};

export const TranslationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem('language');
      if (savedLang && availableLanguages.includes(savedLang as Language)) {
        return savedLang as Language;
      }
      const browserLang = navigator.language;
      if (browserLang.startsWith('pt')) return 'pt-BR';
      if (browserLang.startsWith('es')) return 'es';
      if (browserLang.startsWith('ja')) return 'ja';
      if (browserLang.startsWith('zh')) return 'zh';
    } catch (e) {
      // Fails in environments where localStorage or navigator is not available
    }
    return defaultLanguage;
  });

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    try {
        localStorage.setItem('language', lang);
    } catch (e) {
        console.error('Could not save language to localStorage');
    }
    setLanguageState(lang);
  };

  const translations = translationsData[language] || translationsData[defaultLanguage];

  const t = useCallback((key: string, replacements?: Record<string, string | number>): string => {
    let translation = translations[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            const regex = new RegExp(`{${placeholder}}`, 'g');
            translation = translation.replace(regex, String(replacements[placeholder]));
        });
    }
    return translation;
  }, [translations]);

  const value = { language, setLanguage, t };

  return (
    <TranslationsContext.Provider value={value}>
      {children}
    </TranslationsContext.Provider>
  );
};

export const useTranslations = (): TranslationsContextType => {
  const context = useContext(TranslationsContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a TranslationsProvider');
  }
  return context;
};
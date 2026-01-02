import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import enTranslations from './locales/en.ts';
import ptBRTranslations from './locales/pt-BR.ts';
import esTranslations from './locales/es.ts';
import zhTranslations from './locales/zh.ts';
import jaTranslations from './locales/ja.ts';
import deTranslations from './locales/de.ts';
import frTranslations from './locales/fr.ts';
import itTranslations from './locales/it.ts';
import ruTranslations from './locales/ru.ts';

type Language = 'en' | 'pt-BR' | 'es' | 'zh' | 'ja' | 'de' | 'fr' | 'it' | 'ru';

interface TranslationsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

const availableLanguages: Language[] = ['en', 'pt-BR', 'es', 'zh', 'ja', 'de', 'fr', 'it', 'ru'];
const defaultLanguage: Language = 'en';

const translationsData: Record<Language, Record<string, string>> = {
  'en': enTranslations,
  'pt-BR': ptBRTranslations,
  'es': esTranslations,
  'zh': zhTranslations,
  'ja': jaTranslations,
  'de': deTranslations,
  'fr': frTranslations,
  'it': itTranslations,
  'ru': ruTranslations,
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
      if (browserLang.startsWith('de')) return 'de';
      if (browserLang.startsWith('fr')) return 'fr';
      if (browserLang.startsWith('it')) return 'it';
      if (browserLang.startsWith('ru')) return 'ru';
    } catch (e) {
      // Fails in environments where localStorage or navigator is not available
    }

    return defaultLanguage;
  });
  
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

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('metaTitle');

    const updateMetaTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateMetaTag('description', t('metaDescription'));
    updateOgTag('og:title', t('ogTitle'));
    updateOgTag('og:description', t('ogDescription'));
  }, [language, t]);

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
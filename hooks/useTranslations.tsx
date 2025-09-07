import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type Language = 'en' | 'pt-BR';

interface TranslationsContextType {
  language: string;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const TranslationsContext = createContext<TranslationsContextType | undefined>(undefined);

const availableLanguages: Language[] = ['en', 'pt-BR'];
const defaultLanguage: Language = 'pt-BR';

export const TranslationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    try {
      const savedLang = localStorage.getItem('language');
      return savedLang && availableLanguages.includes(savedLang as Language) ? savedLang : defaultLanguage;
    } catch (e) {
      return defaultLanguage;
    }
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
            console.error(`Could not load translations for ${language}, falling back to 'en'.`);
            const fallbackResponse = await fetch(`/locales/en.json`);
            const data = await fallbackResponse.json();
            setTranslations(data);
            return;
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Attempt to load English as a last resort
        try {
            const fallbackResponse = await fetch(`/locales/en.json`);
            const data = await fallbackResponse.json();
            setTranslations(data);
        } catch (fallbackError) {
             console.error('Failed to load fallback English translations:', fallbackError);
        }
      }
    };

    loadTranslations();
  }, [language]);

  const setLanguage = (lang: Language) => {
    try {
        localStorage.setItem('language', lang);
    } catch (e) {
        console.error('Could not save language to localStorage');
    }
    setLanguageState(lang);
  };

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

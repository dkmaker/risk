/**
 * useTranslation - Custom hook for internationalization
 * Provides reactive interface to translation system with language switching
 */

import { useEffect, useState } from "preact/hooks";
import { storageService } from "../services/StorageService";
import {
  type Language,
  type TranslationKeys,
  isLanguageSupported,
  translations,
} from "../translations/translations";

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<Language>(getCurrentLanguageStandalone());

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = storageService.loadLanguage();
    if (savedLanguage && isLanguageSupported(savedLanguage) && savedLanguage !== currentLang) {
      changeLanguage(savedLanguage as Language);
    }
  }, [currentLang]);

  /**
   * Change language and persist to storage
   */
  const changeLanguage = (newLanguage: Language): void => {
    setLanguageStandalone(newLanguage);
    setCurrentLang(newLanguage);
    storageService.saveLanguage(newLanguage);
  };

  /**
   * Get available languages
   */
  const getAvailableLanguages = () => {
    return [
      { code: "en", name: "English", nativeName: "English" },
      { code: "da", name: "Danish", nativeName: "Dansk" },
    ];
  };

  /**
   * Get language display name
   */
  const getLanguageName = (langCode: string): string => {
    const languages = getAvailableLanguages();
    return languages.find((lang) => lang.code === langCode)?.name || langCode;
  };

  /**
   * Get native language name
   */
  const getNativeLanguageName = (langCode: string): string => {
    const languages = getAvailableLanguages();
    return languages.find((lang) => lang.code === langCode)?.nativeName || langCode;
  };

  /**
   * Check if a language is supported
   */
  const isLanguageSupported = (langCode: string): boolean => {
    const languages = getAvailableLanguages();
    return languages.some((lang) => lang.code === langCode);
  };

  /**
   * Get browser language preference
   */
  const getBrowserLanguage = (): string => {
    const browserLang = navigator.language.split("-")[0];
    return browserLang && isLanguageSupported(browserLang) ? browserLang : "en";
  };

  /**
   * Translate a key using current language
   */
  const t = (key: keyof TranslationKeys): string => {
    const translation = translations[currentLang][key];
    return translation || key;
  };

  /**
   * Translate with pluralization support
   */
  const translatePlural = (key: keyof TranslationKeys, count: number): string => {
    const translation = t(key);

    // Simple pluralization - if count is not 1, try to add 's'
    if (count !== 1 && translation) {
      return `${translation}s`;
    }

    return translation;
  };

  /**
   * Translate with interpolation
   */
  const translateWithValues = (
    key: keyof TranslationKeys,
    values: Record<string, string | number>
  ): string => {
    let translation = t(key);

    for (const [placeholder, value] of Object.entries(values)) {
      translation = translation.replace(`{{${placeholder}}}`, String(value));
    }

    return translation;
  };

  return {
    // State
    currentLanguage: currentLang,

    // Actions
    changeLanguage,
    t,
    translatePlural,
    translateWithValues,

    // Utilities
    getAvailableLanguages,
    getLanguageName,
    getNativeLanguageName,
    isLanguageSupported,
    getBrowserLanguage,

    // Computed
    isEnglish: currentLang === "en",
    isDanish: currentLang === "da",
  };
}

// Export standalone functions for compatibility
export const getCurrentLanguageStandalone = (): Language => {
  const stored = localStorage.getItem("risk-dice-language");
  return stored && isLanguageSupported(stored) ? stored : "en";
};

export const setLanguageStandalone = (lang: Language) => {
  localStorage.setItem("risk-dice-language", lang);
};

export const tStandalone = (key: keyof TranslationKeys): string => {
  const currentLang = getCurrentLanguageStandalone();
  const translation = translations[currentLang][key];
  return translation || key;
};

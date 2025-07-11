/**
 * useTranslation - Custom hook for internationalization
 * Provides reactive interface to translation system with language switching
 */

import { useEffect, useState } from "preact/hooks";
import { storageService } from "../services/StorageService";
import { getCurrentLanguage, setLanguage, t } from "../translations";

export function useTranslation() {
  const [currentLang, setCurrentLang] = useState<string>(getCurrentLanguage());

  // Load saved language on mount
  useEffect(() => {
    const savedLanguage = storageService.loadLanguage();
    if (savedLanguage && savedLanguage !== currentLang) {
      changeLanguage(savedLanguage);
    }
  }, []);

  /**
   * Change language and persist to storage
   */
  const changeLanguage = (newLanguage: string): void => {
    setLanguage(newLanguage);
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
    return isLanguageSupported(browserLang!) ? browserLang! : "en";
  };

  /**
   * Translate with pluralization support
   */
  const translatePlural = (key: string, count: number): string => {
    const pluralKey = count === 1 ? key : `${key}Plural`;
    const translation = t(pluralKey);

    // If plural key doesn't exist, fallback to adding 's'
    if (translation === pluralKey && count !== 1) {
      return `${t(key)}s`;
    }

    return translation;
  };

  /**
   * Translate with interpolation
   */
  const translateWithValues = (key: string, values: Record<string, string | number>): string => {
    let translation = t(key);

    Object.entries(values).forEach(([placeholder, value]) => {
      translation = translation.replace(`{{${placeholder}}}`, String(value));
    });

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

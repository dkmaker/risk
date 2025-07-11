/**
 * TypeScript wrapper for translations.js
 */

// Import the existing JavaScript module
// @ts-ignore - Temporary ignore for legacy JS module
import {
  getCurrentLanguage as getCurrentLang,
  setLanguage as setLang,
  t as translateFn,
} from "./translations.js";

export const t = translateFn as (key: string) => string;
export const getCurrentLanguage = getCurrentLang as () => string;
export const setLanguage = setLang as (lang: string) => void;

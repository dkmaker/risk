/**
 * Translation system exports
 */

export * from "./translations";
export {
  tStandalone as t,
  getCurrentLanguageStandalone as getCurrentLanguage,
  setLanguageStandalone as setLanguage,
} from "../hooks/useTranslation";

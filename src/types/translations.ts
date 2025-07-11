/**
 * Translation system types for Risk Dice Battle
 *
 * This file defines types for the internationalization (i18n) system,
 * including translation keys, locale data, and translation utilities.
 */

import type { Language } from "./game";

/**
 * Translation namespace type for organizing translation keys
 */
export type TranslationNamespace =
  | "common"
  | "game"
  | "ui"
  | "errors"
  | "validation"
  | "settings"
  | "battle"
  | "player";

/**
 * Translation key paths for type-safe translations
 */
export type TranslationKeyPath =
  // App and common
  | "appTitle"
  | "common.loading"
  | "common.error"
  | "common.success"
  | "common.cancel"
  | "common.confirm"
  | "common.close"
  | "common.save"
  | "common.delete"
  | "common.edit"
  | "common.back"
  | "common.next"
  | "common.previous"
  | "common.yes"
  | "common.no"

  // Player setup
  | "player.setupTitle"
  | "player.setupSubtitle"
  | "player.redPlayer"
  | "player.bluePlayer"
  | "player.greenPlayer"
  | "player.yellowPlayer"
  | "player.blackPlayer"
  | "player.purplePlayer"
  | "player.saveAndStart"
  | "player.enterName"
  | "player.playerName"

  // Settings
  | "settings.title"
  | "settings.language"
  | "settings.players"
  | "settings.sound"
  | "settings.animations"
  | "settings.backToGame"
  | "settings.editPlayers"
  | "settings.soundEnabled"
  | "settings.soundDisabled"
  | "settings.animationSpeed"
  | "settings.animationSlow"
  | "settings.animationNormal"
  | "settings.animationFast"

  // Battle screens
  | "battle.whoIsAttacking"
  | "battle.whoIsDefending"
  | "battle.numberOfArmiesAttack"
  | "battle.numberOfArmiesDefend"
  | "battle.title"
  | "battle.rollDice"
  | "battle.withdraw"
  | "battle.newBattle"
  | "battle.clickToStart"
  | "battle.victory"
  | "battle.battleOver"
  | "battle.hasConquered"
  | "battle.noMoreArmies"
  | "battle.winsThisRound"
  | "battle.loses"
  | "battle.army"
  | "battle.armies"
  | "battle.bothLoseArmies"
  | "battle.attacker"
  | "battle.defender"
  | "battle.round"
  | "battle.result"
  | "battle.statistics"
  | "battle.history"

  // UI elements
  | "ui.menu"
  | "ui.home"
  | "ui.settings"
  | "ui.help"
  | "ui.about"
  | "ui.version"
  | "ui.loading"
  | "ui.error"
  | "ui.retry"
  | "ui.offline"
  | "ui.online"
  | "ui.install"
  | "ui.update"
  | "ui.fullscreen"
  | "ui.exitFullscreen"

  // Validation messages
  | "validation.required"
  | "validation.minLength"
  | "validation.maxLength"
  | "validation.invalidEmail"
  | "validation.invalidNumber"
  | "validation.tooSmall"
  | "validation.tooLarge"
  | "validation.invalidFormat"
  | "validation.enterAtLeastTwoPlayers"
  | "validation.selectNumberOfArmies"
  | "validation.attackerMustHaveArmy"
  | "validation.defenderMustHaveArmy"
  | "validation.playerNameTooLong"
  | "validation.playerNameTooShort"
  | "validation.duplicatePlayerNames"

  // Error messages
  | "errors.generic"
  | "errors.networkError"
  | "errors.storageError"
  | "errors.gameStateError"
  | "errors.invalidPlayer"
  | "errors.invalidGameState"
  | "errors.battleError"
  | "errors.diceRollError"
  | "errors.saveError"
  | "errors.loadError"
  | "errors.unexpectedError"
  | "errors.serviceUnavailable"
  | "errors.timeout"
  | "errors.permissionDenied"
  | "errors.notFound"
  | "errors.conflict"

  // Confirmation messages
  | "confirm.leaveGame"
  | "confirm.withdraw"
  | "confirm.resetGame"
  | "confirm.deletePlayer"
  | "confirm.clearHistory"
  | "confirm.resetSettings"
  | "confirm.installApp"
  | "confirm.updateApp"
  | "confirm.exitFullscreen"

  // Language names
  | "languages.english"
  | "languages.danish"
  | "languages.spanish"
  | "languages.french"
  | "languages.german"
  | "languages.italian"
  | "languages.portuguese"
  | "languages.dutch"
  | "languages.swedish"
  | "languages.norwegian"
  | "languages.finnish"
  | "languages.polish"
  | "languages.russian"
  | "languages.japanese"
  | "languages.chinese"
  | "languages.korean"
  | "languages.arabic"
  | "languages.hindi"
  | "languages.turkish"
  | "languages.greek";

/**
 * Translation value type - can be string or function for pluralization
 */
export type TranslationValue =
  | string
  | ((count: number, params?: TranslationParams) => string)
  | {
      zero?: string;
      one?: string;
      two?: string;
      few?: string;
      many?: string;
      other: string;
    };

/**
 * Translation parameters for interpolation
 */
export type TranslationParams = Record<string, string | number | boolean>;

/**
 * Translation function type
 */
export type TranslationFunction = (
  key: TranslationKeyPath,
  params?: TranslationParams,
  count?: number
) => string;

/**
 * Translation hook return type
 */
export type TranslationHook = {
  /** Translation function */
  t: TranslationFunction;
  /** Current language */
  language: Language;
  /** Available languages */
  languages: Language[];
  /** Change language */
  changeLanguage: (language: Language) => void;
  /** Check if language is loading */
  isLoading: boolean;
  /** Translation error */
  error: string | null;
};

/**
 * Translation bundle structure
 */
export interface TranslationBundle {
  /** Language code */
  language: Language;
  /** Translation namespace */
  namespace: TranslationNamespace;
  /** Translation data */
  data: Record<string, TranslationValue>;
  /** Bundle version */
  version: string;
  /** Last updated timestamp */
  lastUpdated: number;
  /** Bundle metadata */
  metadata: TranslationMetadata;
}

/**
 * Translation metadata
 */
export interface TranslationMetadata {
  /** Language name in native script */
  nativeName: string;
  /** Language name in English */
  englishName: string;
  /** Language direction (left-to-right or right-to-left) */
  direction: "ltr" | "rtl";
  /** Language region/country */
  region?: string;
  /** Language script */
  script?: string;
  /** Translator credits */
  translators?: string[];
  /** Translation completeness percentage */
  completeness?: number;
  /** Last review date */
  lastReview?: string;
}

/**
 * Translation loader interface
 */
export interface TranslationLoader {
  /** Load translation bundle */
  load(language: Language, namespace: TranslationNamespace): Promise<TranslationBundle>;
  /** Load all namespaces for a language */
  loadAll(language: Language): Promise<TranslationBundle[]>;
  /** Check if bundle is cached */
  isCached(language: Language, namespace: TranslationNamespace): boolean;
  /** Clear cache */
  clearCache(): void;
  /** Get cache size */
  getCacheSize(): number;
}

/**
 * Translation interpolator interface
 */
export interface TranslationInterpolator {
  /** Interpolate translation with parameters */
  interpolate(template: string, params: TranslationParams): string;
  /** Register custom interpolation function */
  registerFunction(name: string, fn: (value: unknown) => string): void;
  /** Get available functions */
  getFunctions(): string[];
}

/**
 * Translation validator interface
 */
export interface TranslationValidator {
  /** Validate translation bundle */
  validate(bundle: TranslationBundle): TranslationValidationResult;
  /** Validate translation key */
  validateKey(key: string): boolean;
  /** Validate translation value */
  validateValue(value: TranslationValue): boolean;
  /** Get validation rules */
  getRules(): TranslationValidationRule[];
}

/**
 * Translation validation result
 */
export interface TranslationValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Validation errors */
  errors: TranslationValidationError[];
  /** Validation warnings */
  warnings: TranslationValidationWarning[];
  /** Validation statistics */
  stats: TranslationValidationStats;
}

/**
 * Translation validation error
 */
export interface TranslationValidationError {
  /** Error type */
  type: "missing-key" | "invalid-value" | "invalid-format" | "duplicate-key";
  /** Error message */
  message: string;
  /** Translation key */
  key: string;
  /** Error location */
  location?: string;
  /** Suggested fix */
  suggestion?: string;
}

/**
 * Translation validation warning
 */
export interface TranslationValidationWarning {
  /** Warning type */
  type: "unused-key" | "long-translation" | "inconsistent-style" | "missing-plural";
  /** Warning message */
  message: string;
  /** Translation key */
  key: string;
  /** Warning location */
  location?: string;
  /** Suggested improvement */
  suggestion?: string;
}

/**
 * Translation validation statistics
 */
export interface TranslationValidationStats {
  /** Total number of keys */
  totalKeys: number;
  /** Number of valid keys */
  validKeys: number;
  /** Number of invalid keys */
  invalidKeys: number;
  /** Number of missing keys */
  missingKeys: number;
  /** Number of unused keys */
  unusedKeys: number;
  /** Translation completeness percentage */
  completeness: number;
}

/**
 * Translation validation rule
 */
export interface TranslationValidationRule {
  /** Rule name */
  name: string;
  /** Rule description */
  description: string;
  /** Rule severity */
  severity: "error" | "warning" | "info";
  /** Rule validator function */
  validator: (key: string, value: TranslationValue) => boolean;
  /** Rule fixer function */
  fixer?: (key: string, value: TranslationValue) => TranslationValue;
}

/**
 * Translation formatter interface
 */
export interface TranslationFormatter {
  /** Format number */
  formatNumber(value: number, options?: Intl.NumberFormatOptions): string;
  /** Format date */
  formatDate(value: Date, options?: Intl.DateTimeFormatOptions): string;
  /** Format time */
  formatTime(value: Date, options?: Intl.DateTimeFormatOptions): string;
  /** Format currency */
  formatCurrency(value: number, currency: string, options?: Intl.NumberFormatOptions): string;
  /** Format percentage */
  formatPercentage(value: number, options?: Intl.NumberFormatOptions): string;
  /** Format relative time */
  formatRelativeTime(value: number, unit: Intl.RelativeTimeFormatUnit): string;
  /** Format list */
  formatList(values: string[], options?: { style?: string; type?: string }): string;
}

/**
 * Translation pluralization interface
 */
export interface TranslationPluralizer {
  /** Get plural rule for count */
  getRule(count: number): "zero" | "one" | "two" | "few" | "many" | "other";
  /** Pluralize translation */
  pluralize(value: TranslationValue, count: number): string;
  /** Register custom plural rule */
  registerRule(language: Language, rule: (count: number) => string): void;
}

/**
 * Translation context interface
 */
export interface TranslationContext {
  /** Current language */
  language: Language;
  /** Fallback language */
  fallbackLanguage: Language;
  /** Translation loader */
  loader: TranslationLoader;
  /** Translation interpolator */
  interpolator: TranslationInterpolator;
  /** Translation formatter */
  formatter: TranslationFormatter;
  /** Translation pluralizer */
  pluralizer: TranslationPluralizer;
  /** Translation validator */
  validator: TranslationValidator;
  /** Translation cache */
  cache: Map<string, TranslationBundle>;
  /** Translation options */
  options: TranslationOptions;
}

/**
 * Translation options
 */
export interface TranslationOptions {
  /** Whether to use lazy loading */
  lazy: boolean;
  /** Whether to cache translations */
  cache: boolean;
  /** Cache TTL in milliseconds */
  cacheTTL: number;
  /** Whether to validate translations */
  validate: boolean;
  /** Whether to log missing translations */
  logMissing: boolean;
  /** Whether to show keys for missing translations */
  showKeys: boolean;
  /** Interpolation delimiter */
  delimiter: string;
  /** Namespace separator */
  namespaceSeparator: string;
  /** Key separator */
  keySeparator: string;
  /** Plural separator */
  pluralSeparator: string;
  /** Context separator */
  contextSeparator: string;
}

/**
 * Translation event types
 */
export type TranslationEventType =
  | "language-changed"
  | "bundle-loaded"
  | "bundle-error"
  | "missing-translation"
  | "validation-error"
  | "cache-cleared";

/**
 * Translation event data
 */
export interface TranslationEventData {
  /** Event type */
  type: TranslationEventType;
  /** Event timestamp */
  timestamp: number;
  /** Event data */
  data: unknown;
  /** Event source */
  source?: string;
}

/**
 * Translation event handler
 */
export type TranslationEventHandler = (event: TranslationEventData) => void;

/**
 * Translation provider interface
 */
export interface TranslationProvider {
  /** Initialize provider */
  initialize(options: TranslationOptions): Promise<void>;
  /** Get translation */
  getTranslation(key: TranslationKeyPath, params?: TranslationParams, count?: number): string;
  /** Change language */
  changeLanguage(language: Language): Promise<void>;
  /** Add translation bundle */
  addBundle(bundle: TranslationBundle): void;
  /** Remove translation bundle */
  removeBundle(language: Language, namespace: TranslationNamespace): void;
  /** Add event listener */
  addEventListener(type: TranslationEventType, handler: TranslationEventHandler): void;
  /** Remove event listener */
  removeEventListener(type: TranslationEventType, handler: TranslationEventHandler): void;
  /** Dispose provider */
  dispose(): void;
}

/**
 * Default translation options
 */
export const DEFAULT_TRANSLATION_OPTIONS: TranslationOptions = {
  lazy: true,
  cache: true,
  cacheTTL: 3600000, // 1 hour
  validate: false,
  logMissing: true,
  showKeys: false,
  delimiter: "{{}}",
  namespaceSeparator: ":",
  keySeparator: ".",
  pluralSeparator: "_",
  contextSeparator: "_",
} as const;

/**
 * Supported languages configuration
 */
export const SUPPORTED_LANGUAGES: Record<Language, TranslationMetadata> = {
  en: {
    nativeName: "English",
    englishName: "English",
    direction: "ltr",
    region: "US",
    script: "Latn",
  },
  da: {
    nativeName: "Dansk",
    englishName: "Danish",
    direction: "ltr",
    region: "DK",
    script: "Latn",
  },
} as const;

/**
 * Translation key extraction utility type
 */
export type ExtractTranslationKeys<T> = T extends Record<string, infer U>
  ? U extends string
    ? keyof T
    : U extends Record<string, unknown>
      ? `${keyof T & string}.${ExtractTranslationKeys<U> & string}`
      : never
  : never;

/**
 * Translation value extraction utility type
 */
export type ExtractTranslationValue<T, K extends string> = K extends keyof T
  ? T[K]
  : K extends `${infer P}.${infer S}`
    ? P extends keyof T
      ? T[P] extends Record<string, unknown>
        ? ExtractTranslationValue<T[P], S>
        : never
      : never
    : never;

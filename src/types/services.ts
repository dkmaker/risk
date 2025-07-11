/**
 * Service layer type definitions for Risk Dice Battle
 *
 * This file defines interfaces and types for the service layer,
 * including GameService, DiceService, StorageService, and TranslationService.
 */

import type {
  BattleConfig,
  // BattlePlayer, // Will be used in Phase 3
  BattleResult,
  DiceRoll,
  GameSettings,
  GameState,
  Language,
  Player,
  ValidationResult,
} from "./game";

/**
 * Base service interface that all services should implement
 */
export interface BaseService {
  /** Service name for identification */
  readonly name: string;
  /** Initialize the service */
  initialize(): Promise<void> | void;
  /** Cleanup the service */
  cleanup(): Promise<void> | void;
}

/**
 * Storage service interface for managing persistent data
 */
export interface StorageService extends BaseService {
  /** Get item from storage */
  getItem<T>(key: string): T | null;
  /** Set item in storage */
  setItem<T>(key: string, value: T): void;
  /** Remove item from storage */
  removeItem(key: string): void;
  /** Clear all storage */
  clear(): void;
  /** Check if key exists */
  hasKey(key: string): boolean;
  /** Get all keys */
  getAllKeys(): string[];
  /** Get storage size in bytes */
  getSize(): number;
  /** Storage event callback */
  onStorageChange?: (key: string, newValue: any, oldValue: any) => void;
}

/**
 * Storage key constants
 */
export const STORAGE_KEYS = {
  PLAYERS: "riskDicePlayers",
  GAME_STATE: "riskDiceGameState",
  SETTINGS: "riskDiceSettings",
  LANGUAGE: "selectedLanguage",
  BATTLE_HISTORY: "riskDiceBattleHistory",
} as const;

/**
 * Translation service interface for i18n support
 */
export interface TranslationService extends BaseService {
  /** Get current language */
  getCurrentLanguage(): Language;
  /** Set current language */
  setLanguage(language: Language): void;
  /** Get available languages */
  getAvailableLanguages(): Language[];
  /** Translate a key */
  translate(key: string, params?: Record<string, string | number>): string;
  /** Check if translation exists */
  hasTranslation(key: string): boolean;
  /** Load translations for a language */
  loadTranslations(language: Language): Promise<void>;
  /** Translation change callback */
  onLanguageChange?: (language: Language) => void;
}

/**
 * Translation key type for type safety
 */
export type TranslationKey =
  | "appTitle"
  | "playerSetupTitle"
  | "playerSetupSubtitle"
  | "redPlayer"
  | "bluePlayer"
  | "greenPlayer"
  | "yellowPlayer"
  | "blackPlayer"
  | "purplePlayer"
  | "saveAndStart"
  | "settingsTitle"
  | "languageLabel"
  | "playersLabel"
  | "backToGame"
  | "whoIsAttacking"
  | "whoIsDefending"
  | "numberOfArmiesAttack"
  | "numberOfArmiesDefend"
  | "battle"
  | "rollDice"
  | "withdraw"
  | "newBattle"
  | "clickToStartBattle"
  | "victory"
  | "battleOver"
  | "hasConquered"
  | "noMoreArmies"
  | "winsThisRound"
  | "loses"
  | "army"
  | "armies"
  | "bothLoseArmies"
  | "attacker"
  | "defender"
  | "enterAtLeastTwoPlayers"
  | "selectNumberOfArmies"
  | "attackerMustHaveArmy"
  | "defenderMustHaveArmy"
  | "confirmLeaveGame"
  | "confirmWithdraw"
  | "englishLanguage"
  | "danishLanguage";

/**
 * Dice service interface for dice rolling mechanics
 */
export interface DiceService extends BaseService {
  /** Roll dice for a player */
  rollDice(count: number, type: "attacker" | "defender"): DiceRoll;
  /** Calculate battle result */
  calculateBattleResult(attackerRoll: DiceRoll, defenderRoll: DiceRoll): BattleResult;
  /** Get maximum dice count for attacker */
  getMaxAttackerDice(armies: number): number;
  /** Get maximum dice count for defender */
  getMaxDefenderDice(armies: number): number;
  /** Validate dice roll */
  validateDiceRoll(roll: DiceRoll): ValidationResult;
  /** Get dice roll statistics */
  getDiceStats(rolls: DiceRoll[]): DiceStatistics;
}

/**
 * Dice statistics interface
 */
export interface DiceStatistics {
  /** Total number of rolls */
  totalRolls: number;
  /** Average roll value */
  averageRoll: number;
  /** Highest roll */
  highestRoll: number;
  /** Lowest roll */
  lowestRoll: number;
  /** Roll frequency distribution */
  frequency: Record<number, number>;
  /** Win percentage */
  winPercentage: number;
}

/**
 * Game service interface for core game logic
 */
export interface GameService extends BaseService {
  /** Get current game state */
  getGameState(): GameState;
  /** Set game state */
  setGameState(state: GameState): void;
  /** Start new game */
  startNewGame(players: Player[]): void;
  /** Select attacker */
  selectAttacker(playerIndex: number): void;
  /** Select defender */
  selectDefender(playerIndex: number): void;
  /** Set attacker armies */
  setAttackerArmies(armies: number): void;
  /** Set defender armies */
  setDefenderArmies(armies: number): void;
  /** Execute battle */
  executeBattle(): BattleResult;
  /** Check if battle is finished */
  isBattleFinished(): boolean;
  /** Get battle winner */
  getBattleWinner(): "attacker" | "defender" | null;
  /** Reset game */
  resetGame(): void;
  /** Validate game state */
  validateGameState(state: GameState): ValidationResult;
  /** Game state change callback */
  onGameStateChange?: (state: GameState) => void;
}

/**
 * Audio service interface for sound effects
 */
export interface AudioService extends BaseService {
  /** Play sound effect */
  playSound(soundId: string): Promise<void>;
  /** Set volume */
  setVolume(volume: number): void;
  /** Get volume */
  getVolume(): number;
  /** Mute/unmute */
  setMuted(muted: boolean): void;
  /** Check if muted */
  isMuted(): boolean;
  /** Load sound */
  loadSound(soundId: string, url: string): Promise<void>;
  /** Preload all sounds */
  preloadSounds(): Promise<void>;
}

/**
 * Sound effect IDs
 */
export const SOUND_IDS = {
  DICE_ROLL: "diceRoll",
  BATTLE_WIN: "battleWin",
  BATTLE_LOSE: "battleLose",
  BUTTON_CLICK: "buttonClick",
  ARMY_SELECT: "armySelect",
  SCREEN_TRANSITION: "screenTransition",
} as const;

/**
 * Analytics service interface for tracking events
 */
export interface AnalyticsService extends BaseService {
  /** Track event */
  trackEvent(eventName: string, properties?: Record<string, any>): void;
  /** Track screen view */
  trackScreenView(screenName: string): void;
  /** Track battle result */
  trackBattleResult(result: BattleResult): void;
  /** Track player count */
  trackPlayerCount(count: number): void;
  /** Track language change */
  trackLanguageChange(language: Language): void;
  /** Set user properties */
  setUserProperties(properties: Record<string, any>): void;
}

/**
 * PWA service interface for Progressive Web App features
 */
export interface PWAService extends BaseService {
  /** Check if app is installed */
  isInstalled(): boolean;
  /** Prompt for installation */
  promptInstallation(): Promise<boolean>;
  /** Check if offline */
  isOffline(): boolean;
  /** Register service worker */
  registerServiceWorker(): Promise<void>;
  /** Update service worker */
  updateServiceWorker(): Promise<void>;
  /** Installation state change callback */
  onInstallationStateChange?: (installed: boolean) => void;
  /** Online state change callback */
  onOnlineStateChange?: (online: boolean) => void;
}

/**
 * Notification service interface for user notifications
 */
export interface NotificationService extends BaseService {
  /** Show notification */
  showNotification(message: string, type?: "info" | "success" | "warning" | "error"): void;
  /** Show confirmation dialog */
  showConfirmation(message: string, title?: string): Promise<boolean>;
  /** Show loading indicator */
  showLoading(message?: string): void;
  /** Hide loading indicator */
  hideLoading(): void;
  /** Check if notifications are supported */
  isSupported(): boolean;
  /** Request notification permission */
  requestPermission(): Promise<boolean>;
}

/**
 * Performance service interface for monitoring performance
 */
export interface PerformanceService extends BaseService {
  /** Start performance measurement */
  startMeasurement(name: string): void;
  /** End performance measurement */
  endMeasurement(name: string): number;
  /** Get performance metrics */
  getMetrics(): PerformanceMetrics;
  /** Track frame rate */
  trackFrameRate(): void;
  /** Get average frame rate */
  getAverageFrameRate(): number;
}

/**
 * Performance metrics interface
 */
export interface PerformanceMetrics {
  /** Page load time */
  loadTime: number;
  /** First contentful paint */
  firstContentfulPaint: number;
  /** Time to interactive */
  timeToInteractive: number;
  /** Bundle size */
  bundleSize: number;
  /** Memory usage */
  memoryUsage: number;
  /** Average frame rate */
  frameRate: number;
}

/**
 * Service container interface for dependency injection
 */
export interface ServiceContainer {
  /** Register a service */
  register<T extends BaseService>(token: string, service: T): void;
  /** Get a service */
  get<T extends BaseService>(token: string): T;
  /** Check if service is registered */
  has(token: string): boolean;
  /** Initialize all services */
  initializeAll(): Promise<void>;
  /** Cleanup all services */
  cleanupAll(): Promise<void>;
}

/**
 * Service tokens for dependency injection
 */
export const SERVICE_TOKENS = {
  STORAGE: "storage",
  TRANSLATION: "translation",
  DICE: "dice",
  GAME: "game",
  AUDIO: "audio",
  ANALYTICS: "analytics",
  PWA: "pwa",
  NOTIFICATION: "notification",
  PERFORMANCE: "performance",
} as const;

/**
 * Service configuration interface
 */
export interface ServiceConfig {
  /** Service name */
  name: string;
  /** Service enabled */
  enabled: boolean;
  /** Service configuration options */
  options?: Record<string, any>;
}

/**
 * Application configuration interface
 */
export interface AppConfig {
  /** Application version */
  version: string;
  /** Environment */
  environment: "development" | "production" | "test";
  /** Service configurations */
  services: Record<string, ServiceConfig>;
  /** Battle configuration */
  battle: BattleConfig;
  /** Game settings */
  gameSettings: GameSettings;
  /** Debug mode */
  debug: boolean;
}

/**
 * Service factory interface
 */
export interface ServiceFactory {
  /** Create service instance */
  createService<T extends BaseService>(token: string, config: ServiceConfig): T;
  /** Get service dependencies */
  getDependencies(token: string): string[];
}

/**
 * Service lifecycle events
 */
export type ServiceLifecycleEvent = "initializing" | "initialized" | "error" | "cleanup";

/**
 * Service lifecycle callback
 */
export type ServiceLifecycleCallback = (
  event: ServiceLifecycleEvent,
  serviceName: string,
  error?: Error
) => void;

/**
 * Service manager interface
 */
export interface ServiceManager {
  /** Service container */
  container: ServiceContainer;
  /** Service factory */
  factory: ServiceFactory;
  /** Register lifecycle callback */
  onLifecycleEvent(callback: ServiceLifecycleCallback): void;
  /** Start all services */
  start(): Promise<void>;
  /** Stop all services */
  stop(): Promise<void>;
  /** Restart service */
  restart(token: string): Promise<void>;
  /** Get service health */
  getHealth(token: string): "healthy" | "unhealthy" | "unknown";
}

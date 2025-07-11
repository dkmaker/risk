/**
 * Error handling and validation types for Risk Dice Battle
 *
 * This file defines comprehensive error types, validation interfaces,
 * and exception handling utilities for robust error management.
 */

import type { TranslationKeys } from "../translations/translations";
import type { BattlePlayer, BattleResult, DiceRoll, GameState, Player } from "./game";

type TranslationKeyPath = keyof TranslationKeys;

/**
 * Type definitions for replacing any types
 */
export interface ErrorContextData {
  /** Component or module where error occurred */
  component?: string;
  /** Function or method name */
  method?: string;
  /** Additional metadata */
  metadata?: Record<string, string | number | boolean>;
  /** User action that triggered the error */
  userAction?: string;
  /** Request ID or correlation ID */
  requestId?: string;
}

export interface BusinessContextData {
  /** Business entity ID */
  entityId?: string;
  /** Business operation type */
  operationType?: string;
  /** Business rule that was violated */
  violatedRule?: string;
  /** Related entities */
  relatedEntities?: string[];
  /** Business process step */
  processStep?: string;
}

export interface NetworkResponseData {
  /** Response headers */
  headers?: Record<string, string>;
  /** Response body */
  body?: string | object;
  /** Response status text */
  statusText?: string;
  /** Response size in bytes */
  size?: number;
  /** Response time in milliseconds */
  responseTime?: number;
}

export type StorageValue = string | number | boolean | object | null;

export interface TranslationParams {
  /** Named parameters for interpolation */
  [key: string]: string | number | boolean;
}

export interface ValidationTarget {
  /** Target type (form, object, etc.) */
  type: string;
  /** Target identifier */
  id?: string;
  /** Target data */
  data?: Record<string, unknown>;
  /** Target schema */
  schema?: string;
}

export interface PlayerHistoryEntry {
  /** Timestamp of the action */
  timestamp: number;
  /** Action type */
  action: string;
  /** Action details */
  details?: Record<string, unknown>;
  /** Previous state */
  previousState?: Record<string, unknown>;
  /** New state */
  newState?: Record<string, unknown>;
}

export interface ErrorInfo {
  /** Component stack trace */
  componentStack?: string;
  /** Error boundary name */
  errorBoundary?: string;
  /** Error boundary stack */
  errorBoundaryStack?: string;
  /** Props at time of error */
  props?: Record<string, unknown>;
  /** State at time of error */
  state?: Record<string, unknown>;
}

export interface ValidationOptions {
  /** Validation mode */
  mode?: "strict" | "loose";
  /** Skip validation for certain fields */
  skipFields?: string[];
  /** Custom validation messages */
  messages?: Record<string, string>;
  /** Validation timeout in milliseconds */
  timeout?: number;
}

export interface GameSettings {
  /** Game difficulty level */
  difficulty?: "easy" | "medium" | "hard";
  /** Sound enabled */
  soundEnabled?: boolean;
  /** Animation speed */
  animationSpeed?: "slow" | "normal" | "fast";
  /** Auto-save enabled */
  autoSave?: boolean;
  /** Language setting */
  language?: string;
}

export interface GameStatistics {
  /** Total games played */
  totalGames?: number;
  /** Games won */
  gamesWon?: number;
  /** Games lost */
  gamesLost?: number;
  /** Average battle duration */
  averageBattleDuration?: number;
  /** Total playtime */
  totalPlaytime?: number;
}

export interface PlayerState {
  /** Player is active */
  isActive?: boolean;
  /** Player is ready */
  isReady?: boolean;
  /** Player connection status */
  connectionStatus?: "connected" | "disconnected" | "reconnecting";
  /** Player preferences */
  preferences?: Record<string, unknown>;
}

export interface BattleSettings {
  /** Battle mode */
  mode?: "standard" | "quick" | "custom";
  /** Time limit per turn */
  turnTimeLimit?: number;
  /** Allow withdrawals */
  allowWithdrawals?: boolean;
  /** Show dice animations */
  showAnimations?: boolean;
}

export interface DiceConfiguration {
  /** Number of dice sides */
  sides?: number;
  /** Dice animation duration */
  animationDuration?: number;
  /** Dice color scheme */
  colorScheme?: string;
  /** Sound effects enabled */
  soundEffects?: boolean;
}

export interface DiceState {
  /** Current dice values */
  values?: number[];
  /** Dice are rolling */
  isRolling?: boolean;
  /** Roll count */
  rollCount?: number;
  /** Last roll timestamp */
  lastRoll?: number;
}

export interface AnimationState {
  /** Animation is playing */
  isPlaying?: boolean;
  /** Animation progress (0-1) */
  progress?: number;
  /** Animation duration */
  duration?: number;
  /** Animation easing */
  easing?: string;
}

export interface ServiceConfiguration {
  /** Service name */
  name?: string;
  /** Service version */
  version?: string;
  /** Service endpoints */
  endpoints?: string[];
  /** Service timeout */
  timeout?: number;
  /** Service retry count */
  retryCount?: number;
}

export interface ServiceState {
  /** Service status */
  status?: "starting" | "running" | "stopping" | "stopped" | "error";
  /** Service health */
  health?: "healthy" | "unhealthy" | "degraded";
  /** Service uptime */
  uptime?: number;
  /** Service metrics */
  metrics?: Record<string, number>;
}

export interface ComponentProps {
  /** Component properties */
  [key: string]: unknown;
}

export interface ComponentState {
  /** Component state properties */
  [key: string]: unknown;
}

export interface ComponentRefs {
  /** Component references */
  [key: string]: unknown;
}

export interface ComponentHandlers {
  /** Component event handlers */
  [key: string]: (...args: unknown[]) => void;
}

export interface WarningContextData {
  /** Warning source */
  source?: string;
  /** Warning category */
  category?: string;
  /** Warning metadata */
  metadata?: Record<string, unknown>;
  /** Warning suggestions */
  suggestions?: string[];
}

export interface ValidationMetadataContext {
  /** Validation run ID */
  runId?: string;
  /** Validation environment */
  environment?: string;
  /** Validation configuration */
  configuration?: Record<string, unknown>;
  /** Validation dependencies */
  dependencies?: string[];
}

export interface ValidationRuleOptions {
  /** Rule is required */
  required?: boolean;
  /** Rule priority */
  priority?: number;
  /** Rule timeout */
  timeout?: number;
  /** Rule parameters */
  parameters?: Record<string, unknown>;
}

export interface ErrorReportingOptions {
  /** Reporting endpoint URL */
  endpoint?: string;
  /** API key for reporting */
  apiKey?: string;
  /** Batch size for reporting */
  batchSize?: number;
  /** Retry attempts */
  retryAttempts?: number;
  /** Include stack traces */
  includeStackTrace?: boolean;
  /** Include user context */
  includeUserContext?: boolean;
}

export interface ErrorBoundaryContext {
  /** Boundary name */
  boundaryName?: string;
  /** Parent boundary */
  parentBoundary?: string;
  /** Boundary level */
  level?: number;
  /** Fallback component */
  fallbackComponent?: string;
  /** Recovery strategies */
  recoveryStrategies?: string[];
}

/**
 * Base error interface that all errors should extend
 */
export interface BaseError {
  /** Error code for identification */
  code: string;
  /** Human-readable error message */
  message: string;
  /** Error timestamp */
  timestamp: number;
  /** Error severity level */
  severity: ErrorSeverity;
  /** Error context data */
  context?: ErrorContextData;
  /** Error stack trace */
  stack?: string;
  /** Error cause (nested error) */
  cause?: Error | BaseError;
}

/**
 * Error severity levels
 */
export type ErrorSeverity = "low" | "medium" | "high" | "critical";

/**
 * Error categories for classification
 */
export type ErrorCategory =
  | "validation"
  | "business-logic"
  | "system"
  | "network"
  | "storage"
  | "ui"
  | "game-state"
  | "player"
  | "battle"
  | "dice"
  | "translation"
  | "service"
  | "configuration"
  | "performance"
  | "security"
  | "unknown";

/**
 * Validation error interface
 */
export interface ValidationError extends BaseError {
  /** Field that failed validation */
  field: string;
  /** Validation rule that failed */
  rule: string;
  /** Expected value or constraint */
  expected: unknown;
  /** Actual value that failed */
  actual: unknown;
  /** Validation context */
  validationContext?: ValidationContext;
}

/**
 * Business logic error interface
 */
export interface BusinessLogicError extends BaseError {
  /** Business rule that was violated */
  rule: string;
  /** Entity involved in the error */
  entity: string;
  /** Business context */
  businessContext?: BusinessContextData;
}

/**
 * System error interface
 */
export interface SystemError extends BaseError {
  /** System component that failed */
  component: string;
  /** System error type */
  systemErrorType: SystemErrorType;
  /** System context */
  systemContext?: SystemContext;
}

/**
 * Network error interface
 */
export interface NetworkError extends BaseError {
  /** HTTP status code */
  statusCode?: number;
  /** Request URL */
  url?: string;
  /** Request method */
  method?: string;
  /** Response data */
  response?: NetworkResponseData;
  /** Network error type */
  networkErrorType: NetworkErrorType;
}

/**
 * Storage error interface
 */
export interface StorageError extends BaseError {
  /** Storage type */
  storageType: StorageType;
  /** Storage operation */
  operation: StorageOperation;
  /** Storage key */
  key?: string;
  /** Storage value */
  value?: StorageValue;
}

/**
 * Game state error interface
 */
export interface GameStateError extends BaseError {
  /** Current game state */
  currentState: Partial<GameState>;
  /** Expected state */
  expectedState?: Partial<GameState>;
  /** State transition that failed */
  transition?: string;
  /** Game context */
  gameContext?: GameContext;
}

/**
 * Player error interface
 */
export interface PlayerError extends BaseError {
  /** Player involved in the error */
  player?: Player | BattlePlayer;
  /** Player index */
  playerIndex?: number;
  /** Player operation */
  operation: PlayerOperation;
  /** Player context */
  playerContext?: PlayerContext;
}

/**
 * Battle error interface
 */
export interface BattleError extends BaseError {
  /** Battle context */
  battleContext: BattleContext;
  /** Battle phase */
  phase: string;
  /** Battle operation */
  operation: BattleOperation;
  /** Battle result if available */
  result?: BattleResult;
}

/**
 * Dice error interface
 */
export interface DiceError extends BaseError {
  /** Dice roll that failed */
  roll?: DiceRoll;
  /** Dice operation */
  operation: DiceOperation;
  /** Dice context */
  diceContext?: DiceContext;
}

/**
 * Translation error interface
 */
export interface TranslationError extends BaseError {
  /** Translation key */
  key: TranslationKeyPath;
  /** Language */
  language: string;
  /** Translation parameters */
  params?: TranslationParams;
  /** Translation operation */
  operation: TranslationOperation;
}

/**
 * Service error interface
 */
export interface ServiceError extends BaseError {
  /** Service name */
  serviceName: string;
  /** Service operation */
  operation: ServiceOperation;
  /** Service context */
  serviceContext?: ServiceContext;
}

/**
 * UI error interface
 */
export interface UIError extends BaseError {
  /** Component name */
  componentName: string;
  /** UI operation */
  operation: UIOperation;
  /** UI context */
  uiContext?: UIContext;
}

/**
 * System error types
 */
export type SystemErrorType =
  | "memory"
  | "cpu"
  | "storage-full"
  | "permission"
  | "timeout"
  | "configuration"
  | "dependency"
  | "initialization"
  | "cleanup"
  | "resource-exhausted";

/**
 * Network error types
 */
export type NetworkErrorType =
  | "connection-failed"
  | "timeout"
  | "dns-resolution"
  | "ssl-certificate"
  | "proxy"
  | "firewall"
  | "rate-limit"
  | "server-error"
  | "client-error"
  | "protocol-error";

/**
 * Storage types
 */
export type StorageType =
  | "localStorage"
  | "sessionStorage"
  | "indexedDB"
  | "cache"
  | "memory"
  | "file"
  | "database";

/**
 * Storage operations
 */
export type StorageOperation =
  | "read"
  | "write"
  | "delete"
  | "clear"
  | "initialize"
  | "migrate"
  | "backup"
  | "restore";

/**
 * Player operations
 */
export type PlayerOperation =
  | "create"
  | "update"
  | "delete"
  | "validate"
  | "select"
  | "deselect"
  | "set-armies"
  | "change-color"
  | "change-name";

/**
 * Battle operations
 */
export type BattleOperation =
  | "start"
  | "roll-dice"
  | "calculate-result"
  | "apply-losses"
  | "check-winner"
  | "end"
  | "withdraw"
  | "validate";

/**
 * Dice operations
 */
export type DiceOperation = "roll" | "validate" | "animate" | "compare" | "highlight" | "reset";

/**
 * Translation operations
 */
export type TranslationOperation =
  | "translate"
  | "load"
  | "validate"
  | "interpolate"
  | "pluralize"
  | "format"
  | "cache";

/**
 * Service operations
 */
export type ServiceOperation =
  | "initialize"
  | "start"
  | "stop"
  | "restart"
  | "configure"
  | "validate"
  | "cleanup"
  | "health-check";

/**
 * UI operations
 */
export type UIOperation =
  | "render"
  | "update"
  | "animate"
  | "handle-event"
  | "validate-input"
  | "focus"
  | "blur"
  | "scroll";

/**
 * Error context interfaces
 */
export interface ValidationContext {
  /** Field being validated */
  field: string;
  /** Validation rules applied */
  rules: string[];
  /** Validation options */
  options: ValidationOptions;
  /** Form or object being validated */
  target: ValidationTarget;
}

export interface SystemContext {
  /** System information */
  system: {
    platform: string;
    version: string;
    memory: number;
    cpu: number;
  };
  /** Browser information */
  browser: {
    name: string;
    version: string;
    userAgent: string;
  };
  /** Application information */
  app: {
    version: string;
    environment: string;
    buildTime: string;
  };
}

export interface GameContext {
  /** Game session ID */
  sessionId: string;
  /** Game phase */
  phase: string;
  /** Players in game */
  players: Player[];
  /** Game settings */
  settings: GameSettings;
  /** Game statistics */
  stats: GameStatistics;
}

export interface PlayerContext {
  /** Player data */
  player: Player | BattlePlayer;
  /** Player state */
  state: PlayerState;
  /** Player interactions */
  interactions: string[];
  /** Player history */
  history: PlayerHistoryEntry[];
}

export interface BattleContext {
  /** Battle ID */
  battleId: string;
  /** Attacker */
  attacker: BattlePlayer;
  /** Defender */
  defender: BattlePlayer;
  /** Battle history */
  history: BattleResult[];
  /** Battle settings */
  settings: BattleSettings;
}

export interface DiceContext {
  /** Dice configuration */
  config: DiceConfiguration;
  /** Dice state */
  state: DiceState;
  /** Animation state */
  animation: AnimationState;
}

export interface ServiceContext {
  /** Service configuration */
  config: ServiceConfiguration;
  /** Service state */
  state: ServiceState;
  /** Service dependencies */
  dependencies: string[];
  /** Service health */
  health: string;
}

export interface UIContext {
  /** Component props */
  props: ComponentProps;
  /** Component state */
  state: ComponentState;
  /** Component refs */
  refs: ComponentRefs;
  /** Component event handlers */
  handlers: ComponentHandlers;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation errors */
  errors: ValidationError[];
  /** Validation warnings */
  warnings: ValidationWarning[];
  /** Validation metadata */
  metadata?: ValidationMetadata;
}

/**
 * Validation warning interface
 */
export interface ValidationWarning {
  /** Warning code */
  code: string;
  /** Warning message */
  message: string;
  /** Field that triggered warning */
  field: string;
  /** Warning severity */
  severity: "low" | "medium" | "high";
  /** Warning context */
  context?: WarningContextData;
}

/**
 * Validation metadata interface
 */
export interface ValidationMetadata {
  /** Validation duration */
  duration: number;
  /** Validation timestamp */
  timestamp: number;
  /** Validation rules applied */
  rulesApplied: string[];
  /** Validation context */
  context: ValidationMetadataContext;
}

/**
 * Validation rule interface
 */
export interface ValidationRule<T = any> {
  /** Rule name */
  name: string;
  /** Rule description */
  description: string;
  /** Rule validator function */
  validator: (value: T, context?: ValidationContext) => boolean | Promise<boolean>;
  /** Error message template */
  errorMessage: string;
  /** Rule options */
  options?: ValidationRuleOptions;
  /** Rule dependencies */
  dependencies?: string[];
}

/**
 * Validator interface
 */
export interface Validator<T = any> {
  /** Validation rules */
  rules: ValidationRule<T>[];
  /** Validate value */
  validate(value: T, context?: ValidationContext): ValidationResult | Promise<ValidationResult>;
  /** Add validation rule */
  addRule(rule: ValidationRule<T>): void;
  /** Remove validation rule */
  removeRule(name: string): void;
  /** Get validation rule */
  getRule(name: string): ValidationRule<T> | undefined;
}

/**
 * Error handler interface
 */
export interface ErrorHandler {
  /** Handle error */
  handle(error: BaseError): void;
  /** Register error handler */
  register(errorType: string, handler: (error: BaseError) => void): void;
  /** Unregister error handler */
  unregister(errorType: string): void;
  /** Get error handlers */
  getHandlers(): Record<string, (error: BaseError) => void>;
}

/**
 * Error reporter interface
 */
export interface ErrorReporter {
  /** Report error */
  report(error: BaseError): void;
  /** Set reporting configuration */
  configure(config: ErrorReportingConfig): void;
  /** Get reporting statistics */
  getStats(): ErrorReportingStats;
}

/**
 * Error reporting configuration
 */
export interface ErrorReportingConfig {
  /** Whether to enable error reporting */
  enabled: boolean;
  /** Minimum severity level to report */
  minSeverity: ErrorSeverity;
  /** Error categories to report */
  categories: ErrorCategory[];
  /** Reporting endpoints */
  endpoints: string[];
  /** Reporting options */
  options: ErrorReportingOptions;
}

/**
 * Error reporting statistics
 */
export interface ErrorReportingStats {
  /** Total errors reported */
  totalErrors: number;
  /** Errors by severity */
  errorsBySeverity: Record<ErrorSeverity, number>;
  /** Errors by category */
  errorsByCategory: Record<ErrorCategory, number>;
  /** Errors by time period */
  errorsByTime: Record<string, number>;
  /** Most common errors */
  mostCommonErrors: Array<{ code: string; count: number }>;
}

/**
 * Error recovery interface
 */
export interface ErrorRecovery {
  /** Attempt to recover from error */
  recover(error: BaseError): boolean | Promise<boolean>;
  /** Register recovery strategy */
  registerStrategy(
    errorType: string,
    strategy: (error: BaseError) => boolean | Promise<boolean>
  ): void;
  /** Get recovery strategies */
  getStrategies(): Record<string, (error: BaseError) => boolean | Promise<boolean>>;
}

/**
 * Error boundary interface
 */
export interface ErrorBoundary {
  /** Catch error */
  catch(error: Error, errorInfo: ErrorInfo): void;
  /** Reset error state */
  reset(): void;
  /** Get error state */
  getState(): ErrorBoundaryState;
}

/**
 * Error boundary state
 */
export interface ErrorBoundaryState {
  /** Whether error boundary has caught an error */
  hasError: boolean;
  /** Error that was caught */
  error: Error | null;
  /** Error info */
  errorInfo: ErrorInfo;
  /** Error boundary context */
  context: ErrorBoundaryContext;
}

/**
 * Error factory interface
 */
export interface ErrorFactory {
  /** Create validation error */
  createValidationError(
    field: string,
    rule: string,
    message: string,
    context?: ValidationContext
  ): ValidationError;
  /** Create business logic error */
  createBusinessLogicError(
    rule: string,
    entity: string,
    message: string,
    context?: BusinessContextData
  ): BusinessLogicError;
  /** Create system error */
  createSystemError(
    component: string,
    type: SystemErrorType,
    message: string,
    context?: SystemContext
  ): SystemError;
  /** Create network error */
  createNetworkError(
    type: NetworkErrorType,
    message: string,
    statusCode?: number,
    url?: string
  ): NetworkError;
  /** Create storage error */
  createStorageError(
    type: StorageType,
    operation: StorageOperation,
    message: string,
    key?: string
  ): StorageError;
  /** Create game state error */
  createGameStateError(
    currentState: Partial<GameState>,
    message: string,
    context?: GameContext
  ): GameStateError;
  /** Create player error */
  createPlayerError(
    operation: PlayerOperation,
    message: string,
    player?: Player | BattlePlayer
  ): PlayerError;
  /** Create battle error */
  createBattleError(
    operation: BattleOperation,
    message: string,
    context: BattleContext
  ): BattleError;
  /** Create dice error */
  createDiceError(operation: DiceOperation, message: string, roll?: DiceRoll): DiceError;
  /** Create translation error */
  createTranslationError(
    key: TranslationKeyPath,
    language: string,
    message: string
  ): TranslationError;
  /** Create service error */
  createServiceError(
    serviceName: string,
    operation: ServiceOperation,
    message: string
  ): ServiceError;
  /** Create UI error */
  createUIError(componentName: string, operation: UIOperation, message: string): UIError;
}

/**
 * Error codes enum
 */
export enum ErrorCodes {
  // Validation errors (1000-1999)
  VALIDATION_REQUIRED = "VALIDATION_REQUIRED",
  VALIDATION_MIN_LENGTH = "VALIDATION_MIN_LENGTH",
  VALIDATION_MAX_LENGTH = "VALIDATION_MAX_LENGTH",
  VALIDATION_INVALID_FORMAT = "VALIDATION_INVALID_FORMAT",
  VALIDATION_INVALID_TYPE = "VALIDATION_INVALID_TYPE",
  VALIDATION_OUT_OF_RANGE = "VALIDATION_OUT_OF_RANGE",
  VALIDATION_DUPLICATE = "VALIDATION_DUPLICATE",
  VALIDATION_CONSTRAINT = "VALIDATION_CONSTRAINT",

  // Business logic errors (2000-2999)
  BUSINESS_INVALID_PLAYER_COUNT = "BUSINESS_INVALID_PLAYER_COUNT",
  BUSINESS_INVALID_ARMY_COUNT = "BUSINESS_INVALID_ARMY_COUNT",
  BUSINESS_INVALID_GAME_STATE = "BUSINESS_INVALID_GAME_STATE",
  BUSINESS_INVALID_BATTLE_STATE = "BUSINESS_INVALID_BATTLE_STATE",
  BUSINESS_RULE_VIOLATION = "BUSINESS_RULE_VIOLATION",

  // System errors (3000-3999)
  SYSTEM_MEMORY_ERROR = "SYSTEM_MEMORY_ERROR",
  SYSTEM_TIMEOUT = "SYSTEM_TIMEOUT",
  SYSTEM_PERMISSION_DENIED = "SYSTEM_PERMISSION_DENIED",
  SYSTEM_CONFIGURATION_ERROR = "SYSTEM_CONFIGURATION_ERROR",
  SYSTEM_INITIALIZATION_ERROR = "SYSTEM_INITIALIZATION_ERROR",

  // Network errors (4000-4999)
  NETWORK_CONNECTION_FAILED = "NETWORK_CONNECTION_FAILED",
  NETWORK_TIMEOUT = "NETWORK_TIMEOUT",
  NETWORK_SERVER_ERROR = "NETWORK_SERVER_ERROR",
  NETWORK_CLIENT_ERROR = "NETWORK_CLIENT_ERROR",
  NETWORK_RATE_LIMIT = "NETWORK_RATE_LIMIT",

  // Storage errors (5000-5999)
  STORAGE_READ_ERROR = "STORAGE_READ_ERROR",
  STORAGE_WRITE_ERROR = "STORAGE_WRITE_ERROR",
  STORAGE_FULL = "STORAGE_FULL",
  STORAGE_CORRUPTED = "STORAGE_CORRUPTED",
  STORAGE_UNAVAILABLE = "STORAGE_UNAVAILABLE",

  // Game errors (6000-6999)
  GAME_STATE_INVALID = "GAME_STATE_INVALID",
  GAME_PLAYER_NOT_FOUND = "GAME_PLAYER_NOT_FOUND",
  GAME_BATTLE_INVALID = "GAME_BATTLE_INVALID",
  GAME_DICE_ERROR = "GAME_DICE_ERROR",
  GAME_RULE_VIOLATION = "GAME_RULE_VIOLATION",

  // UI errors (7000-7999)
  UI_RENDER_ERROR = "UI_RENDER_ERROR",
  UI_EVENT_HANDLER_ERROR = "UI_EVENT_HANDLER_ERROR",
  UI_ANIMATION_ERROR = "UI_ANIMATION_ERROR",
  UI_COMPONENT_ERROR = "UI_COMPONENT_ERROR",
  UI_STATE_ERROR = "UI_STATE_ERROR",

  // Service errors (8000-8999)
  SERVICE_INITIALIZATION_ERROR = "SERVICE_INITIALIZATION_ERROR",
  SERVICE_CONFIGURATION_ERROR = "SERVICE_CONFIGURATION_ERROR",
  SERVICE_DEPENDENCY_ERROR = "SERVICE_DEPENDENCY_ERROR",
  SERVICE_HEALTH_CHECK_FAILED = "SERVICE_HEALTH_CHECK_FAILED",
  SERVICE_OPERATION_FAILED = "SERVICE_OPERATION_FAILED",

  // Translation errors (9000-9999)
  TRANSLATION_KEY_NOT_FOUND = "TRANSLATION_KEY_NOT_FOUND",
  TRANSLATION_LOAD_ERROR = "TRANSLATION_LOAD_ERROR",
  TRANSLATION_INTERPOLATION_ERROR = "TRANSLATION_INTERPOLATION_ERROR",
  TRANSLATION_VALIDATION_ERROR = "TRANSLATION_VALIDATION_ERROR",
  TRANSLATION_CACHE_ERROR = "TRANSLATION_CACHE_ERROR",
}

/**
 * Common validation rules
 */
export const VALIDATION_RULES = {
  REQUIRED: "required",
  MIN_LENGTH: "minLength",
  MAX_LENGTH: "maxLength",
  MIN_VALUE: "minValue",
  MAX_VALUE: "maxValue",
  EMAIL: "email",
  URL: "url",
  PATTERN: "pattern",
  CUSTOM: "custom",
} as const;

/**
 * Error severity levels mapping
 */
export const ERROR_SEVERITY_LEVELS: Record<ErrorSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
} as const;

/**
 * Default error messages
 */
export const DEFAULT_ERROR_MESSAGES = {
  [ErrorCodes.VALIDATION_REQUIRED]: "This field is required",
  [ErrorCodes.VALIDATION_MIN_LENGTH]: "Must be at least {min} characters",
  [ErrorCodes.VALIDATION_MAX_LENGTH]: "Must be at most {max} characters",
  [ErrorCodes.VALIDATION_INVALID_FORMAT]: "Invalid format",
  [ErrorCodes.VALIDATION_INVALID_TYPE]: "Invalid type",
  [ErrorCodes.VALIDATION_OUT_OF_RANGE]: "Value is out of range",
  [ErrorCodes.VALIDATION_DUPLICATE]: "Duplicate value",
  [ErrorCodes.VALIDATION_CONSTRAINT]: "Constraint violation",
  [ErrorCodes.BUSINESS_INVALID_PLAYER_COUNT]: "Invalid number of players",
  [ErrorCodes.BUSINESS_INVALID_ARMY_COUNT]: "Invalid number of armies",
  [ErrorCodes.BUSINESS_INVALID_GAME_STATE]: "Invalid game state",
  [ErrorCodes.BUSINESS_INVALID_BATTLE_STATE]: "Invalid battle state",
  [ErrorCodes.BUSINESS_RULE_VIOLATION]: "Business rule violation",
  [ErrorCodes.SYSTEM_MEMORY_ERROR]: "Memory error",
  [ErrorCodes.SYSTEM_TIMEOUT]: "Operation timed out",
  [ErrorCodes.SYSTEM_PERMISSION_DENIED]: "Permission denied",
  [ErrorCodes.SYSTEM_CONFIGURATION_ERROR]: "Configuration error",
  [ErrorCodes.SYSTEM_INITIALIZATION_ERROR]: "Initialization error",
  [ErrorCodes.NETWORK_CONNECTION_FAILED]: "Connection failed",
  [ErrorCodes.NETWORK_TIMEOUT]: "Network timeout",
  [ErrorCodes.NETWORK_SERVER_ERROR]: "Server error",
  [ErrorCodes.NETWORK_CLIENT_ERROR]: "Client error",
  [ErrorCodes.NETWORK_RATE_LIMIT]: "Rate limit exceeded",
  [ErrorCodes.STORAGE_READ_ERROR]: "Storage read error",
  [ErrorCodes.STORAGE_WRITE_ERROR]: "Storage write error",
  [ErrorCodes.STORAGE_FULL]: "Storage full",
  [ErrorCodes.STORAGE_CORRUPTED]: "Storage corrupted",
  [ErrorCodes.STORAGE_UNAVAILABLE]: "Storage unavailable",
  [ErrorCodes.GAME_STATE_INVALID]: "Invalid game state",
  [ErrorCodes.GAME_PLAYER_NOT_FOUND]: "Player not found",
  [ErrorCodes.GAME_BATTLE_INVALID]: "Invalid battle",
  [ErrorCodes.GAME_DICE_ERROR]: "Dice error",
  [ErrorCodes.GAME_RULE_VIOLATION]: "Game rule violation",
  [ErrorCodes.UI_RENDER_ERROR]: "Render error",
  [ErrorCodes.UI_EVENT_HANDLER_ERROR]: "Event handler error",
  [ErrorCodes.UI_ANIMATION_ERROR]: "Animation error",
  [ErrorCodes.UI_COMPONENT_ERROR]: "Component error",
  [ErrorCodes.UI_STATE_ERROR]: "State error",
  [ErrorCodes.SERVICE_INITIALIZATION_ERROR]: "Service initialization error",
  [ErrorCodes.SERVICE_CONFIGURATION_ERROR]: "Service configuration error",
  [ErrorCodes.SERVICE_DEPENDENCY_ERROR]: "Service dependency error",
  [ErrorCodes.SERVICE_HEALTH_CHECK_FAILED]: "Health check failed",
  [ErrorCodes.SERVICE_OPERATION_FAILED]: "Operation failed",
  [ErrorCodes.TRANSLATION_KEY_NOT_FOUND]: "Translation key not found",
  [ErrorCodes.TRANSLATION_LOAD_ERROR]: "Translation load error",
  [ErrorCodes.TRANSLATION_INTERPOLATION_ERROR]: "Translation interpolation error",
  [ErrorCodes.TRANSLATION_VALIDATION_ERROR]: "Translation validation error",
  [ErrorCodes.TRANSLATION_CACHE_ERROR]: "Translation cache error",
} as const;

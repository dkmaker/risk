/**
 * Type definitions index for Risk Dice Battle
 *
 * This file provides a centralized export of all type definitions
 * used throughout the Risk Dice Battle application.
 */

// Core game types
export type {
  Player,
  BattlePlayer,
  GameState,
  BattleResult,
  DiceRoll,
  GameSettings,
  PlayerColor,
  PlayerColorHex,
  GameScreen,
  BattlePhase,
  Language,
  HeaderIcon,
  ValidationResult,
  BattleConfig,
  ArmySelectionConfig,
  PlayerValidator,
  GameStateValidator,
  BattlePlayerValidator,
} from "./game";

// UI component types
export type {
  BaseComponentProps,
  ButtonProps,
  PlayerCardProps,
  HeaderProps,
  ScreenProps,
  DiceProps,
  AnimationTiming,
  UIState,
  Theme,
} from "./ui";

// Service layer types
export type {
  BaseService,
  ServiceConfig,
  AppConfig,
} from "./services";

// Utility types
export type {
  DeepPartial,
  Optional,
  Nullable,
  Maybe,
  Brand,
  Timestamp,
  JSONValue,
  Predicate,
  Transformer,
  RequiredKeys,
} from "./utils";

// Translation system types
export type {
  TranslationKeyPath,
  TranslationFunction,
  TranslationOptions,
} from "./translations";

// Error handling types
export type {
  BaseError,
  ValidationError,
  SystemError,
  ErrorSeverity,
  ErrorCategory,
} from "./errors";

// Constants and enums
export {
  PLAYER_COLOR_MAP,
  DEFAULT_BATTLE_CONFIG,
  DEFAULT_GAME_SETTINGS,
} from "./game";

/**
 * Type utility to extract props from a component
 */
export type ComponentProps<T> = T extends (props: infer P) => unknown ? P : never;

/**
 * Type utility to extract the element type from an array
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Type utility to make a type's properties mutable
 */
export type MutableType<T> = {
  -readonly [P in keyof T]: T[P];
};

/**
 * Type utility to create a partial type with required keys
 */
export type PartialWithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

/**
 * Type utility for creating a union from object values
 */
export type ValueOf<T> = T[keyof T];

/**
 * Type utility for creating branded types
 */
export type Branded<T, Brand> = T & { readonly __brand: Brand };

/**
 * Type guards for runtime type checking
 */
import type { BattlePlayer, DiceRoll, Player } from "./game";

export const isPlayer = (value: unknown): value is Player => {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as any).name === "string" &&
    typeof (value as any).color === "string" &&
    typeof (value as any).colorName === "string"
  );
};

export const isBattlePlayer = (value: unknown): value is BattlePlayer => {
  return (
    isPlayer(value) &&
    typeof (value as any).playerIndex === "number" &&
    typeof (value as any).armies === "number" &&
    typeof (value as any).initialArmies === "number" &&
    typeof (value as any).page === "number"
  );
};

export const isDiceRoll = (value: unknown): value is DiceRoll => {
  return (
    typeof value === "object" &&
    value !== null &&
    Array.isArray((value as any).values) &&
    (value as any).values.every((v: unknown) => typeof v === "number" && v >= 1 && v <= 6) &&
    typeof (value as any).count === "number" &&
    ((value as any).type === "attacker" || (value as any).type === "defender")
  );
};

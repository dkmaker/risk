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
  UIState,
  Theme,
} from "./ui";

// Service layer types
export type {
  BaseService,
  ServiceConfig,
  AppConfig,
} from "./services";

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
    "name" in value &&
    "color" in value &&
    "colorName" in value &&
    typeof (value as { name: unknown }).name === "string" &&
    typeof (value as { color: unknown }).color === "string" &&
    typeof (value as { colorName: unknown }).colorName === "string"
  );
};

export const isBattlePlayer = (value: unknown): value is BattlePlayer => {
  return (
    isPlayer(value) &&
    "playerIndex" in value &&
    "armies" in value &&
    "initialArmies" in value &&
    "page" in value &&
    typeof (value as { playerIndex: unknown }).playerIndex === "number" &&
    typeof (value as { armies: unknown }).armies === "number" &&
    typeof (value as { initialArmies: unknown }).initialArmies === "number" &&
    typeof (value as { page: unknown }).page === "number"
  );
};

export const isDiceRoll = (value: unknown): value is DiceRoll => {
  return (
    typeof value === "object" &&
    value !== null &&
    "values" in value &&
    "count" in value &&
    "type" in value &&
    Array.isArray((value as { values: unknown }).values) &&
    (value as { values: unknown[] }).values.every(
      (v: unknown) => typeof v === "number" && v >= 1 && v <= 6
    ) &&
    typeof (value as { count: unknown }).count === "number" &&
    ((value as { type: unknown }).type === "attacker" ||
      (value as { type: unknown }).type === "defender")
  );
};

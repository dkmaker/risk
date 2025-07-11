/**
 * Core game types for Risk Dice Battle
 *
 * This file defines the fundamental types used throughout the game,
 * including Player, GameState, and battle-related interfaces.
 */

// Player color type - supports all 6 available colors
export type PlayerColor = "#e74c3c" | "#3498db" | "#2ecc71" | "#f39c12" | "#2c3e50" | "#9b59b6";

// Player color names for UI display
export type PlayerColorName = "red" | "blue" | "green" | "yellow" | "black" | "purple";

// Map of color names to hex values
export const PLAYER_COLORS: Record<PlayerColorName, PlayerColor> = {
  red: "#e74c3c",
  blue: "#3498db",
  green: "#2ecc71",
  yellow: "#f39c12",
  black: "#2c3e50",
  purple: "#9b59b6",
} as const;

// Game screen types
export type GameScreen =
  | "player-setup"
  | "attacker-selection"
  | "defender-selection"
  | "setup-attacker"
  | "setup-defender"
  | "battle-screen"
  | "settings-screen";

// Battle phase types
export type BattlePhase = "setup" | "rolling" | "results" | "finished";

// Language types
export type Language = "en" | "da";

// Header icon types
export type HeaderIcon = "🎲" | "⚔️" | "🛡️" | "⚙️" | "battle";

/**
 * Player interface representing a game participant
 */
export interface Player {
  /** Player's display name */
  name: string;
  /** Player's color (hex value) */
  color: PlayerColor;
  /** Player's color name for UI purposes */
  colorName: PlayerColorName;
}

/**
 * Battle player interface extending Player with battle-specific data
 */
export interface BattlePlayer extends Player {
  /** Player's index in the players array */
  playerIndex: number;
  /** Current number of armies */
  armies: number;
  /** Initial number of armies at battle start */
  initialArmies: number;
  /** Current page for army selection (0-4 for 1-50 armies) */
  page: number;
}

/**
 * Dice roll result interface
 */
export interface DiceRoll {
  /** Array of dice values (1-6) */
  values: number[];
  /** Number of dice rolled */
  count: number;
  /** Whether this is an attacker or defender roll */
  type: "attacker" | "defender";
}

/**
 * Battle result interface
 */
export interface BattleResult {
  /** Attacker's dice roll */
  attackerRoll: DiceRoll;
  /** Defender's dice roll */
  defenderRoll: DiceRoll;
  /** Number of armies attacker lost */
  attackerLosses: number;
  /** Number of armies defender lost */
  defenderLosses: number;
  /** Battle outcome */
  outcome: "attacker-wins" | "defender-wins" | "both-lose";
  /** Timestamp of the battle */
  timestamp: number;
}

/**
 * Game state interface representing the entire game state
 */
export interface GameState {
  /** Array of all players in the game */
  players: Player[];
  /** Current attacker in battle */
  attacker: BattlePlayer | null;
  /** Current defender in battle */
  defender: BattlePlayer | null;
  /** Current battle phase */
  phase: BattlePhase;
  /** Current active screen */
  currentScreen: GameScreen;
  /** Game settings */
  settings: GameSettings;
  /** Battle history for current session */
  battleHistory: BattleResult[];
}

/**
 * Game settings interface
 */
export interface GameSettings {
  /** Current language */
  language: Language;
  /** Whether sound effects are enabled */
  soundEnabled: boolean;
  /** Animation speed multiplier (0.5 = slow, 1.0 = normal, 2.0 = fast) */
  animationSpeed: number;
  /** Whether to show advanced statistics */
  showStats: boolean;
}

/**
 * Army selection configuration
 */
export interface ArmySelectionConfig {
  /** Minimum number of armies */
  minArmies: number;
  /** Maximum number of armies */
  maxArmies: number;
  /** Number of armies per page */
  armiesPerPage: number;
  /** Total number of pages */
  totalPages: number;
}

/**
 * Battle configuration interface
 */
export interface BattleConfig {
  /** Maximum dice attacker can roll */
  maxAttackerDice: number;
  /** Maximum dice defender can roll */
  maxDefenderDice: number;
  /** Minimum armies attacker must have to attack */
  minAttackerArmies: number;
  /** Minimum armies defender must have */
  minDefenderArmies: number;
  /** Army selection configuration */
  armySelection: ArmySelectionConfig;
}

/**
 * Default battle configuration following Risk rules
 */
export const DEFAULT_BATTLE_CONFIG: BattleConfig = {
  maxAttackerDice: 3,
  maxDefenderDice: 2,
  minAttackerArmies: 1,
  minDefenderArmies: 1,
  armySelection: {
    minArmies: 1,
    maxArmies: 50,
    armiesPerPage: 10,
    totalPages: 5,
  },
} as const;

/**
 * Default game settings
 */
export const DEFAULT_GAME_SETTINGS: GameSettings = {
  language: "en",
  soundEnabled: true,
  animationSpeed: 1.0,
  showStats: false,
} as const;

/**
 * Validation result interface
 */
export interface ValidationResult {
  /** Whether the validation passed */
  isValid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Field that failed validation */
  field?: string;
}

/**
 * Player validation function type
 */
export type PlayerValidator = (player: Partial<Player>) => ValidationResult;

/**
 * Game state validation function type
 */
export type GameStateValidator = (gameState: Partial<GameState>) => ValidationResult;

/**
 * Battle player validation function type
 */
export type BattlePlayerValidator = (battlePlayer: Partial<BattlePlayer>) => ValidationResult;

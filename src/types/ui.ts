/**
 * UI component types for Risk Dice Battle
 *
 * This file defines types for UI components, props, and interactions
 * used throughout the Preact component system.
 */

import type { ComponentChildren, JSX } from "preact";
import type {
  BattlePlayer,
  BattleResult,
  DiceRoll,
  GameScreen,
  HeaderIcon,
  Language,
  Player,
  PlayerColor,
  PlayerColorName,
} from "./game";

/**
 * Base component props that all components should extend
 */
export interface BaseComponentProps {
  /** CSS class name */
  className?: string;
  /** Component children */
  children?: ComponentChildren;
  /** Test ID for testing */
  testId?: string;
}

/**
 * Button component props
 */
export interface ButtonProps extends BaseComponentProps {
  /** Button variant */
  variant?: "primary" | "secondary" | "danger" | "army";
  /** Button size */
  size?: "small" | "medium" | "large";
  /** Whether button is disabled */
  disabled?: boolean;
  /** Whether button is in loading state */
  loading?: boolean;
  /** Whether button is selected/active */
  selected?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Button type for forms */
  type?: "button" | "submit" | "reset";
  /** Full width button */
  fullWidth?: boolean;
}

/**
 * Player card component props
 */
export interface PlayerCardProps extends BaseComponentProps {
  /** Player data */
  player: Player;
  /** Whether the card is selected */
  selected?: boolean;
  /** Whether the card is clickable */
  clickable?: boolean;
  /** Click handler */
  onClick?: (player: Player) => void;
  /** Card size */
  size?: "small" | "medium" | "large";
  /** Show additional info */
  showInfo?: boolean;
}

/**
 * Battle player card component props
 */
export interface BattlePlayerCardProps extends BaseComponentProps {
  /** Battle player data */
  battlePlayer: BattlePlayer;
  /** Card type */
  type: "attacker" | "defender";
  /** Whether to show dice info */
  showDiceInfo?: boolean;
  /** Card glow effect */
  glow?: "winner" | "loser" | "tie" | "none";
  /** Animation state */
  animating?: boolean;
}

/**
 * Header component props
 */
export interface HeaderProps extends BaseComponentProps {
  /** Header icon */
  icon: HeaderIcon;
  /** Left button handler */
  onHomeClick?: () => void;
  /** Right button handler */
  onSettingsClick?: () => void;
  /** Show back button instead of home */
  showBackButton?: boolean;
  /** Back button handler */
  onBackClick?: () => void;
}

/**
 * Screen component props
 */
export interface ScreenProps extends BaseComponentProps {
  /** Screen identifier */
  screenId: GameScreen;
  /** Whether screen is active */
  active: boolean;
  /** Screen title */
  title?: string;
  /** Screen background color */
  backgroundColor?: PlayerColor;
  /** Screen background gradient */
  backgroundGradient?: boolean;
}

/**
 * Army selection button props
 */
export interface ArmyButtonProps extends BaseComponentProps {
  /** Army count or navigation symbol */
  value: number | "<" | ">";
  /** Whether button is selected */
  selected?: boolean;
  /** Click handler */
  onClick: (value: number | "<" | ">") => void;
  /** Button size */
  size?: "small" | "medium";
}

/**
 * Army selection grid props
 */
export interface ArmySelectionGridProps extends BaseComponentProps {
  /** Current page (0-4) */
  currentPage: number;
  /** Selected army count */
  selectedArmies: number;
  /** Army selection handler */
  onArmySelect: (count: number) => void;
  /** Page change handler */
  onPageChange: (direction: -1 | 1) => void;
  /** Maximum armies allowed */
  maxArmies?: number;
  /** Minimum armies required */
  minArmies?: number;
}

/**
 * Dice component props
 */
export interface DiceProps extends BaseComponentProps {
  /** Dice value (1-6) */
  value: number;
  /** Dice type */
  type: "attacker" | "defender";
  /** Whether dice is a winner */
  winner?: boolean;
  /** Whether dice is a loser */
  loser?: boolean;
  /** Animation delay in milliseconds */
  animationDelay?: number;
  /** Dice size */
  size?: "small" | "medium" | "large";
}

/**
 * Dice roll display props
 */
export interface DiceRollDisplayProps extends BaseComponentProps {
  /** Attacker dice roll */
  attackerRoll: DiceRoll;
  /** Defender dice roll */
  defenderRoll: DiceRoll;
  /** Whether to show results */
  showResults?: boolean;
  /** Animation state */
  animating?: boolean;
}

/**
 * Battle result display props
 */
export interface BattleResultDisplayProps extends BaseComponentProps {
  /** Battle result */
  result: BattleResult;
  /** Display variant */
  variant?: "inline" | "modal" | "banner";
  /** Whether to show detailed stats */
  showDetails?: boolean;
}

/**
 * Player selection list props
 */
export interface PlayerSelectionListProps extends BaseComponentProps {
  /** List of players */
  players: Player[];
  /** Currently selected player */
  selectedPlayer?: Player;
  /** Player selection handler */
  onPlayerSelect: (player: Player, index: number) => void;
  /** Players to exclude from selection */
  excludePlayers?: Player[];
  /** List title */
  title?: string;
}

/**
 * Player setup form props
 */
export interface PlayerSetupFormProps extends BaseComponentProps {
  /** Initial player data */
  initialPlayers?: Player[];
  /** Form submission handler */
  onSubmit: (players: Player[]) => void;
  /** Whether form is submitting */
  submitting?: boolean;
  /** Maximum number of players */
  maxPlayers?: number;
  /** Minimum number of players */
  minPlayers?: number;
}

/**
 * Player color card props
 */
export interface PlayerColorCardProps extends BaseComponentProps {
  /** Player color */
  color: PlayerColor;
  /** Player color name */
  colorName: PlayerColorName;
  /** Player name */
  playerName: string;
  /** Name change handler */
  onNameChange: (name: string) => void;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Language selector props
 */
export interface LanguageSelectorProps extends BaseComponentProps {
  /** Current language */
  currentLanguage: Language;
  /** Language change handler */
  onLanguageChange: (language: Language) => void;
  /** Available languages */
  availableLanguages?: Language[];
}

/**
 * Settings screen props
 */
export interface SettingsScreenProps extends BaseComponentProps {
  /** Current language */
  currentLanguage: Language;
  /** Language change handler */
  onLanguageChange: (language: Language) => void;
  /** Edit players handler */
  onEditPlayers: () => void;
  /** Back to game handler */
  onBackToGame: () => void;
  /** Sound enabled state */
  soundEnabled: boolean;
  /** Sound toggle handler */
  onSoundToggle: (enabled: boolean) => void;
  /** Animation speed */
  animationSpeed: number;
  /** Animation speed change handler */
  onAnimationSpeedChange: (speed: number) => void;
}

/**
 * Modal component props
 */
export interface ModalProps extends BaseComponentProps {
  /** Whether modal is open */
  open: boolean;
  /** Modal close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Whether modal can be closed by clicking outside */
  closeOnOutsideClick?: boolean;
  /** Whether modal can be closed by pressing escape */
  closeOnEscape?: boolean;
  /** Modal size */
  size?: "small" | "medium" | "large";
}

/**
 * Confirmation dialog props
 */
export interface ConfirmationDialogProps extends BaseComponentProps {
  /** Whether dialog is open */
  open: boolean;
  /** Dialog title */
  title: string;
  /** Dialog message */
  message: string;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm handler */
  onConfirm: () => void;
  /** Cancel handler */
  onCancel: () => void;
  /** Confirm button variant */
  confirmVariant?: "primary" | "danger";
}

/**
 * Loading spinner props
 */
export interface LoadingSpinnerProps extends BaseComponentProps {
  /** Spinner size */
  size?: "small" | "medium" | "large";
  /** Loading text */
  text?: string;
  /** Spinner color */
  color?: "primary" | "secondary" | "light" | "dark";
}

/**
 * Animation timing types
 */
export interface AnimationTiming {
  /** Animation duration in milliseconds */
  duration: number;
  /** Animation delay in milliseconds */
  delay: number;
  /** Animation easing function */
  easing: string;
}

/**
 * Default animation timings
 */
export const ANIMATION_TIMINGS: Record<string, AnimationTiming> = {
  diceRoll: { duration: 500, delay: 0, easing: "ease-in-out" },
  winnerHighlight: { duration: 300, delay: 600, easing: "ease-out" },
  cardGlow: { duration: 1500, delay: 0, easing: "ease-in-out" },
  screenTransition: { duration: 300, delay: 0, easing: "ease-in-out" },
  buttonPress: { duration: 150, delay: 0, easing: "ease-out" },
  fadeIn: { duration: 300, delay: 0, easing: "ease-in" },
  fadeOut: { duration: 200, delay: 0, easing: "ease-out" },
} as const;

/**
 * Responsive breakpoints
 */
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1200,
} as const;

/**
 * UI state types
 */
export type UIState = "idle" | "loading" | "success" | "error";

/**
 * Touch event types
 */
export interface TouchEventData {
  /** Touch start position */
  startX: number;
  /** Touch start position */
  startY: number;
  /** Touch end position */
  endX: number;
  /** Touch end position */
  endY: number;
  /** Touch duration in milliseconds */
  duration: number;
  /** Touch direction */
  direction: "left" | "right" | "up" | "down" | "none";
}

/**
 * Event handler types
 */
export type EventHandler<T = void> = (event?: T) => void;
export type AsyncEventHandler<T = void> = (event?: T) => Promise<void>;

/**
 * Form validation types
 */
export interface FormValidation {
  /** Whether the form is valid */
  isValid: boolean;
  /** Field-specific errors */
  errors: Record<string, string>;
  /** General form error */
  generalError?: string;
}

/**
 * Theme types
 */
export interface Theme {
  /** Primary color */
  primary: string;
  /** Secondary color */
  secondary: string;
  /** Success color */
  success: string;
  /** Warning color */
  warning: string;
  /** Error color */
  error: string;
  /** Background color */
  background: string;
  /** Surface color */
  surface: string;
  /** Text color */
  text: string;
  /** Border radius */
  borderRadius: string;
  /** Font family */
  fontFamily: string;
}

/**
 * Accessibility types
 */
export interface AccessibilityProps {
  /** ARIA label */
  "aria-label"?: string;
  /** ARIA described by */
  "aria-describedby"?: string;
  /** ARIA role */
  role?: string;
  /** Tab index */
  tabIndex?: number;
}

/**
 * Extended component props with accessibility
 */
export interface AccessibleComponentProps extends BaseComponentProps, AccessibilityProps {
  /** Keyboard event handler */
  onKeyDown?: (event: KeyboardEvent) => void;
  /** Focus event handler */
  onFocus?: (event: FocusEvent) => void;
  /** Blur event handler */
  onBlur?: (event: FocusEvent) => void;
}

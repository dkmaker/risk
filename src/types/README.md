# Type System Documentation

This directory contains the comprehensive type system for the Risk Dice Battle refactoring project. The type system provides strict TypeScript definitions for all aspects of the application, ensuring type safety and improved developer experience.

## Directory Structure

```
src/types/
├── index.ts          # Main export file with all types and utilities
├── game.ts           # Core game types and interfaces
├── ui.ts             # UI component types and props
├── services.ts       # Service layer type definitions
├── utils.ts          # Utility types and common patterns
├── translations.ts   # Translation system types
├── errors.ts         # Error handling and validation types
└── README.md         # This documentation file
```

## Type Categories

### 1. Core Game Types (`game.ts`)

Defines the fundamental types for the Risk Dice Battle game logic:

- **Player Types**: `Player`, `BattlePlayer`, `PlayerColor`, `PlayerColorName`
- **Game State**: `GameState`, `BattlePhase`, `GameScreen`, `GameSettings`
- **Battle System**: `BattleResult`, `DiceRoll`, `BattleConfig`
- **Validation**: `ValidationResult`, `PlayerValidator`, `GameStateValidator`

Key interfaces:
```typescript
interface Player {
  name: string;
  color: PlayerColor;
  colorName: PlayerColorName;
}

interface GameState {
  players: Player[];
  attacker: BattlePlayer | null;
  defender: BattlePlayer | null;
  phase: BattlePhase;
  currentScreen: GameScreen;
  settings: GameSettings;
  battleHistory: BattleResult[];
}
```

### 2. UI Component Types (`ui.ts`)

Comprehensive types for all UI components and their props:

- **Base Components**: `BaseComponentProps`, `ButtonProps`, `PlayerCardProps`
- **Game Components**: `DiceProps`, `BattlePlayerCardProps`, `ArmySelectionGridProps`
- **Screen Components**: `ScreenProps`, `HeaderProps`, `ModalProps`
- **Animation**: `AnimationTiming`, `ANIMATION_TIMINGS`
- **Accessibility**: `AccessibilityProps`, `AccessibleComponentProps`

Key patterns:
```typescript
interface BaseComponentProps {
  className?: string;
  children?: ComponentChildren;
  testId?: string;
}

interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'army';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  onClick?: () => void;
}
```

### 3. Service Layer Types (`services.ts`)

Type definitions for the service architecture:

- **Base Service**: `BaseService` interface that all services implement
- **Core Services**: `StorageService`, `TranslationService`, `GameService`, `DiceService`
- **Extended Services**: `AudioService`, `AnalyticsService`, `PWAService`
- **Service Management**: `ServiceContainer`, `ServiceFactory`, `ServiceManager`

Service pattern:
```typescript
interface BaseService {
  readonly name: string;
  initialize(): Promise<void> | void;
  cleanup(): Promise<void> | void;
}

interface GameService extends BaseService {
  getGameState(): GameState;
  setGameState(state: GameState): void;
  startNewGame(players: Player[]): void;
  executeBattle(): BattleResult;
  // ... other methods
}
```

### 4. Utility Types (`utils.ts`)

Advanced TypeScript utility types for common patterns:

- **Type Manipulation**: `DeepPartial`, `DeepRequired`, `Optional`, `Required`
- **Functional Types**: `Result`, `Option`, `Either`, `AsyncResult`
- **Brand Types**: `Brand`, `PlayerId`, `GameId`, `BattleId`, `Timestamp`
- **Advanced Patterns**: `State`, `Action`, `Reducer`, `Observable`, `Subject`

Utility examples:
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

type Option<T> = 
  | { kind: 'some'; value: T }
  | { kind: 'none' };

type Brand<T, B> = T & { __brand: B };
type PlayerId = Brand<string, 'PlayerId'>;
```

### 5. Translation System Types (`translations.ts`)

Comprehensive i18n type system:

- **Translation Keys**: `TranslationKeyPath` with type-safe key paths
- **Translation System**: `TranslationService`, `TranslationProvider`
- **Localization**: `TranslationMetadata`, `TranslationBundle`
- **Validation**: `TranslationValidator`, `TranslationValidationResult`

Translation safety:
```typescript
type TranslationKeyPath = 
  | 'appTitle'
  | 'player.setupTitle'
  | 'battle.rollDice'
  | 'validation.required'
  // ... type-safe key paths

interface TranslationHook {
  t: (key: TranslationKeyPath, params?: TranslationParams) => string;
  language: Language;
  changeLanguage: (language: Language) => void;
}
```

### 6. Error Handling Types (`errors.ts`)

Robust error handling and validation system:

- **Base Error**: `BaseError` interface with severity and context
- **Specific Errors**: `ValidationError`, `GameStateError`, `ServiceError`
- **Error Management**: `ErrorHandler`, `ErrorReporter`, `ErrorFactory`
- **Validation**: `ValidationRule`, `Validator`, `ValidationResult`

Error hierarchy:
```typescript
interface BaseError {
  code: string;
  message: string;
  timestamp: number;
  severity: ErrorSeverity;
  context?: Record<string, any>;
}

interface ValidationError extends BaseError {
  field: string;
  rule: string;
  expected: any;
  actual: any;
}
```

## Usage Examples

### Basic Type Usage

```typescript
import { Player, GameState, BattleResult } from '@/types';

// Type-safe player creation
const player: Player = {
  name: 'John',
  color: '#e74c3c',
  colorName: 'red'
};

// Type-safe game state
const gameState: GameState = {
  players: [player],
  attacker: null,
  defender: null,
  phase: 'setup',
  currentScreen: 'player-setup',
  settings: DEFAULT_GAME_SETTINGS,
  battleHistory: []
};
```

### Component Props

```typescript
import { ButtonProps, PlayerCardProps } from '@/types';

// Type-safe component props
const MyButton = ({ variant, size, onClick, children }: ButtonProps) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

### Service Implementation

```typescript
import { GameService, GameState, Player } from '@/types';

class GameServiceImpl implements GameService {
  readonly name = 'game';

  async initialize(): Promise<void> {
    // Initialize game service
  }

  getGameState(): GameState {
    // Return current game state
  }

  startNewGame(players: Player[]): void {
    // Start new game with players
  }
}
```

### Error Handling

```typescript
import { Result, ValidationError, ErrorFactory } from '@/types';

// Type-safe error handling
const validatePlayer = (player: any): Result<Player, ValidationError> => {
  if (!player.name) {
    return {
      success: false,
      error: errorFactory.createValidationError(
        'name',
        'required',
        'Player name is required'
      )
    };
  }

  return {
    success: true,
    data: player as Player
  };
};
```

## Type Safety Features

### 1. Strict Null Checks
All types are designed to work with TypeScript's strict null checks, using explicit `null` and `undefined` where appropriate.

### 2. Branded Types
Important IDs use branded types to prevent mixing different ID types:
```typescript
type PlayerId = Brand<string, 'PlayerId'>;
type GameId = Brand<string, 'GameId'>;
// Can't accidentally use GameId where PlayerId is expected
```

### 3. Exhaustive Type Checking
Union types are designed to enable exhaustive checking:
```typescript
const handleGameEvent = (event: GameEvent) => {
  switch (event.type) {
    case 'player-added':
      // Handle player added
      break;
    case 'battle-started':
      // Handle battle started
      break;
    // TypeScript ensures all cases are handled
  }
};
```

### 4. Type Guards and Assertions
Runtime type checking utilities:
```typescript
import { isPlayer, assertPlayer } from '@/types';

// Type guard
if (isPlayer(value)) {
  // value is now typed as Player
}

// Type assertion
assertPlayer(value); // Throws if not a Player
// value is now typed as Player
```

## Constants and Enums

### Game Constants
```typescript
export const PLAYER_COLORS: Record<PlayerColorName, PlayerColor> = {
  red: '#e74c3c',
  blue: '#3498db',
  // ... other colors
};

export const DEFAULT_BATTLE_CONFIG: BattleConfig = {
  maxAttackerDice: 3,
  maxDefenderDice: 2,
  // ... other config
};
```

### Error Codes
```typescript
export enum ErrorCodes {
  VALIDATION_REQUIRED = 'VALIDATION_REQUIRED',
  BUSINESS_INVALID_PLAYER_COUNT = 'BUSINESS_INVALID_PLAYER_COUNT',
  SYSTEM_TIMEOUT = 'SYSTEM_TIMEOUT',
  // ... other codes
}
```

## Migration Guide

### From Existing Code

1. **Import types**: `import { Player, GameState } from '@/types';`
2. **Apply type annotations**: Add types to variables, parameters, and return values
3. **Use type guards**: Replace runtime checks with type guards
4. **Handle errors**: Use the error type system for better error handling

### Gradual Adoption

The type system supports gradual adoption:
- Start with basic types (`Player`, `GameState`)
- Add component prop types
- Implement service interfaces
- Add error handling types
- Use advanced utility types

## Best Practices

### 1. Use Specific Types
Prefer specific types over generic ones:
```typescript
// Good
const handlePlayerSelection = (player: Player) => { /* ... */ };

// Bad
const handlePlayerSelection = (player: any) => { /* ... */ };
```

### 2. Leverage Type Inference
Let TypeScript infer types when possible:
```typescript
// Good - type is inferred
const players = getPlayers();

// Unnecessary - type annotation redundant
const players: Player[] = getPlayers();
```

### 3. Use Type Guards
Use type guards for runtime validation:
```typescript
const processPlayer = (data: unknown) => {
  if (isPlayer(data)) {
    // data is now typed as Player
    console.log(data.name);
  }
};
```

### 4. Handle Errors Properly
Use the Result type for operations that can fail:
```typescript
const savePlayer = (player: Player): Result<void, SaveError> => {
  try {
    // Save player
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: error as SaveError };
  }
};
```

## Testing with Types

### Type-Safe Testing
```typescript
import { Player, GameState } from '@/types';

// Type-safe test data
const mockPlayer: Player = {
  name: 'Test Player',
  color: '#e74c3c',
  colorName: 'red'
};

// Type-safe test assertions
expect(isPlayer(mockPlayer)).toBe(true);
```

## Performance Considerations

### 1. Type-Only Imports
Use type-only imports when possible:
```typescript
import type { Player, GameState } from '@/types';
```

### 2. Avoid Complex Types in Hot Paths
Keep complex utility types out of performance-critical code paths.

### 3. Use Const Assertions
Use const assertions for immutable data:
```typescript
const PLAYER_COLORS = {
  red: '#e74c3c',
  blue: '#3498db'
} as const;
```

## Future Enhancements

### Planned Additions
1. **Schema Validation**: Runtime validation matching TypeScript types
2. **API Types**: Types for external API communication
3. **State Machine Types**: More sophisticated state management types
4. **Performance Monitoring**: Types for performance metrics
5. **Accessibility**: Enhanced accessibility type definitions

### Extension Points
The type system is designed to be extensible:
- Add new service types by extending `BaseService`
- Add new error types by extending `BaseError`
- Add new validation rules using `ValidationRule`
- Add new UI component types using `BaseComponentProps`

## Contributing

When adding new types:
1. Follow the existing naming conventions
2. Add comprehensive documentation
3. Include usage examples
4. Add type guards where appropriate
5. Update this README with new types
6. Write tests for complex types

## Type System Philosophy

This type system follows these principles:
1. **Safety First**: Prevent runtime errors through compile-time checking
2. **Developer Experience**: Make common tasks easier and more intuitive
3. **Maintainability**: Types should make code easier to understand and modify
4. **Performance**: Types should not impact runtime performance
5. **Scalability**: The system should grow with the application

The type system is designed to evolve with the application while maintaining backward compatibility and providing excellent developer experience.
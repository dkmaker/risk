# Risk Dice Battle Refactoring Plan

## Executive Summary

Transform the current 814-line monolithic JavaScript application into a modern, maintainable, and scalable solution using **Preact + TypeScript + UnoCSS** while preserving the excellent PWA features and user experience.

## Current State Analysis

### Application Overview
- **Name**: Risk Dice Battle
- **Type**: Progressive Web App (PWA)
- **Purpose**: Mobile-optimized implementation of Risk dice battles
- **Features**: 2-6 player setup, custom names/colors, official Risk rules
- **Current Size**: 814 lines of vanilla JavaScript in single file
- **Build Size**: ~16KB CSS, minimal JS bundle

### Technical Debt Assessment

#### Critical Issues
1. **Monolithic Structure**: Single 814-line main.js file violates separation of concerns
2. **Global State Management**: No encapsulation or validation
3. **Tight Coupling**: UI, game logic, and state management mixed together
4. **Limited Error Handling**: Potential for runtime failures
5. **No Testing**: Zero automated test coverage

#### Positive Aspects
1. **Excellent PWA Implementation**: Solid service worker, manifest, offline support
2. **Mobile-First Design**: Responsive, touch-optimized interface
3. **Performance**: Fast loading, smooth animations
4. **Internationalization**: Clean i18n implementation
5. **User Experience**: Intuitive navigation, visual feedback

## Recommended Technology Stack

### Core Framework: Preact + TypeScript

#### Why Preact?
- **Bundle Size**: 3KB vs 40KB for React (critical for PWA performance)
- **React Ecosystem**: Full compatibility with React libraries and tools
- **Performance**: Optimized for mobile devices and PWAs
- **Learning Curve**: Minimal if familiar with React patterns
- **TypeScript Support**: Excellent type safety integration

#### Why TypeScript?
- **Type Safety**: Catch errors at compile time
- **Developer Experience**: Better IDE support, refactoring safety
- **Maintainability**: Self-documenting code with interfaces
- **Gradual Migration**: Can be adopted incrementally

### Styling: UnoCSS Hybrid Approach

#### Why UnoCSS over Tailwind?
- **Performance**: Faster build times with virtual file system
- **Flexibility**: Better support for custom animations
- **Bundle Size**: Smaller output (2-6KB vs 3-8KB)
- **Vite Integration**: Seamless setup with current build process

#### Hybrid Strategy
- **UnoCSS**: For layout, spacing, utilities, and simple styling
- **Custom CSS**: Preserve complex animations and PWA-specific styles
- **Expected Reduction**: 40-50% bundle size reduction (16KB → 8-10KB)

### State Management: Custom Hooks + Signals

#### Approach
- **Preact Signals**: Reactive state management
- **Custom Hooks**: Encapsulated business logic
- **LocalStorage Integration**: Persistent data management
- **Type Safety**: Full TypeScript coverage

### Build System: Enhanced Vite Setup

#### Current Strengths
- **Vite**: Already configured and working well
- **pnpm**: Modern, efficient package manager
- **GitHub Actions**: Automated deployment pipeline

#### Enhancements
- **Workbox**: Advanced PWA service worker management
- **TypeScript**: Full type checking integration
- **Testing**: Vitest for unit and integration tests
- **Code Quality**: Biome for linting and formatting

## Architecture Design

### Directory Structure
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components (Button, Card, Header)
│   ├── game/            # Game-specific components (Dice, Battle)
│   └── screens/         # Screen components (Setup, Selection, Battle)
├── hooks/               # Custom React hooks
│   ├── useGameState.ts  # Game state management
│   ├── useLocalStorage.ts # Persistent storage
│   ├── useTranslation.ts # i18n integration
│   └── useDiceRoll.ts   # Dice animation logic
├── services/            # Business logic services
│   ├── GameService.ts   # Core game logic
│   ├── DiceService.ts   # Dice rolling mechanics
│   ├── StorageService.ts # localStorage management
│   └── TranslationService.ts # i18n support
├── stores/              # State management
│   ├── gameStore.ts     # Game state store
│   └── playerStore.ts   # Player management
├── types/               # TypeScript type definitions
│   ├── game.ts          # Game-related types
│   ├── player.ts        # Player types
│   └── ui.ts            # UI component types
├── utils/               # Utility functions
│   ├── domUtils.ts      # DOM manipulation helpers
│   ├── mathUtils.ts     # Mathematical calculations
│   └── constants.ts     # App constants
├── styles/              # Global styles and themes
│   ├── globals.css      # Global styles
│   ├── animations.css   # Custom animations
│   └── themes.css       # Theme variables
└── assets/              # Static assets
    ├── icons/           # App icons
    └── sounds/          # Audio files (future)
```

### Component Architecture

#### Screen Components
- **PlayerSetup**: Configure 2-6 players with names and colors
- **PlayerSelection**: Choose attacker and defender
- **ArmySelection**: Select army counts with button grid
- **BattleScreen**: Dice rolling and battle resolution

#### Shared Components
- **PlayerCard**: Reusable player display component
- **Button**: Consistent button styling with variants
- **Header**: Navigation header with contextual icons
- **Screen**: Wrapper component for screen management

#### Game Components
- **DiceRoll**: Animated dice rolling component
- **BattleResults**: Visual battle outcome display
- **ArmyCounter**: Army count display and selection

### State Management Strategy

#### Game State Structure
```typescript
interface GameState {
  players: Player[];
  currentBattle: {
    attacker: BattlePlayer;
    defender: BattlePlayer;
    phase: 'setup' | 'rolling' | 'results';
  };
  settings: {
    language: string;
    soundEnabled: boolean;
    animationSpeed: number;
  };
}
```

#### Custom Hooks
- **useGameState**: Centralized game state management
- **useLocalStorage**: Persistent data with validation
- **useTranslation**: i18n with dynamic loading
- **useDiceRoll**: Dice animation and result calculation

## Migration Strategy

### Phase 1: Foundation Setup (Week 1)
**Goal**: Establish modern development environment

#### Tasks
1. **Development Environment**
   - Install and configure Preact with TypeScript
   - Set up UnoCSS with custom theme configuration
   - Configure Vitest for comprehensive testing
   - Enhance Vite configuration for optimal builds

2. **Type System Implementation**
   - Create comprehensive TypeScript interfaces
   - Define component prop types and state shapes
   - Add strict type checking to existing functions
   - Implement proper error handling types

3. **Build System Enhancement**
   - Integrate Workbox for advanced PWA features
   - Configure automatic service worker generation
   - Set up code splitting and lazy loading
   - Optimize bundle size and performance

### Phase 2: Component Migration (Week 2)
**Goal**: Convert HTML/CSS to reusable Preact components

#### Tasks
1. **Core Screen Components**
   - Migrate PlayerSetup screen to Preact component
   - Convert PlayerSelection screens to components
   - Transform ArmySelection into reusable component
   - Refactor BattleScreen with proper state management

2. **Shared Component Library**
   - Create reusable PlayerCard component
   - Develop consistent Button component system
   - Build Header component with navigation logic
   - Implement Screen wrapper for consistent layout

3. **State Management Foundation**
   - Implement custom hooks for game state
   - Create localStorage persistence layer
   - Add comprehensive state validation
   - Ensure backward compatibility with existing data

### Phase 3: Game Logic Refactoring (Week 3)
**Goal**: Separate business logic from UI components

#### Tasks
1. **Service Layer Development**
   - Extract GameService with core game logic
   - Create DiceService for rolling mechanics
   - Develop StorageService for data persistence
   - Build TranslationService for i18n support

2. **Custom Hooks Implementation**
   - useGameState for centralized state management
   - useLocalStorage for persistent data handling
   - useTranslation for dynamic language switching
   - useDiceRoll for animation and result logic

3. **Type Safety Integration**
   - Add comprehensive type coverage
   - Implement runtime type validation
   - Create type-safe API boundaries
   - Ensure proper error handling

### Phase 4: Styling System (Week 4)
**Goal**: Modernize CSS architecture while preserving design

#### Tasks
1. **UnoCSS Integration**
   - Migrate layout styles to atomic classes
   - Preserve complex custom animations
   - Implement design token system
   - Maintain mobile-first responsive design

2. **Theme System Development**
   - Preserve military green color scheme (#4a5d3a)
   - Create consistent spacing scale
   - Implement typography system
   - Build animation utility classes

3. **Performance Optimization**
   - Optimize CSS bundle size
   - Implement critical CSS loading
   - Add proper CSS purging
   - Ensure PWA performance standards

### Phase 5: Testing & Quality (Week 5)
**Goal**: Ensure reliability and maintainability

#### Tasks
1. **Comprehensive Test Coverage**
   - Unit tests for all services and utilities
   - Component testing with @testing-library/preact
   - Integration tests for game flow
   - PWA functionality and performance tests

2. **Performance Optimization**
   - Implement code splitting strategies
   - Add lazy loading for non-critical components
   - Optimize bundle size and loading performance
   - Conduct PWA performance audits

3. **Quality Assurance**
   - Ensure feature parity with existing application
   - Verify mobile responsiveness across devices
   - Test offline functionality and data persistence
   - Validate accessibility and internationalization

## Expected Benefits

### Developer Experience
- **Type Safety**: Prevent runtime errors with compile-time checking
- **Component Reusability**: Reduce code duplication and improve maintainability
- **Better Debugging**: React DevTools and TypeScript diagnostics
- **Improved Testing**: Comprehensive test coverage with modern tools

### Performance Improvements
- **Smaller Bundle Size**: Preact's 3KB footprint vs larger frameworks
- **Better Tree Shaking**: Modern build tools eliminate unused code
- **Optimized Re-renders**: Preact signals for efficient updates
- **Enhanced PWA**: Advanced service worker capabilities

### User Experience
- **Preserved Design**: Maintain mobile-first responsive design
- **Smooth Animations**: Keep existing smooth transitions
- **Better Accessibility**: Improved keyboard navigation and screen reader support
- **Enhanced Offline**: More robust offline functionality

### Maintainability
- **Modular Architecture**: Easy to add new features and modify existing ones
- **Type Safety**: Reduce bugs and improve code confidence
- **Comprehensive Tests**: Ensure reliability across updates
- **Modern Practices**: Follow current web development standards

## Success Metrics

### Technical Metrics
- **Bundle Size**: Target <100KB total (currently ~80KB)
- **Performance**: Lighthouse score >90 (maintain current level)
- **Type Coverage**: >95% TypeScript coverage
- **Test Coverage**: >90% code coverage

### Quality Metrics
- **Zero Regressions**: All existing functionality preserved
- **Mobile Performance**: Maintain 60fps animations
- **PWA Standards**: Pass all PWA audits
- **Accessibility**: WCAG 2.1 AA compliance

### Development Metrics
- **Build Time**: <30 seconds for production builds
- **Development Speed**: <1 second hot reload
- **Code Quality**: Zero linting errors
- **Documentation**: Comprehensive component and API documentation

## Risk Assessment

### Low Risk
- **PWA Foundation**: Solid existing implementation
- **Build System**: Proven Vite + pnpm setup
- **Design System**: Well-established UI patterns

### Medium Risk
- **State Migration**: Ensuring data compatibility
- **Performance**: Maintaining current speed
- **Feature Parity**: Preserving all existing functionality

### High Risk
- **Complex Animations**: Preserving smooth dice rolling
- **Mobile Optimization**: Maintaining touch responsiveness
- **PWA Features**: Ensuring offline functionality

## Conclusion

This refactoring plan transforms the Risk Dice Battle application from a functional but monolithic codebase into a modern, maintainable, and scalable PWA. The chosen technology stack (Preact + TypeScript + UnoCSS) provides the optimal balance of performance, developer experience, and maintainability while preserving all existing functionality and user experience.

The phased approach minimizes risk while ensuring steady progress, with each phase building upon the previous foundation. The comprehensive testing strategy ensures reliability, while the modern architecture supports future growth and feature additions.

The end result will be a production-ready application that maintains its excellent user experience while providing a solid foundation for ongoing development and maintenance.
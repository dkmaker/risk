# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Risk Dice Battle - A single-page mobile-optimized implementation of Risk dice battles. Players set up 2-6 players with custom names and colors, then simulate dice battles between attackers and defenders following official Risk game rules.

## Architecture
Progressive Web App with modern structure:
- `index.html` - Main HTML file with PWA meta tags
- `src/styles.css` - CSS with military green theme (#4a5d3a)
- `src/main.js` - Game logic with ES6 modules and service worker registration
- `public/` - Static assets served directly
  - `manifest.json` - PWA manifest for installation
  - `sw.js` - Service worker for offline functionality
  - `icons/` - App icons (180px, 192px, 512px)
- `vite.config.js` - Vite configuration with public directory
- Local storage for persistent player data

## Key Game Flow
1. **Player Setup**: Configure 2-6 players with names and colors
2. **Attacker Selection**: Choose attacking player
3. **Defender Selection**: Choose defending player  
4. **Army Selection**: Select armies using button grid (1-50)
5. **Battle Screen**: Roll dice with visual feedback and army loss tracking

## Core Game State
```javascript
let players = [];  // Stored in localStorage
let gameState = {
    attacker: { playerIndex, color, name, armies, initialArmies, page },
    defender: { playerIndex, color, name, armies, initialArmies, page }
};
```

## Screen Navigation System
- Each screen is a `<div class="screen">` with active state managed by CSS classes
- Navigation updates header icon contextually (⚔️ for attacker, 🛡️ for defender, both for battle)
- Auto-advance after army selection (no Next buttons)

## Mobile Optimization & PWA Features
- **PWA Support**: Installable with offline functionality
- **iOS Optimizations**: Safe area handling for notch, apple-mobile-web-app-capable
- **Viewport**: Prevents zooming with viewport-fit=cover
- **Touch UI**: Large buttons (min 80px height on mobile)
- **Responsive Grid**: 2-column army buttons on mobile, 5-column on desktop
- **Fixed Header**: Home/settings buttons with icon animations
- **Visual Feedback**: Card glow effects instead of floating indicators

## Risk Rules Implementation
- Attacker rolls max 3 dice (based on armies)
- Defender rolls max 2 dice (based on armies)
- Highest dice compared pairwise
- Defender wins ties
- Visual feedback:
  - Individual dice: Green border for winners, red for losers
  - Player cards: Green glow for round winner, red for loser, yellow for ties
  - Animated dice rolls with 1.1s delay before results

## Common Development Tasks

### Running the Development Server
```bash
pnpm dev
```
This starts Vite dev server on http://localhost:3000 with hot module replacement.

### Building for Production
```bash
pnpm build
```
Creates optimized production build in `dist/` directory.

### Preview Production Build
```bash
pnpm preview
```
Serves the production build locally for testing.

### Deployment
Push to main branch to automatically deploy to GitHub Pages via GitHub Actions.

### Testing Checklist
- Test on mobile viewport (375px width)
- Verify PWA installation on iOS/Android
- Test offline functionality after installation
- Verify local storage persistence
- Check screen transitions and header icon updates
- Ensure army button pagination works (1-10, 11-20, etc.)
- Test with different player counts (2-6 players)
- Verify card glow animations appear correctly
- Test safe area handling on iPhone with notch

## Important Implementation Details

### Visual Effects Timing
- Dice roll animation: 500ms
- Winner highlighting: 600ms delay
- Results display: 1100ms delay
- Card glow animation: 1500ms duration

### State Management
- `clearBattleScreen()` removes all visual effects and resets UI
- Card glow classes: `card-winner`, `card-loser`, `card-tie`
- Dice result classes: `winner`, `loser`

### PWA Configuration
- All paths must be relative (`./`) for Vite compatibility
- Service worker caches essential files for offline use
- Icons required: 180x180 (iOS), 192x192, 512x512 (PWA)
- Theme color: #4a5d3a (military green)
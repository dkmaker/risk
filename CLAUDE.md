# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
Risk Dice Battle - A single-page mobile-optimized implementation of Risk dice battles. Players set up 2-6 players with custom names and colors, then simulate dice battles between attackers and defenders following official Risk game rules.

## Architecture
Modern web application structure:
- `index.html` - Main HTML file with semantic structure
- `src/styles.css` - All CSS styles for responsive mobile-first design
- `src/main.js` - JavaScript game logic with ES6 modules
- `vite.config.js` - Vite configuration for dev server and build
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

## Mobile Optimization
- Viewport meta tag prevents zooming
- Touch-friendly button sizes (min 80px height on mobile)
- 2-column grid for army buttons on mobile, 5-column on desktop
- Fixed header with home/settings buttons

## Risk Rules Implementation
- Attacker rolls max 3 dice (based on armies)
- Defender rolls max 2 dice (based on armies)
- Highest dice compared pairwise
- Defender wins ties
- Visual feedback shows winners/losers per die

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
- Verify local storage persistence
- Check screen transitions and header icon updates
- Ensure army button pagination works (1-10, 11-20, etc.)
- Test with different player counts (2-6 players)
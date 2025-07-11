# Risk Dice Battle

A mobile-optimized Progressive Web App (PWA) for Risk dice battles. Roll dice, track armies, and battle with style!

## Features

- **Progressive Web App**: Install on your phone's home screen for a native app experience
- **Offline Support**: Play without an internet connection
- **2-6 Players**: Customizable player names and official Risk colors
- **Visual Battle Feedback**: Card glow effects show winners (green), losers (red), and ties (yellow)
- **Mobile-First Design**: Optimized for phones and tablets with touch-friendly controls
- **Persistent Players**: Names saved between sessions
- **Authentic Risk Rules**: Proper dice mechanics with defender winning ties

## Installation

### As a PWA on iPhone/iOS:
1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Name it and tap "Add"

### As a PWA on Android:
1. Open the app in Chrome
2. Tap the menu (3 dots)
3. Tap "Install app" or "Add to Home Screen"

## Development

### Prerequisites
- Node.js 18+
- pnpm

### Setup
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Deployment
Push to the main branch to automatically deploy via GitHub Actions to GitHub Pages.

## Game Flow

1. **Setup Players**: Enter names for 2-6 players
2. **Select Attacker**: Choose who's attacking
3. **Select Defender**: Choose who's defending
4. **Choose Armies**: Select army count (1-50) using button grid
5. **Battle**: Roll dice and see visual results with card glow effects
6. **Continue or Withdraw**: Keep battling or start a new game

## Technologies

- Vanilla JavaScript (ES6 modules)
- CSS3 with animations
- Vite for development and building
- Service Worker for offline functionality
- Local Storage for data persistence

## License

MIT

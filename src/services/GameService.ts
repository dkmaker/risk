/**
 * GameService - Central game state management service
 * Handles core game logic, state transitions, and game flow
 */

import type { BattlePlayer, Player } from "../types/game";

export interface GameServiceState {
  players: Player[];
  currentScreen: string;
  attacker: BattlePlayer | null;
  defender: BattlePlayer | null;
  isGameActive: boolean;
}

export class GameService {
  private state: GameServiceState = {
    players: [],
    currentScreen: "setup",
    attacker: null,
    defender: null,
    isGameActive: false,
  };

  private listeners: Set<(state: GameServiceState) => void> = new Set();

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: GameServiceState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current state
   */
  getState(): GameServiceState {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  private setState(updates: Partial<GameServiceState>): void {
    this.state = { ...this.state, ...updates };
    for (const listener of this.listeners) {
      listener(this.getState());
    }
  }

  /**
   * Initialize game with players
   */
  initializeGame(players: Player[]): void {
    if (players.length < 2) {
      throw new Error("At least 2 players required to start game");
    }

    this.setState({
      players,
      currentScreen: "attacker-selection",
      isGameActive: true,
      attacker: null,
      defender: null,
    });
  }

  /**
   * Select attacker for battle
   */
  selectAttacker(playerIndex: number): void {
    if (!this.state.isGameActive) {
      throw new Error("Game not active");
    }

    const player = this.state.players[playerIndex];
    if (!player) {
      throw new Error("Invalid player index");
    }

    const attacker: BattlePlayer = {
      playerIndex,
      name: player.name,
      color: player.color,
      colorName: player.colorName,
      armies: 0,
      initialArmies: 0,
      page: 0,
    };

    this.setState({
      attacker,
      currentScreen: "defender-selection",
    });
  }

  /**
   * Select defender for battle
   */
  selectDefender(playerIndex: number): void {
    const isGameInactive = !this.state.isGameActive;
    const noAttackerSelected = !this.state.attacker;
    const samePlayerAsAttacker =
      this.state.attacker && playerIndex === this.state.attacker.playerIndex;

    if (isGameInactive || noAttackerSelected) {
      throw new Error("Invalid game state for defender selection");
    }

    if (samePlayerAsAttacker) {
      throw new Error("Defender cannot be the same as attacker");
    }

    const player = this.state.players[playerIndex];
    if (!player) {
      throw new Error("Invalid player index");
    }

    const defender: BattlePlayer = {
      playerIndex,
      name: player.name,
      color: player.color,
      colorName: player.colorName,
      armies: 0,
      initialArmies: 0,
      page: 0,
    };

    this.setState({
      defender,
      currentScreen: "attacker-armies",
    });
  }

  /**
   * Set attacker army count
   */
  setAttackerArmies(count: number): void {
    const noAttackerSelected = !this.state.attacker;
    const invalidArmyCount = count < 1 || count > 50;

    if (noAttackerSelected) {
      throw new Error("No attacker selected");
    }

    if (invalidArmyCount) {
      throw new Error("Army count must be between 1 and 50");
    }

    if (!this.state.attacker) {
      throw new Error("No attacker selected");
    }

    this.setState({
      attacker: {
        ...this.state.attacker,
        armies: count,
        initialArmies: count,
      },
      currentScreen: "defender-armies",
    });
  }

  /**
   * Set defender army count
   */
  setDefenderArmies(count: number): void {
    const noDefenderSelected = !this.state.defender;
    const invalidArmyCount = count < 1 || count > 50;

    if (noDefenderSelected) {
      throw new Error("No defender selected");
    }

    if (invalidArmyCount) {
      throw new Error("Army count must be between 1 and 50");
    }

    if (!this.state.defender) {
      throw new Error("No defender selected");
    }

    this.setState({
      defender: {
        ...this.state.defender,
        armies: count,
        initialArmies: count,
      },
      currentScreen: "battle",
    });
  }

  /**
   * Update army counts after battle round
   */
  updateArmyCounts(attackerLoss: number, defenderLoss: number): void {
    const invalidBattleState = !(this.state.attacker && this.state.defender);

    if (invalidBattleState) {
      throw new Error("Invalid battle state");
    }

    if (!(this.state.attacker && this.state.defender)) {
      throw new Error("Invalid battle state");
    }

    const newAttacker = {
      ...this.state.attacker,
      armies: this.state.attacker.armies - attackerLoss,
    };

    const newDefender = {
      ...this.state.defender,
      armies: this.state.defender.armies - defenderLoss,
    };

    this.setState({
      attacker: newAttacker,
      defender: newDefender,
    });
  }

  /**
   * Check if battle is over
   */
  isBattleOver(): boolean {
    if (!(this.state.attacker && this.state.defender)) {
      return false;
    }

    const attackerDefeated = this.state.attacker.armies < 1;
    const defenderDefeated = this.state.defender.armies === 0;

    return attackerDefeated || defenderDefeated;
  }

  /**
   * Get battle winner
   */
  getBattleWinner(): "attacker" | "defender" | null {
    if (!(this.isBattleOver() && this.state.attacker && this.state.defender)) {
      return null;
    }

    const defenderDefeated = this.state.defender.armies === 0;

    return defenderDefeated ? "attacker" : "defender";
  }

  /**
   * Reset game to initial state
   */
  resetGame(): void {
    this.setState({
      players: [],
      currentScreen: "setup",
      attacker: null,
      defender: null,
      isGameActive: false,
    });
  }

  /**
   * Withdraw from battle (attacker surrenders)
   */
  withdraw(): void {
    if (!this.state.isGameActive) {
      throw new Error("No active battle to withdraw from");
    }

    this.setState({
      currentScreen: "attacker-selection",
      attacker: null,
      defender: null,
    });
  }

  /**
   * Navigate to specific screen
   */
  navigateToScreen(screen: string): void {
    this.setState({ currentScreen: screen });
  }

  /**
   * Navigate back to player setup while preserving existing players
   */
  goToPlayerSetup(): void {
    this.setState({
      currentScreen: "setup",
      attacker: null,
      defender: null,
      isGameActive: false,
    });
  }

  /**
   * Start a new battle with existing players (preserves players)
   */
  startNewBattle(): void {
    if (this.state.players.length < 2) {
      throw new Error("At least 2 players required to start new battle");
    }

    this.setState({
      currentScreen: "attacker-selection",
      attacker: null,
      defender: null,
      isGameActive: true,
    });
  }
}

// Singleton instance
export const gameService = new GameService();

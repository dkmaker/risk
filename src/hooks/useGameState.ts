/**
 * useGameState - Custom hook for managing central game state
 * Provides reactive interface to GameService with automatic re-renders
 */

import { useEffect, useState } from "preact/hooks";
import { type GameServiceState, gameService } from "../services/GameService";
import type { Player } from "../types/game";

export function useGameState() {
  const [state, setState] = useState<GameServiceState>(gameService.getState());

  useEffect(() => {
    const unsubscribe = gameService.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    // State
    players: state.players,
    currentScreen: state.currentScreen,
    attacker: state.attacker,
    defender: state.defender,
    isGameActive: state.isGameActive,

    // Actions
    initializeGame: (players: Player[]) => gameService.initializeGame(players),
    selectAttacker: (playerIndex: number) => gameService.selectAttacker(playerIndex),
    selectDefender: (playerIndex: number) => gameService.selectDefender(playerIndex),
    setAttackerArmies: (count: number) => gameService.setAttackerArmies(count),
    setDefenderArmies: (count: number) => gameService.setDefenderArmies(count),
    updateArmyCounts: (attackerLoss: number, defenderLoss: number) =>
      gameService.updateArmyCounts(attackerLoss, defenderLoss),
    isBattleOver: () => gameService.isBattleOver(),
    getBattleWinner: () => gameService.getBattleWinner(),
    resetGame: () => gameService.resetGame(),
    withdraw: () => gameService.withdraw(),
    navigateToScreen: (screen: string) => gameService.navigateToScreen(screen),
    goToPlayerSetup: () => gameService.goToPlayerSetup(),
    startNewBattle: () => gameService.startNewBattle(),
  };
}

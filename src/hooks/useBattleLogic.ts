/**
 * useBattleLogic - Custom hook for battle mechanics
 * Provides interface to BattleService with state management for battle rounds
 */

import { useState } from "preact/hooks";
import { type DiceComparisonResult, battleService } from "../services/BattleService";

export interface BattleState {
  lastResult: DiceComparisonResult | null;
  roundHistory: DiceComparisonResult[];
}

export function useBattleLogic() {
  const [battleState, setBattleState] = useState<BattleState>({
    lastResult: null,
    roundHistory: [],
  });

  /**
   * Execute a battle round
   */
  const rollDice = async (
    attackerArmies: number,
    defenderArmies: number,
    onComplete?: (result: DiceComparisonResult) => void
  ): Promise<DiceComparisonResult> => {
    const result = battleService.executeBattleRound(attackerArmies, defenderArmies);

    setBattleState((prev) => ({
      ...prev,
      lastResult: result,
      roundHistory: [...prev.roundHistory, result],
    }));

    onComplete?.(result);
    return result;
  };

  /**
   * Reset battle state
   */
  const resetBattle = (): void => {
    setBattleState({
      lastResult: null,
      roundHistory: [],
    });
  };

  /**
   * Get formatted battle result message
   */
  const formatResult = (
    result: DiceComparisonResult,
    attackerName: string,
    defenderName: string
  ): string => {
    return battleService.formatBattleResult(result, attackerName, defenderName);
  };

  /**
   * Calculate battle odds
   */
  const calculateOdds = (attackerArmies: number, defenderArmies: number) => {
    return battleService.calculateBattleOdds(attackerArmies, defenderArmies);
  };

  /**
   * Simulate complete battle
   */
  const simulateCompleteBattle = (attackerArmies: number, defenderArmies: number) => {
    return battleService.simulateCompleteBattle(attackerArmies, defenderArmies);
  };

  /**
   * Get dice display data for current result
   */
  const getDiceDisplay = () => {
    if (!battleState.lastResult) {
      return null;
    }

    const { attackerDice, defenderDice } = battleState.lastResult;

    return {
      attackerDice: attackerDice.map((value: number) => ({
        value,
      })),
      defenderDice: defenderDice.map((value: number) => ({
        value,
      })),
    };
  };

  /**
   * Check if battle round can be executed
   */
  const canRoll = (): boolean => {
    return true;
  };

  return {
    // State
    ...battleState,

    // Actions
    rollDice,
    resetBattle,
    formatResult,
    calculateOdds,
    simulateCompleteBattle,
    getDiceDisplay,
    canRoll,

    // Computed
    hasResults: battleState.lastResult !== null,
    totalRounds: battleState.roundHistory.length,
  };
}

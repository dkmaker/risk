/**
 * useBattleLogic - Custom hook for battle mechanics and dice rolling
 * Provides interface to BattleService with state management for battle rounds
 */

import { useState } from "preact/hooks";
import { type DiceComparisonResult, battleService } from "../services/BattleService";

export interface BattleState {
  isRolling: boolean;
  lastResult: DiceComparisonResult | null;
  roundHistory: DiceComparisonResult[];
  animationPhase: "idle" | "rolling" | "showing-results" | "complete";
}

export function useBattleLogic() {
  const [battleState, setBattleState] = useState<BattleState>({
    isRolling: false,
    lastResult: null,
    roundHistory: [],
    animationPhase: "idle",
  });

  /**
   * Execute a battle round with animation timing
   */
  const rollDice = async (
    attackerArmies: number,
    defenderArmies: number,
    onComplete?: (result: DiceComparisonResult) => void
  ): Promise<DiceComparisonResult> => {
    setBattleState((prev) => ({
      ...prev,
      isRolling: true,
      animationPhase: "rolling",
    }));

    // Simulate dice rolling animation delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = battleService.executeBattleRound(attackerArmies, defenderArmies);

    setBattleState((prev) => ({
      ...prev,
      isRolling: false,
      lastResult: result,
      roundHistory: [...prev.roundHistory, result],
      animationPhase: "showing-results",
    }));

    // Show results phase
    await new Promise((resolve) => setTimeout(resolve, 600));

    setBattleState((prev) => ({
      ...prev,
      animationPhase: "complete",
    }));

    // Final delay before enabling next roll
    setTimeout(() => {
      setBattleState((prev) => ({
        ...prev,
        animationPhase: "idle",
      }));
      onComplete?.(result);
    }, 500);

    return result;
  };

  /**
   * Reset battle state
   */
  const resetBattle = (): void => {
    setBattleState({
      isRolling: false,
      lastResult: null,
      roundHistory: [],
      animationPhase: "idle",
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

    const { attackerDice, defenderDice, comparisons } = battleState.lastResult;

    return {
      attackerDice: attackerDice.map((value, index) => ({
        value,
        isWinner: comparisons[index]?.winner === "attacker",
      })),
      defenderDice: defenderDice.map((value, index) => ({
        value,
        isWinner: comparisons[index]?.winner === "defender",
      })),
    };
  };

  /**
   * Check if battle round can be executed
   */
  const canRoll = (): boolean => {
    return battleState.animationPhase === "idle" && !battleState.isRolling;
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

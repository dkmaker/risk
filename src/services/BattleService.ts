/**
 * BattleService - Handles dice rolling and battle logic
 * Implements official Risk game rules for dice battles
 */

export interface DiceComparisonResult {
  attackerDice: number[];
  defenderDice: number[];
  attackerLosses: number;
  defenderLosses: number;
  comparisons: Array<{
    attackerDie: number;
    defenderDie: number;
    winner: "attacker" | "defender";
  }>;
}

export class BattleService {
  /**
   * Roll a single die (1-6)
   */
  private rollDie(): number {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Roll multiple dice and sort in descending order
   */
  private rollDice(count: number): number[] {
    const dice: number[] = [];
    for (let i = 0; i < count; i++) {
      dice.push(this.rollDie());
    }
    return dice.sort((a, b) => b - a); // Sort descending
  }

  /**
   * Calculate number of dice for attacker based on army count
   * Attacker rolls min(armies, 3) dice
   */
  private getAttackerDiceCount(armies: number): number {
    return Math.min(armies, 3);
  }

  /**
   * Calculate number of dice for defender based on army count
   * Defender rolls min(armies, 2) dice
   */
  private getDefenderDiceCount(armies: number): number {
    return Math.min(armies, 2);
  }

  /**
   * Compare dice and determine losses according to Risk rules
   * - Highest dice are compared pairwise
   * - Defender wins ties
   * - Each comparison results in one army loss
   */
  private compareDice(attackerDice: number[], defenderDice: number[]): DiceComparisonResult {
    const comparisons: Array<{
      attackerDie: number;
      defenderDie: number;
      winner: "attacker" | "defender";
    }> = [];

    let attackerLosses = 0;
    let defenderLosses = 0;

    // Compare dice pairwise (highest vs highest, second-highest vs second-highest)
    const comparisonCount = Math.min(attackerDice.length, defenderDice.length);

    for (let i = 0; i < comparisonCount; i++) {
      const attackerDie = attackerDice[i]!;
      const defenderDie = defenderDice[i]!;
      const winner = attackerDie > defenderDie ? "attacker" : "defender";

      comparisons.push({
        attackerDie,
        defenderDie,
        winner,
      });

      if (winner === "attacker") {
        defenderLosses++;
      } else {
        attackerLosses++;
      }
    }

    return {
      attackerDice,
      defenderDice,
      attackerLosses,
      defenderLosses,
      comparisons,
    };
  }

  /**
   * Execute a complete battle round
   */
  executeBattleRound(attackerArmies: number, defenderArmies: number): DiceComparisonResult {
    if (attackerArmies < 1) {
      throw new Error("Attacker must have at least 1 army");
    }
    if (defenderArmies < 1) {
      throw new Error("Defender must have at least 1 army");
    }

    const attackerDiceCount = this.getAttackerDiceCount(attackerArmies);
    const defenderDiceCount = this.getDefenderDiceCount(defenderArmies);

    const attackerDice = this.rollDice(attackerDiceCount);
    const defenderDice = this.rollDice(defenderDiceCount);

    return this.compareDice(attackerDice, defenderDice);
  }

  /**
   * Simulate a complete battle until one side has no armies
   * Returns the complete battle history
   */
  simulateCompleteBattle(
    initialAttackerArmies: number,
    initialDefenderArmies: number
  ): {
    rounds: DiceComparisonResult[];
    winner: "attacker" | "defender";
    finalAttackerArmies: number;
    finalDefenderArmies: number;
  } {
    const rounds: DiceComparisonResult[] = [];
    let attackerArmies = initialAttackerArmies;
    let defenderArmies = initialDefenderArmies;

    while (attackerArmies >= 1 && defenderArmies > 0) {
      const result = this.executeBattleRound(attackerArmies, defenderArmies);
      rounds.push(result);

      attackerArmies -= result.attackerLosses;
      defenderArmies -= result.defenderLosses;
    }

    const winner = defenderArmies === 0 ? "attacker" : "defender";

    return {
      rounds,
      winner,
      finalAttackerArmies: attackerArmies,
      finalDefenderArmies: defenderArmies,
    };
  }

  /**
   * Calculate battle statistics for given army counts
   */
  calculateBattleOdds(
    attackerArmies: number,
    defenderArmies: number,
    simulations = 10000
  ): {
    attackerWinRate: number;
    defenderWinRate: number;
    averageAttackerSurvivors: number;
    averageDefenderSurvivors: number;
  } {
    let attackerWins = 0;
    let totalAttackerSurvivors = 0;
    let totalDefenderSurvivors = 0;

    for (let i = 0; i < simulations; i++) {
      const result = this.simulateCompleteBattle(attackerArmies, defenderArmies);

      if (result.winner === "attacker") {
        attackerWins++;
      }

      totalAttackerSurvivors += result.finalAttackerArmies;
      totalDefenderSurvivors += result.finalDefenderArmies;
    }

    return {
      attackerWinRate: attackerWins / simulations,
      defenderWinRate: (simulations - attackerWins) / simulations,
      averageAttackerSurvivors: totalAttackerSurvivors / simulations,
      averageDefenderSurvivors: totalDefenderSurvivors / simulations,
    };
  }

  /**
   * Format battle result for display
   */
  formatBattleResult(
    result: DiceComparisonResult,
    attackerName: string,
    defenderName: string
  ): string {
    const { attackerLosses, defenderLosses } = result;

    if (attackerLosses > defenderLosses) {
      return `${defenderName} wins this round! ${attackerName} loses ${attackerLosses} ${attackerLosses === 1 ? "army" : "armies"}.`;
    } else if (defenderLosses > attackerLosses) {
      return `${attackerName} wins this round! ${defenderName} loses ${defenderLosses} ${defenderLosses === 1 ? "army" : "armies"}.`;
    } else {
      return `Tie round! Both players lose ${attackerLosses} ${attackerLosses === 1 ? "army" : "armies"}.`;
    }
  }
}

// Singleton instance
export const battleService = new BattleService();

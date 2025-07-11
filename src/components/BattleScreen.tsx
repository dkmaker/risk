/**
 * BattleScreen - Main battle interface with dice rolling
 * Implements the complete Risk battle system with visual feedback
 */

import { useEffect, useState } from "preact/hooks";
import { useBattleLogic } from "../hooks/useBattleLogic";
import { useGameState } from "../hooks/useGameState";
import { useTranslation } from "../hooks/useTranslation";
import type { DiceComparisonResult } from "../services/BattleService";
import Button from "./shared/Button";

interface PlayerCardProps {
  playerName: string;
  playerColor: string;
  armies: number;
  initialArmies: number;
}

interface DiceValue {
  value: number;
}

interface DiceState {
  attackerDice: DiceValue[];
  defenderDice: DiceValue[];
}

function PlayerCard({ playerName, playerColor, armies, initialArmies }: PlayerCardProps) {
  return (
    <div className="player-card" style={{ backgroundColor: playerColor }}>
      <div className="player-name">{playerName}</div>
      <div className="army-count">
        <span className="current-armies">{armies}</span>
        <span className="total-armies">/ {initialArmies}</span>
      </div>
    </div>
  );
}

// Helper functions to reduce complexity
function generateRandomDice(count: number): DiceValue[] {
  return Array.from({ length: count }, () => ({
    value: Math.floor(Math.random() * 6) + 1,
  }));
}

function generateDefaultDiceState(): DiceState {
  return {
    attackerDice: generateRandomDice(3),
    defenderDice: generateRandomDice(2),
  };
}

export default function BattleScreen() {
  const { t } = useTranslation();
  const {
    attacker,
    defender,
    updateArmyCounts,
    isBattleOver,
    getBattleWinner,
    withdraw,
    startNewBattle,
    goToPlayerSetup,
  } = useGameState();

  const { rollDice, resetBattle, formatResult, getDiceDisplay, canRoll } = useBattleLogic();

  const [resultMessage, setResultMessage] = useState<string>("");
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [defaultDice, setDefaultDice] = useState<DiceState | null>(null);

  // Reset battle state when component mounts and show initial dice
  // biome-ignore lint/correctness/useExhaustiveDependencies: We only want this to run once on mount
  useEffect(() => {
    resetBattle();
    setResultMessage("Touch dice to roll!");
    // Generate initial dice state only once on mount
    if (!defaultDice) {
      setDefaultDice(generateDefaultDiceState());
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  if (!(attacker && defender)) {
    return (
      <div className="screen-layout">
        <div className="screen-header">
          <h1>{t("battleError")}</h1>
        </div>
        <div className="screen-content">
          <p>{t("battleSetupError")}</p>
        </div>
        <div className="screen-footer">
          <Button onClick={goToPlayerSetup}>{t("backToSetup")}</Button>
        </div>
      </div>
    );
  }

  const handleBattleResult = (result: DiceComparisonResult) => {
    // Update army counts
    updateArmyCounts(result.attackerLosses, result.defenderLosses);

    // Set result message
    const message = formatResult(result, attacker?.name ?? "", defender?.name ?? "");
    setResultMessage(message);

    // Determine round winner for card glow effects

    // Check if battle is over
    setTimeout(() => {
      if (!isBattleOver()) {
        return;
      }

      const winner = getBattleWinner();
      const winnerName = winner === "attacker" ? (attacker?.name ?? "") : (defender?.name ?? "");
      const messageKey = winner === "attacker" ? "attackerWins" : "defenderWins";
      setResultMessage(t(messageKey).replace("{{name}}", winnerName));
    }, 100);
  };

  const handleRollDice = async () => {
    if (!(canRollDice && attacker && defender)) {
      return;
    }

    try {
      setResultMessage(t("rolling"));

      await rollDice(attacker.armies, defender.armies, handleBattleResult);
    } catch (error) {
      console.error("Battle error:", error);
      setResultMessage(t("battleError"));
    }
  };

  const handleWithdraw = () => {
    if (showWithdrawConfirmation) {
      withdraw();
      setShowWithdrawConfirmation(false);
      return;
    }

    setShowWithdrawConfirmation(true);
    setTimeout(() => setShowWithdrawConfirmation(false), 3000);
  };

  const handleNewBattle = () => startNewBattle();

  const diceDisplay = getDiceDisplay();
  const battleIsOver = isBattleOver();
  const canRollDice = canRoll() && !battleIsOver;
  const currentDiceDisplay = diceDisplay || defaultDice;

  return (
    <div className="screen-layout battle-screen">
      <div className="player-info">
        <PlayerCard
          playerName={attacker.name}
          playerColor={attacker.color}
          armies={attacker.armies}
          initialArmies={attacker.initialArmies}
        />

        <PlayerCard
          playerName={defender.name}
          playerColor={defender.color}
          armies={defender.armies}
          initialArmies={defender.initialArmies}
        />
      </div>

      {/* Dice Display */}
      <button
        className="dice-container"
        onClick={canRollDice ? handleRollDice : undefined}
        style={{ cursor: canRollDice ? "pointer" : "default" }}
        disabled={!canRollDice}
        aria-label={canRollDice ? t("rollDice") : t("battleOver")}
        type="button"
      >
        {currentDiceDisplay && (
          <div className="dice-display">
            <div className="dice-row">
              {currentDiceDisplay.attackerDice.map((die, index) => (
                <div
                  key={`attacker-die-${index}-${die.value}`}
                  className="die attacker-die"
                  style={{
                    backgroundColor: "#e74c3c",
                    color: "white",
                    borderColor: "#c0392b",
                  }}
                >
                  {die.value}
                </div>
              ))}
            </div>
            <div className="vs-divider">VS</div>
            <div className="dice-row">
              {currentDiceDisplay.defenderDice.map((die, index) => (
                <div
                  key={`defender-die-${index}-${die.value}`}
                  className="die defender-die"
                  style={{
                    backgroundColor: "#3498db",
                    color: "white",
                    borderColor: "#2980b9",
                  }}
                >
                  {die.value}
                </div>
              ))}
            </div>
          </div>
        )}
      </button>

      {/* Controls Section */}
      <div className="battle-controls">
        {/* Result Message */}
        <div className="result-message">
          <p>{resultMessage}</p>
        </div>

        {/* Action Buttons */}
        <div className="button-container">
          {battleIsOver ? (
            <Button onClick={handleNewBattle} variant="primary" size="large">
              {t("newBattle")}
            </Button>
          ) : (
            <Button
              onClick={handleWithdraw}
              variant={showWithdrawConfirmation ? "danger" : "secondary"}
              size="large"
            >
              {showWithdrawConfirmation ? t("confirmWithdraw") : t("withdraw")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

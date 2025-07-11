/**
 * BattleScreen - Main battle interface with dice rolling and animations
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
  isWinner?: boolean;
  isLoser?: boolean;
  isTie?: boolean;
}

function PlayerCard({
  playerName,
  playerColor,
  armies,
  initialArmies,
  isWinner,
  isLoser,
  isTie,
}: PlayerCardProps) {
  let cardClass = "player-card";
  if (isWinner) cardClass += " card-winner";
  if (isLoser) cardClass += " card-loser";
  if (isTie) cardClass += " card-tie";

  return (
    <div className={cardClass} style={{ backgroundColor: playerColor }}>
      <div className="player-name">{playerName}</div>
      <div className="army-count">
        <span className="current-armies">{armies}</span>
        <span className="total-armies">/ {initialArmies}</span>
      </div>
    </div>
  );
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

  const { rollDice, resetBattle, formatResult, getDiceDisplay, canRoll, isRolling } =
    useBattleLogic();

  const [resultMessage, setResultMessage] = useState<string>("");
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [roundWinner, setRoundWinner] = useState<"attacker" | "defender" | "tie" | null>(null);
  const [defaultDice, setDefaultDice] = useState<{
    attackerDice: Array<{ value: number; isWinner: boolean }>;
    defenderDice: Array<{ value: number; isWinner: boolean }>;
  } | null>(null);
  const [rollingDice, setRollingDice] = useState<{
    attackerDice: Array<{ value: number; isWinner: boolean }>;
    defenderDice: Array<{ value: number; isWinner: boolean }>;
  } | null>(null);

  // Reset battle state when component mounts and show initial dice
  useEffect(() => {
    resetBattle();
    setResultMessage("Touch dice to roll!");
    setRoundWinner(null);
    // Set default dice
    setDefaultDice({
      attackerDice: [
        { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
        { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
        { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
      ],
      defenderDice: [
        { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
        { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
      ],
    });
  }, []);

  // Update dice numbers rapidly during rolling animation
  useEffect(() => {
    let interval: number;

    if (isRolling) {
      interval = setInterval(() => {
        setRollingDice({
          attackerDice: [
            { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
            { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
            { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
          ],
          defenderDice: [
            { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
            { value: Math.floor(Math.random() * 6) + 1, isWinner: false },
          ],
        });
      }, 100); // Change numbers every 100ms
    } else {
      setRollingDice(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRolling]);

  if (!attacker || !defender) {
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

  const handleRollDice = async () => {
    if (!canRollDice || !attacker || !defender) return;

    try {
      setRoundWinner(null);
      setResultMessage(t("rolling"));

      // Initialize rolling dice with current values to prevent blinking
      const currentDisplay = diceDisplay || defaultDice;
      if (currentDisplay) {
        setRollingDice(currentDisplay);
      }

      await rollDice(attacker.armies, defender.armies, (result: DiceComparisonResult) => {
        // Update army counts
        updateArmyCounts(result.attackerLosses, result.defenderLosses);

        // Set result message
        const message = formatResult(result, attacker.name, defender.name);
        setResultMessage(message);

        // Determine round winner for card glow effects
        if (result.attackerLosses > result.defenderLosses) {
          setRoundWinner("defender");
        } else if (result.defenderLosses > result.attackerLosses) {
          setRoundWinner("attacker");
        } else {
          setRoundWinner("tie");
        }

        // Check if battle is over
        setTimeout(() => {
          if (isBattleOver()) {
            const winner = getBattleWinner();
            if (winner === "attacker") {
              setResultMessage(t("attackerWins").replace("{{name}}", attacker.name));
            } else {
              setResultMessage(t("defenderWins").replace("{{name}}", defender.name));
            }
          }
        }, 100);
      });
    } catch (error) {
      console.error("Battle error:", error);
      setResultMessage(t("battleError"));
    }
  };

  const handleWithdraw = () => {
    if (showWithdrawConfirmation) {
      withdraw();
      setShowWithdrawConfirmation(false);
    } else {
      setShowWithdrawConfirmation(true);
      setTimeout(() => setShowWithdrawConfirmation(false), 3000);
    }
  };

  const handleNewBattle = () => {
    startNewBattle();
  };

  const diceDisplay = getDiceDisplay();
  const battleIsOver = isBattleOver();
  const canRollDice = canRoll() && !battleIsOver;
  const currentDiceDisplay = isRolling ? rollingDice : diceDisplay || defaultDice;

  return (
    <div className="screen-layout battle-screen">
      <div className="player-info">
        <PlayerCard
          playerName={attacker.name}
          playerColor={attacker.color}
          armies={attacker.armies}
          initialArmies={attacker.initialArmies}
          isWinner={roundWinner === "attacker"}
          isLoser={roundWinner === "defender"}
          isTie={roundWinner === "tie"}
        />

        <PlayerCard
          playerName={defender.name}
          playerColor={defender.color}
          armies={defender.armies}
          initialArmies={defender.initialArmies}
          isWinner={roundWinner === "defender"}
          isLoser={roundWinner === "attacker"}
          isTie={roundWinner === "tie"}
        />
      </div>

      {/* Dice Display */}
      <div
        className="dice-container"
        onClick={canRollDice ? handleRollDice : undefined}
        style={{ cursor: canRollDice ? "pointer" : "default" }}
      >
        {currentDiceDisplay && (
          <div className="dice-display">
            <div className="dice-row">
              {currentDiceDisplay.attackerDice.map((die, index) => (
                <div
                  key={index}
                  className={`die attacker-die ${die.isWinner ? "winner" : ""} ${isRolling ? "rolling" : ""}`}
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
                  key={index}
                  className={`die defender-die ${die.isWinner ? "winner" : ""} ${isRolling ? "rolling" : ""}`}
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
      </div>

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

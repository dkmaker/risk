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

interface DiceDisplayProps {
  dice: Array<{ value: number; isWinner: boolean }>;
  label: string;
  playerColor: string;
}

function DiceDisplay({ dice, label, playerColor }: DiceDisplayProps) {
  return (
    <div className="dice-section">
      <h3 className="dice-label" style={{ color: playerColor }}>
        {label}
      </h3>
      <div className="dice-row">
        {dice.map((die, index) => (
          <div
            key={index}
            className={`die ${die.isWinner ? "winner" : "loser"}`}
            style={{
              borderColor: die.isWinner ? "#2ecc71" : "#e74c3c",
            }}
          >
            {die.value}
          </div>
        ))}
      </div>
    </div>
  );
}

interface PlayerCardProps {
  playerName: string;
  playerColor: string;
  armies: number;
  initialArmies: number;
  role: "attacker" | "defender";
  isWinner?: boolean;
  isLoser?: boolean;
  isTie?: boolean;
}

function PlayerCard({
  playerName,
  playerColor,
  armies,
  initialArmies,
  role,
  isWinner,
  isLoser,
  isTie,
}: PlayerCardProps) {
  const { t } = useTranslation();

  let cardClass = "player-card";
  if (isWinner) cardClass += " card-winner";
  if (isLoser) cardClass += " card-loser";
  if (isTie) cardClass += " card-tie";

  return (
    <div className={cardClass} style={{ backgroundColor: playerColor }}>
      <h3 className="player-role">{role === "attacker" ? t("attacker") : t("defender")}</h3>
      <div className="player-name">{playerName}</div>
      <div className="army-count">
        <span className="current-armies">{armies}</span>
        <span className="total-armies">/ {initialArmies}</span>
      </div>
      <div className="army-label">{t(armies === 1 ? "army" : "armies")}</div>
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
    resetGame,
  } = useGameState();

  const { rollDice, resetBattle, formatResult, getDiceDisplay, canRoll, isRolling } =
    useBattleLogic();

  const [resultMessage, setResultMessage] = useState<string>("");
  const [showWithdrawConfirmation, setShowWithdrawConfirmation] = useState(false);
  const [roundWinner, setRoundWinner] = useState<"attacker" | "defender" | "tie" | null>(null);

  // Reset battle state when component mounts
  useEffect(() => {
    resetBattle();
    setResultMessage(t("clickRollToStart"));
    setRoundWinner(null);
  }, []);

  if (!attacker || !defender) {
    return (
      <div className="screen active">
        <div className="screen-content">
          <h1>{t("battleError")}</h1>
          <p>{t("battleSetupError")}</p>
          <Button onClick={resetGame}>{t("backToSetup")}</Button>
        </div>
      </div>
    );
  }

  const handleRollDice = async () => {
    if (!canRoll() || !attacker || !defender) return;

    try {
      setRoundWinner(null);
      setResultMessage(t("rolling"));

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
    resetGame();
  };

  const diceDisplay = getDiceDisplay();
  const battleIsOver = isBattleOver();
  const canRollDice = canRoll() && !battleIsOver;

  return (
    <div className="screen active">
      <div className="screen-content">
        <h1>{t("battle")}</h1>

        <div className="player-info">
          <PlayerCard
            playerName={attacker.name}
            playerColor={attacker.color}
            armies={attacker.armies}
            initialArmies={attacker.initialArmies}
            role="attacker"
            isWinner={roundWinner === "attacker"}
            isLoser={roundWinner === "defender"}
            isTie={roundWinner === "tie"}
          />

          <PlayerCard
            playerName={defender.name}
            playerColor={defender.color}
            armies={defender.armies}
            initialArmies={defender.initialArmies}
            role="defender"
            isWinner={roundWinner === "defender"}
            isLoser={roundWinner === "attacker"}
            isTie={roundWinner === "tie"}
          />
        </div>

        {/* Dice Display */}
        <div className="dice-container">
          {diceDisplay && (
            <div className="dice-display">
              <DiceDisplay
                dice={diceDisplay.attackerDice}
                label={`${attacker.name} (${t("attacker")})`}
                playerColor={attacker.color}
              />
              <DiceDisplay
                dice={diceDisplay.defenderDice}
                label={`${defender.name} (${t("defender")})`}
                playerColor={defender.color}
              />
            </div>
          )}

          {isRolling && (
            <div className="rolling-animation">
              <div className="rolling-dice">🎲 🎲</div>
              <p>{t("rolling")}</p>
            </div>
          )}
        </div>

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
            <>
              <Button
                onClick={handleRollDice}
                disabled={!canRollDice}
                variant="primary"
                size="large"
              >
                {isRolling ? t("rolling") : t("rollDice")}
              </Button>

              <Button
                onClick={handleWithdraw}
                variant={showWithdrawConfirmation ? "danger" : "secondary"}
                size="large"
              >
                {showWithdrawConfirmation ? t("confirmWithdraw") : t("withdraw")}
              </Button>
            </>
          )}
        </div>

        {/* Battle Statistics */}
        <div className="battle-stats">
          <p>
            <strong>{attacker.name}:</strong> {attacker.armies} / {attacker.initialArmies}{" "}
            {t("armies")}
          </p>
          <p>
            <strong>{defender.name}:</strong> {defender.armies} / {defender.initialArmies}{" "}
            {t("armies")}
          </p>
        </div>
      </div>
    </div>
  );
}

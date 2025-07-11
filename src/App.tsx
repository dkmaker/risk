import { useEffect } from "preact/hooks";
import "virtual:uno.css";
import ArmySelection from "./components/ArmySelection";
import BattleScreen from "./components/BattleScreen";
import PlayerSelection from "./components/PlayerSelection";
import PlayerSetup from "./components/PlayerSetup";
import Header from "./components/shared/Header";
import { useGameState } from "./hooks/useGameState";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { t } from "./translations";
import type { HeaderIcon, Player } from "./types/game";

export default function App() {
  const {
    currentScreen,
    players,
    attacker,
    defender,
    initializeGame,
    selectAttacker,
    selectDefender,
    setAttackerArmies,
    setDefenderArmies,
    resetGame,
  } = useGameState();

  const { players: savedPlayers, isLoaded, savePlayers } = useLocalStorage();

  // Load saved players on startup
  useEffect(() => {
    if (isLoaded && savedPlayers.length >= 2) {
      initializeGame(savedPlayers);
    }
  }, [isLoaded, savedPlayers, initializeGame]);

  const getHeaderIcon = (): HeaderIcon => {
    switch (currentScreen) {
      case "setup":
        return "🎲";
      case "attacker-selection":
      case "attacker-armies":
        return "⚔️";
      case "defender-selection":
      case "defender-armies":
        return "🛡️";
      case "battle":
        return "battle";
      default:
        return "🎲";
    }
  };

  const handlePlayersReady = (newPlayers: Player[]) => {
    savePlayers(newPlayers);
    initializeGame(newPlayers);
  };

  const handleAttackerSelect = (_player: Player, index: number) => {
    selectAttacker(index);
  };

  const handleDefenderSelect = (_player: Player, index: number) => {
    selectDefender(index);
  };

  const handleAttackerArmySelect = (count: number) => {
    setAttackerArmies(count);
  };

  const handleDefenderArmySelect = (count: number) => {
    setDefenderArmies(count);
  };

  const handleHomeClick = () => {
    resetGame();
  };

  const handleSettingsClick = () => {
    alert("Settings coming in Phase 4!");
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "setup":
        return <PlayerSetup onPlayersReady={handlePlayersReady} existingPlayers={players} />;

      case "attacker-selection":
        return (
          <div className="screen active">
            <PlayerSelection
              players={players}
              title={t("whoIsAttacking")}
              onPlayerSelect={handleAttackerSelect}
            />
          </div>
        );

      case "defender-selection":
        return (
          <div className="screen active">
            <PlayerSelection
              players={players}
              title={t("whoIsDefending")}
              onPlayerSelect={handleDefenderSelect}
              {...(attacker?.playerIndex !== undefined && {
                excludePlayerIndex: attacker.playerIndex,
              })}
            />
          </div>
        );

      case "attacker-armies":
        return attacker ? (
          <ArmySelection
            playerName={attacker.name}
            playerColor={attacker.color}
            playerType="attacker"
            onArmySelect={handleAttackerArmySelect}
          />
        ) : null;

      case "defender-armies":
        return defender ? (
          <ArmySelection
            playerName={defender.name}
            playerColor={defender.color}
            playerType="defender"
            onArmySelect={handleDefenderArmySelect}
          />
        ) : null;

      case "battle":
        return <BattleScreen />;

      default:
        return <div>Screen not implemented yet</div>;
    }
  };

  return (
    <div className="app">
      <Header
        icon={getHeaderIcon()}
        onHomeClick={handleHomeClick}
        onSettingsClick={handleSettingsClick}
      />

      <main className="main-content">{renderCurrentScreen()}</main>

      <div className="phase-indicator">
        <strong>Phase 3: Game Logic Integration</strong>
        <br />
        Current Screen: {currentScreen}
      </div>
    </div>
  );
}

import { useEffect, useState } from "preact/hooks";
import "virtual:uno.css";
import "./styles/main.css";
import ArmySelection from "./components/ArmySelection";
import BattleScreen from "./components/BattleScreen";
import PlayerSelection from "./components/PlayerSelection";
import PlayerSetup from "./components/PlayerSetup";
import SettingsModal from "./components/SettingsModal";
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
  } = useGameState();

  const { players: savedPlayers, isLoaded, savePlayers } = useLocalStorage();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [manualNavigation, setManualNavigation] = useState(false);

  // Set dark theme as default
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  // Load saved players on startup - go to attacker selection if players exist
  useEffect(() => {
    if (isLoaded && savedPlayers.length >= 2 && currentScreen === "setup" && !manualNavigation) {
      // Auto-initialize game with saved players and go to attacker selection
      initializeGame(savedPlayers);
    }
  }, [isLoaded, savedPlayers, currentScreen, manualNavigation]);

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
    // Go back to attacker selection (start new battle)
    if (players.length >= 2) {
      setManualNavigation(true);
      initializeGame(players);
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleManualNavigation = () => {
    setManualNavigation(true);
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "setup":
        return <PlayerSetup onPlayersReady={handlePlayersReady} existingPlayers={savedPlayers} />;

      case "attacker-selection":
        return (
          <PlayerSelection
            players={players}
            title={t("whoIsAttacking")}
            onPlayerSelect={handleAttackerSelect}
          />
        );

      case "defender-selection":
        return (
          <PlayerSelection
            players={players}
            title={t("whoIsDefending")}
            onPlayerSelect={handleDefenderSelect}
            {...(attacker?.playerIndex !== undefined && {
              excludePlayerIndex: attacker.playerIndex,
            })}
          />
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onManualNavigation={handleManualNavigation}
      />
    </div>
  );
}

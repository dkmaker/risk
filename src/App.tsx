import { useState } from "preact/hooks";
import "virtual:uno.css";
import ArmySelection from "./components/ArmySelection";
import PlayerSelection from "./components/PlayerSelection";
import PlayerSetup from "./components/PlayerSetup";
import Header from "./components/shared/Header";
import { t } from "./translations";
import type { HeaderIcon, Player } from "./types/game";

type AppScreen =
  | "setup"
  | "attacker-selection"
  | "defender-selection"
  | "attacker-armies"
  | "defender-armies"
  | "battle";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedAttacker, setSelectedAttacker] = useState<Player | null>(null);
  const [selectedDefender, setSelectedDefender] = useState<Player | null>(null);
  const [attackerIndex, setAttackerIndex] = useState<number>(-1);
  const [attackerArmies, setAttackerArmies] = useState<number>(0);

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
    setPlayers(newPlayers);
    setCurrentScreen("attacker-selection");
  };

  const handleAttackerSelect = (player: Player, index: number) => {
    setSelectedAttacker(player);
    setAttackerIndex(index);
    setCurrentScreen("defender-selection");
  };

  const handleDefenderSelect = (player: Player, _index: number) => {
    setSelectedDefender(player);
    setCurrentScreen("attacker-armies");
  };

  const handleAttackerArmySelect = (count: number) => {
    setAttackerArmies(count);
    setCurrentScreen("defender-armies");
  };

  const handleDefenderArmySelect = (count: number) => {
    // In a real implementation, this would proceed to battle
    console.log("Battle ready!", {
      attacker: selectedAttacker?.name,
      attackerArmies,
      defender: selectedDefender?.name,
      defenderArmies: count,
    });
    alert(
      `Battle Setup Complete!\nAttacker: ${selectedAttacker?.name} (${attackerArmies} armies)\nDefender: ${selectedDefender?.name} (${count} armies)`
    );
  };

  const handleHomeClick = () => {
    setCurrentScreen("setup");
    setSelectedAttacker(null);
    setSelectedDefender(null);
    setAttackerIndex(-1);
    setAttackerArmies(0);
  };

  const handleSettingsClick = () => {
    alert("Settings coming in Phase 3!");
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
              excludePlayerIndex={attackerIndex}
            />
          </div>
        );

      case "attacker-armies":
        return selectedAttacker ? (
          <ArmySelection
            playerName={selectedAttacker.name}
            playerColor={selectedAttacker.color}
            playerType="attacker"
            onArmySelect={handleAttackerArmySelect}
          />
        ) : null;

      case "defender-armies":
        return selectedDefender ? (
          <ArmySelection
            playerName={selectedDefender.name}
            playerColor={selectedDefender.color}
            playerType="defender"
            onArmySelect={handleDefenderArmySelect}
          />
        ) : null;

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
        <strong>Phase 2: Component Migration Demo</strong>
        <br />
        Current Screen: {currentScreen}
      </div>
    </div>
  );
}

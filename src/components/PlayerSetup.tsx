import { useState } from "preact/hooks";
import { t } from "../translations";
import type { Player, PlayerColor, PlayerColorHex } from "../types/game";
import { PLAYER_COLOR_MAP } from "../types/game";
import Button from "./shared/Button";
import PlayerColorCard from "./shared/PlayerColorCard";

interface PlayerSetupProps {
  onPlayersReady: (players: Player[]) => void;
  existingPlayers?: Player[];
}

const PLAYER_COLORS: Array<{ key: PlayerColor; color: PlayerColorHex; nameKey: string }> = [
  { key: "red", color: PLAYER_COLOR_MAP.red, nameKey: "redPlayer" },
  { key: "blue", color: PLAYER_COLOR_MAP.blue, nameKey: "bluePlayer" },
  { key: "green", color: PLAYER_COLOR_MAP.green, nameKey: "greenPlayer" },
  { key: "yellow", color: PLAYER_COLOR_MAP.yellow, nameKey: "yellowPlayer" },
  { key: "black", color: PLAYER_COLOR_MAP.black, nameKey: "blackPlayer" },
  { key: "purple", color: PLAYER_COLOR_MAP.purple, nameKey: "purplePlayer" },
];

export default function PlayerSetup({ onPlayersReady, existingPlayers = [] }: PlayerSetupProps) {
  const [playerNames, setPlayerNames] = useState<Record<PlayerColor, string>>(() => {
    const initial: Record<PlayerColor, string> = {
      red: "",
      blue: "",
      green: "",
      yellow: "",
      black: "",
      purple: "",
    };

    // Restore existing player names
    existingPlayers.forEach((player) => {
      if (player.colorName && player.colorName in initial) {
        initial[player.colorName as PlayerColor] = player.name;
      }
    });

    return initial;
  });

  const handleNameChange = (colorKey: PlayerColor, name: string) => {
    setPlayerNames((prev) => ({
      ...prev,
      [colorKey]: name,
    }));
  };

  const handleSaveAndStart = () => {
    const players: Player[] = [];

    PLAYER_COLORS.forEach(({ key, color }) => {
      const name = playerNames[key].trim();
      if (name) {
        players.push({
          name,
          color,
          colorName: key,
        });
      }
    });

    if (players.length < 2) {
      alert(t("enterAtLeastTwoPlayers"));
      return;
    }

    onPlayersReady(players);
  };

  return (
    <div className="screen active" id="player-setup">
      <div className="screen-content">
        <div className="header-content">
          <h1 id="player-setup-title">{t("playerSetupTitle")}</h1>
          <h2 id="player-setup-subtitle">{t("playerSetupSubtitle")}</h2>
        </div>

        <div className="player-grid">
          {PLAYER_COLORS.map(({ key, color, nameKey }) => (
            <PlayerColorCard
              key={key}
              color={color}
              colorKey={key}
              placeholder={t(nameKey)}
              value={playerNames[key]}
              onChange={(name) => handleNameChange(key, name)}
            />
          ))}
        </div>

        <div className="button-row">
          <Button variant="primary" size="large" onClick={handleSaveAndStart} className="w-full">
            {t("saveAndStart")}
          </Button>
        </div>
      </div>
    </div>
  );
}

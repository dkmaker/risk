import { useEffect, useState } from "preact/hooks";
import { useTranslation } from "../hooks/useTranslation";
import type { Player, PlayerColor, PlayerColorHex } from "../types/game";
import { PLAYER_COLOR_MAP } from "../types/game";
import Button from "./shared/Button";
import PlayerColorCard from "./shared/PlayerColorCard";

interface PlayerSetupProps {
  onPlayersReady: (players: Player[]) => void;
  existingPlayers?: Player[];
}

const PLAYER_COLORS: Array<{
  key: PlayerColor;
  color: PlayerColorHex;
  nameKey: keyof typeof import("../translations/translations").translations.en;
}> = [
  { key: "red", color: PLAYER_COLOR_MAP.red, nameKey: "redPlayer" },
  { key: "blue", color: PLAYER_COLOR_MAP.blue, nameKey: "bluePlayer" },
  { key: "green", color: PLAYER_COLOR_MAP.green, nameKey: "greenPlayer" },
  { key: "yellow", color: PLAYER_COLOR_MAP.yellow, nameKey: "yellowPlayer" },
  { key: "black", color: PLAYER_COLOR_MAP.black, nameKey: "blackPlayer" },
  { key: "purple", color: PLAYER_COLOR_MAP.purple, nameKey: "purplePlayer" },
];

export default function PlayerSetup({ onPlayersReady, existingPlayers = [] }: PlayerSetupProps) {
  const { t } = useTranslation();
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
    for (const player of existingPlayers) {
      if (player.colorName && player.colorName in initial) {
        initial[player.colorName as PlayerColor] = player.name;
      }
    }

    return initial;
  });

  // Update player names when existingPlayers changes
  useEffect(() => {
    const updated: Record<PlayerColor, string> = {
      red: "",
      blue: "",
      green: "",
      yellow: "",
      black: "",
      purple: "",
    };

    // Restore existing player names
    for (const player of existingPlayers) {
      if (player.colorName && player.colorName in updated) {
        updated[player.colorName as PlayerColor] = player.name;
      }
    }

    setPlayerNames(updated);
  }, [existingPlayers]);

  const handleNameChange = (colorKey: PlayerColor, name: string) => {
    setPlayerNames((prev) => ({
      ...prev,
      [colorKey]: name,
    }));
  };

  const handleSaveAndStart = () => {
    const players: Player[] = [];

    for (const { key, color } of PLAYER_COLORS) {
      const name = playerNames[key].trim();
      if (name) {
        players.push({
          name,
          color,
          colorName: key,
        });
      }
    }

    if (players.length < 2) {
      alert(t("enterAtLeastTwoPlayers"));
      return;
    }

    onPlayersReady(players);
  };

  return (
    <div className="screen-layout" id="player-setup">
      <div className="screen-header">
        <h1 id="player-setup-title">{t("playerSetupTitle")}</h1>
        <h2 id="player-setup-subtitle">{t("playerSetupSubtitle")}</h2>
      </div>

      <div className="screen-content">
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
      </div>

      <div className="screen-footer">
        <Button variant="primary" size="large" onClick={handleSaveAndStart} className="w-full">
          {t("saveAndStart")}
        </Button>
      </div>
    </div>
  );
}

import type { Player } from "../types/game";
import Button from "./shared/Button";

interface PlayerSelectionProps {
  players: Player[];
  title: string;
  onPlayerSelect: (player: Player, index: number) => void;
  excludePlayerIndex?: number;
}

export default function PlayerSelection({
  players,
  title,
  onPlayerSelect,
  excludePlayerIndex,
}: PlayerSelectionProps) {
  const availablePlayers = players.filter((_, index) => index !== excludePlayerIndex);

  return (
    <div className="screen-content">
      <div className="header-content">
        <h1>{title}</h1>
      </div>

      <div className="player-selection-list" id="player-selection-list">
        {availablePlayers.map((player) => {
          // Find the original index in the full players array
          const playerIndex = players.findIndex((p) => p === player);

          return (
            <Button
              key={`${player.colorName}-${playerIndex}`}
              variant="primary"
              size="large"
              className="player-select-btn"
              onClick={() => onPlayerSelect(player, playerIndex)}
            >
              <span className="player-name-display">{player.name}</span>
              <div className="player-color-indicator" style={{ backgroundColor: player.color }} />
            </Button>
          );
        })}
      </div>
    </div>
  );
}

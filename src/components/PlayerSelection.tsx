import type { Player } from "../types/game";

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
    <div className="screen-layout">
      <div className="screen-header">
        <h1>{title}</h1>
      </div>

      <div className="screen-content">
        <div className="player-selection-grid">
          {availablePlayers.map((player) => {
            // Find the original index in the full players array
            const playerIndex = players.findIndex((p) => p === player);

            return (
              <button
                key={`${player.colorName}-${playerIndex}`}
                className="player-select-button"
                style={{ backgroundColor: player.color }}
                onClick={() => onPlayerSelect(player, playerIndex)}
              >
                {player.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

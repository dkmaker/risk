import type { PlayerColor } from "../../types/game";

interface PlayerColorCardProps {
  color: string;
  colorKey: PlayerColor;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PlayerColorCard({
  color,
  colorKey,
  placeholder,
  value,
  onChange,
}: PlayerColorCardProps) {
  const handleInputChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    onChange(target.value);
  };

  return (
    <div className="player-color-card" data-color={color}>
      <div
        className="color-swatch"
        style={{ backgroundColor: color }}
        role="img"
        aria-label={`${colorKey} color`}
      />
      <input
        type="text"
        className="player-name-on-card"
        data-player={colorKey}
        placeholder={placeholder}
        value={value}
        onInput={handleInputChange}
        maxLength={20}
        aria-label={`Enter name for ${colorKey} player`}
        id={`player-input-${colorKey}`}
      />
    </div>
  );
}

import { useState } from "preact/hooks";
import { t } from "../translations";
import type { PlayerColorHex } from "../types/game";
import Button from "./shared/Button";

interface ArmySelectionProps {
  playerName: string;
  playerColor: PlayerColorHex;
  playerType: "attacker" | "defender";
  onArmySelect: (count: number) => void;
  currentPage?: number;
  selectedArmies?: number;
}

export default function ArmySelection({
  playerName,
  playerColor,
  playerType,
  onArmySelect,
  currentPage = 0,
  selectedArmies = 0,
}: ArmySelectionProps) {
  const [page, setPage] = useState(currentPage);

  const handleArmySelect = (count: number) => {
    onArmySelect(count);
  };

  const handlePageChange = (direction: -1 | 1) => {
    const newPage = page + direction;
    if (newPage >= 0 && newPage <= 4) {
      setPage(newPage);
    }
  };

  const renderArmyButtons = () => {
    const buttons = [];

    if (page === 0) {
      // First page: 1-9, >
      for (let i = 1; i <= 9; i++) {
        buttons.push(
          <Button
            key={i}
            variant={selectedArmies === i ? "primary" : "secondary"}
            className={`army-btn ${selectedArmies === i ? "selected" : ""}`}
            onClick={() => handleArmySelect(i)}
          >
            {i}
          </Button>
        );
      }

      if (page < 4) {
        buttons.push(
          <Button
            key="next"
            variant="secondary"
            className="army-btn"
            onClick={() => handlePageChange(1)}
          >
            &gt;
          </Button>
        );
      }
    } else {
      // Other pages: <, numbers, >
      buttons.push(
        <Button
          key="prev"
          variant="secondary"
          className="army-btn"
          onClick={() => handlePageChange(-1)}
        >
          &lt;
        </Button>
      );

      const startNum = page * 9 + 1;
      for (let i = 1; i <= 8; i++) {
        const num = startNum + i - 1;
        if (num <= 50) {
          buttons.push(
            <Button
              key={num}
              variant={selectedArmies === num ? "primary" : "secondary"}
              className={`army-btn ${selectedArmies === num ? "selected" : ""}`}
              onClick={() => handleArmySelect(num)}
            >
              {num}
            </Button>
          );
        }
      }

      if (page < 4) {
        buttons.push(
          <Button
            key="next"
            variant="secondary"
            className="army-btn"
            onClick={() => handlePageChange(1)}
          >
            &gt;
          </Button>
        );
      } else {
        // Last page - show 50
        const lastNum = startNum + 8;
        if (lastNum <= 50) {
          buttons.push(
            <Button
              key={lastNum}
              variant={selectedArmies === lastNum ? "primary" : "secondary"}
              className={`army-btn ${selectedArmies === lastNum ? "selected" : ""}`}
              onClick={() => handleArmySelect(lastNum)}
            >
              {lastNum}
            </Button>
          );
        }
      }
    }

    return buttons;
  };

  const backgroundGradient = `linear-gradient(135deg, ${playerColor} 0%, ${playerColor}88 100%)`;
  const labelKey = playerType === "attacker" ? "numberOfArmiesAttack" : "numberOfArmiesDefend";

  return (
    <div className="screen" style={{ background: backgroundGradient }}>
      <div className="screen-content">
        <div className="header-content">
          <h1>{playerName}</h1>
          <h2>{t(labelKey)}</h2>
        </div>

        <div className="army-selection-grid" id={`${playerType}-army-buttons`}>
          {renderArmyButtons()}
        </div>
      </div>
    </div>
  );
}

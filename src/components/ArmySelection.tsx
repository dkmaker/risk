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
    const isValidPage = newPage >= 0 && newPage <= 4;

    if (isValidPage) {
      setPage(newPage);
    }
  };

  const createArmyButton = (number: number, className = "army-button") => {
    return (
      <Button
        key={number}
        variant={selectedArmies === number ? "primary" : "secondary"}
        className={`${className} ${selectedArmies === number ? "selected" : ""}`}
        onClick={() => handleArmySelect(number)}
      >
        {number}
      </Button>
    );
  };

  const createNavigationButton = (direction: "prev" | "next", symbol: string) => {
    const isPrevious = direction === "prev";
    const buttonAction = isPrevious ? () => handlePageChange(-1) : () => handlePageChange(1);

    return (
      <Button key={direction} variant="secondary" className="army-button" onClick={buttonAction}>
        {symbol}
      </Button>
    );
  };

  const renderFirstPageButtons = () => {
    const buttons = [];

    // Add number buttons 1-9
    for (let i = 1; i <= 9; i++) {
      buttons.push(createArmyButton(i));
    }

    // Add next button if not on last page
    const isNotLastPage = page < 4;
    if (isNotLastPage) {
      buttons.push(createNavigationButton("next", ">"));
    }

    return buttons;
  };

  const renderOtherPageButtons = () => {
    const buttons = [];

    // Add previous button
    buttons.push(createNavigationButton("prev", "<"));

    // Add number buttons for current page
    const startNum = page * 9 + 1;
    const isLastPage = page >= 4;
    const numbersToShow = isLastPage ? 9 : 8; // Last page shows 9 numbers

    for (let i = 0; i < numbersToShow; i++) {
      const num = startNum + i;
      const isValidArmyCount = num <= 50;

      if (isValidArmyCount) {
        buttons.push(createArmyButton(num, "army-btn"));
      }
    }

    // Add next button if not on last page
    const isNotLastPage = page < 4;
    if (isNotLastPage) {
      buttons.push(createNavigationButton("next", ">"));
    }

    return buttons;
  };

  const renderArmyButtons = () => {
    const isFirstPage = page === 0;
    return isFirstPage ? renderFirstPageButtons() : renderOtherPageButtons();
  };

  const backgroundGradient = `linear-gradient(135deg, ${playerColor} 0%, ${playerColor}88 100%)`;
  const isAttacker = playerType === "attacker";
  const labelKey = isAttacker ? "numberOfArmiesAttack" : "numberOfArmiesDefend";

  return (
    <div className="screen-layout" style={{ background: backgroundGradient }}>
      <div className="screen-header">
        <h1>{playerName}</h1>
        <h2>{t(labelKey)}</h2>
      </div>

      <div className="screen-content">
        <div className="army-buttons" id={`${playerType}-army-buttons`}>
          {renderArmyButtons()}
        </div>
      </div>
    </div>
  );
}

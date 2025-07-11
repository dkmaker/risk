import type { HeaderIcon } from "../../types/game";

interface HeaderProps {
  icon: HeaderIcon;
  onHomeClick?: () => void;
  onSettingsClick?: () => void;
}

export default function Header({ icon, onHomeClick, onSettingsClick }: HeaderProps) {
  const renderIcon = () => {
    if (icon === "battle") {
      return (
        <>
          <span className="header-icon">⚔️</span>
          <span className="header-icon">🛡️</span>
        </>
      );
    }
    return <span className="header-icon">{icon}</span>;
  };

  return (
    <header className="header">
      <button type="button" className="header-button" onClick={onHomeClick} aria-label="Home">
        🏠
      </button>

      <div className="header-center" id="header-center">
        {renderIcon()}
      </div>

      <button
        type="button"
        className="header-button"
        onClick={onSettingsClick}
        aria-label="Settings"
      >
        ⚙️
      </button>
    </header>
  );
}

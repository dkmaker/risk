/**
 * Settings Modal - Theme selection and app settings
 */

import { useGameState } from "../hooks/useGameState";
import { useTranslation } from "../hooks/useTranslation";
import Button from "./shared/Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onManualNavigation: () => void;
}

export default function SettingsModal({ isOpen, onClose, onManualNavigation }: SettingsModalProps) {
  const { t } = useTranslation();
  const { goToPlayerSetup } = useGameState();

  if (!isOpen) return null;

  const handlePlayerSetup = () => {
    onManualNavigation();
    goToPlayerSetup();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{t("settings")}</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="settings-section">
            <h3>{t("playersLabel")}</h3>
            <Button onClick={handlePlayerSetup} variant="secondary" className="w-full">
              Edit Players
            </Button>
          </div>

          <div className="settings-section">
            <h3>{t("about")}</h3>
            <p className="about-text">{t("appDescription")}</p>
            <p className="version-info">Version 1.0.0</p>
          </div>
        </div>

        <div className="modal-footer">
          <Button onClick={onClose} variant="primary">
            {t("close")}
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * Settings Modal - Theme selection and app settings
 */

import { useEffect, useRef } from "preact/hooks";
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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Handle modal open/close with focus management
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (isOpen) {
      // Store the previously focused element
      previouslyFocusedElement.current = document.activeElement as HTMLElement;

      // Show modal and focus first focusable element
      dialog.showModal();

      // Focus the close button as it's the first focusable element
      const closeButton = dialog.querySelector(".modal-close") as HTMLButtonElement;
      if (closeButton) {
        closeButton.focus();
      }
    } else {
      // Close modal and restore focus
      dialog.close();

      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    }
  }, [isOpen]);

  // Handle ESC key and click outside to close modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    const handleCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    const handleClick = (event: MouseEvent) => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog =
        rect.top <= event.clientY &&
        event.clientY <= rect.top + rect.height &&
        rect.left <= event.clientX &&
        event.clientX <= rect.left + rect.width;

      if (!isInDialog) {
        onClose();
      }
    };

    if (isOpen) {
      dialog.addEventListener("cancel", handleCancel);
      dialog.addEventListener("click", handleClick);

      return () => {
        dialog.removeEventListener("cancel", handleCancel);
        dialog.removeEventListener("click", handleClick);
      };
    }

    // Return empty cleanup function when modal is not open
    return () => {};
  }, [isOpen, onClose]);

  const handlePlayerSetup = () => {
    onManualNavigation();
    goToPlayerSetup();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      className="modal-dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2 id="modal-title">{t("settings")}</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label={`${t("close")} ${t("settings")}`}
          >
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
            <p id="modal-description" className="about-text">
              {t("appDescription")}
            </p>
            <p className="version-info">Version 1.0.0</p>
          </div>
        </div>

        <div className="modal-footer">
          <Button onClick={onClose} variant="primary">
            {t("close")}
          </Button>
        </div>
      </div>
    </dialog>
  );
}

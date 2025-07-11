/**
 * useLocalStorage - Custom hook for persistent storage operations
 * Provides reactive interface to StorageService with automatic persistence
 */

import { useEffect, useState } from "preact/hooks";
import { storageService } from "../services/StorageService";
import type { Player } from "../types/game";

export function useLocalStorage() {
  const [players, setPlayersState] = useState<Player[]>([]);
  const [language, setLanguageState] = useState<string>("en");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadedPlayers = storageService.loadPlayers();
    const loadedLanguage = storageService.loadLanguage();

    setPlayersState(loadedPlayers);
    setLanguageState(loadedLanguage);
    setIsLoaded(true);
  }, []);

  /**
   * Save players to storage and update state
   */
  const savePlayers = (newPlayers: Player[]): void => {
    storageService.savePlayers(newPlayers);
    setPlayersState(newPlayers);
  };

  /**
   * Clear players from storage and state
   */
  const clearPlayers = (): void => {
    storageService.clearPlayers();
    setPlayersState([]);
  };

  /**
   * Save language to storage and update state
   */
  const saveLanguage = (newLanguage: string): void => {
    storageService.saveLanguage(newLanguage);
    setLanguageState(newLanguage);
  };

  /**
   * Check if players exist in storage
   */
  const hasPlayers = (): boolean => {
    return players.length >= 2;
  };

  /**
   * Get player count
   */
  const getPlayerCount = (): number => {
    return players.length;
  };

  /**
   * Export all data
   */
  const exportData = (): string => {
    return storageService.exportData();
  };

  /**
   * Import data from JSON
   */
  const importData = (jsonData: string): boolean => {
    const success = storageService.importData(jsonData);
    if (success) {
      // Reload data after import
      const loadedPlayers = storageService.loadPlayers();
      const loadedLanguage = storageService.loadLanguage();
      setPlayersState(loadedPlayers);
      setLanguageState(loadedLanguage);
    }
    return success;
  };

  /**
   * Clear all storage
   */
  const clearAll = (): void => {
    storageService.clearAll();
    setPlayersState([]);
    setLanguageState("en");
  };

  return {
    // State
    players,
    language,
    isLoaded,

    // Actions
    savePlayers,
    clearPlayers,
    saveLanguage,
    exportData,
    importData,
    clearAll,

    // Computed
    hasPlayers: hasPlayers(),
    playerCount: getPlayerCount(),
    isStorageAvailable: storageService.isAvailable(),
    storageInfo: storageService.getStorageInfo(),
  };
}

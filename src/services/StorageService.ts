/**
 * StorageService - Handles localStorage operations with type safety
 * Provides persistent storage for players, settings, and game preferences
 */

import type { Player } from "../types/game";

export interface GameSettings {
  language: string;
  soundEnabled: boolean;
}

export class StorageService {
  private readonly PLAYERS_KEY = "riskDicePlayers";
  private readonly LANGUAGE_KEY = "selectedLanguage";
  private readonly SETTINGS_KEY = "gameSettings";

  /**
   * Save players to localStorage
   */
  savePlayers(players: Player[]): void {
    try {
      const serialized = JSON.stringify(players);
      localStorage.setItem(this.PLAYERS_KEY, serialized);
    } catch (error) {
      console.error("Failed to save players:", error);
      throw new Error("Failed to save players to storage");
    }
  }

  /**
   * Load players from localStorage
   */
  loadPlayers(): Player[] {
    try {
      const serialized = localStorage.getItem(this.PLAYERS_KEY);
      if (!serialized) {
        return [];
      }

      const players = JSON.parse(serialized) as Player[];
      return this.validatePlayers(players);
    } catch (error) {
      console.error("Failed to load players:", error);
      return [];
    }
  }

  /**
   * Clear saved players
   */
  clearPlayers(): void {
    localStorage.removeItem(this.PLAYERS_KEY);
  }

  /**
   * Check if players exist in storage
   */
  hasPlayers(): boolean {
    return localStorage.getItem(this.PLAYERS_KEY) !== null;
  }

  /**
   * Get number of saved players
   */
  getPlayerCount(): number {
    const players = this.loadPlayers();
    return players.length;
  }

  /**
   * Save language preference
   */
  saveLanguage(language: string): void {
    try {
      localStorage.setItem(this.LANGUAGE_KEY, language);
    } catch (error) {
      console.error("Failed to save language:", error);
    }
  }

  /**
   * Load language preference
   */
  loadLanguage(): string {
    try {
      return localStorage.getItem(this.LANGUAGE_KEY) || "en";
    } catch (error) {
      console.error("Failed to load language:", error);
      return "en";
    }
  }

  /**
   * Save game settings
   */
  saveSettings(settings: Partial<GameSettings>): void {
    try {
      const currentSettings = this.loadSettings();
      const updatedSettings = { ...currentSettings, ...settings };
      const serialized = JSON.stringify(updatedSettings);
      localStorage.setItem(this.SETTINGS_KEY, serialized);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  /**
   * Load game settings with defaults
   */
  loadSettings(): GameSettings {
    try {
      const serialized = localStorage.getItem(this.SETTINGS_KEY);
      if (!serialized) {
        return this.getDefaultSettings();
      }

      const settings = JSON.parse(serialized) as GameSettings;
      return { ...this.getDefaultSettings(), ...settings };
    } catch (error) {
      console.error("Failed to load settings:", error);
      return this.getDefaultSettings();
    }
  }

  /**
   * Get default settings
   */
  private getDefaultSettings(): GameSettings {
    return {
      language: "en",
      soundEnabled: true,
    };
  }

  /**
   * Clear all stored data
   */
  clearAll(): void {
    try {
      localStorage.removeItem(this.PLAYERS_KEY);
      localStorage.removeItem(this.LANGUAGE_KEY);
      localStorage.removeItem(this.SETTINGS_KEY);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }

  /**
   * Validate players data structure
   */
  private validatePlayers(players: unknown): Player[] {
    if (!Array.isArray(players)) {
      return [];
    }

    return players.filter((player): player is Player => {
      return (
        typeof player === "object" &&
        player !== null &&
        typeof player.name === "string" &&
        typeof player.color === "string" &&
        typeof player.colorName === "string" &&
        player.name.length > 0
      );
    });
  }

  /**
   * Export all data as JSON
   */
  exportData(): string {
    const data = {
      players: this.loadPlayers(),
      language: this.loadLanguage(),
      settings: this.loadSettings(),
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Import data from JSON
   */
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      if (data.players && Array.isArray(data.players)) {
        this.savePlayers(this.validatePlayers(data.players));
      }

      if (data.language && typeof data.language === "string") {
        this.saveLanguage(data.language);
      }

      if (data.settings && typeof data.settings === "object") {
        this.saveSettings(data.settings);
      }

      return true;
    } catch (error) {
      console.error("Failed to import data:", error);
      return false;
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage usage info
   */
  getStorageInfo(): { used: number; available: boolean } {
    if (!this.isAvailable()) {
      return { used: 0, available: false };
    }

    try {
      const allData = this.exportData();
      return {
        used: new Blob([allData]).size,
        available: true,
      };
    } catch {
      return { used: 0, available: false };
    }
  }
}

// Singleton instance
export const storageService = new StorageService();

/**
 * Translation system for Risk Dice Battle
 * TypeScript-based translations replacing the legacy JavaScript system
 */

export type Language = "en" | "da";

export interface TranslationKeys {
  // App title
  appTitle: string;

  // Player setup
  playerSetupTitle: string;
  playerSetupSubtitle: string;
  redPlayer: string;
  bluePlayer: string;
  greenPlayer: string;
  yellowPlayer: string;
  blackPlayer: string;
  purplePlayer: string;
  saveAndStart: string;

  // Settings
  settingsTitle: string;
  languageLabel: string;
  playersLabel: string;
  backToGame: string;
  settings: string;
  theme: string;
  about: string;
  appDescription: string;
  close: string;

  // Battle screens
  whoIsAttacking: string;
  whoIsDefending: string;
  numberOfArmiesAttack: string;
  numberOfArmiesDefend: string;
  battle: string;

  // Battle UI
  rollDice: string;
  withdraw: string;
  newBattle: string;
  clickToStartBattle: string;
  clickRollToStart: string;
  rolling: string;

  // Battle results
  victory: string;
  battleOver: string;
  hasConquered: string;
  noMoreArmies: string;
  winsThisRound: string;
  loses: string;
  army: string;
  armies: string;
  bothLoseArmies: string;
  attacker: string;
  defender: string;
  attackerWins: string;
  defenderWins: string;
  battleError: string;
  battleSetupError: string;
  backToSetup: string;
  confirmWithdraw: string;

  // Alerts
  enterAtLeastTwoPlayers: string;
  selectNumberOfArmies: string;
  attackerMustHaveArmy: string;
  defenderMustHaveArmy: string;

  // Confirmations
  confirmLeaveGame: string;

  // Language names
  englishLanguage: string;
  danishLanguage: string;
}

export const translations: Record<Language, TranslationKeys> = {
  en: {
    // App title
    appTitle: "Risk Dice Battle",

    // Player setup
    playerSetupTitle: "Risk Dice Battle",
    playerSetupSubtitle: "Enter player names (leave blank to skip)",
    redPlayer: "Red Player",
    bluePlayer: "Blue Player",
    greenPlayer: "Green Player",
    yellowPlayer: "Yellow Player",
    blackPlayer: "Black Player",
    purplePlayer: "Purple Player",
    saveAndStart: "Save & Start",

    // Settings
    settingsTitle: "Settings",
    languageLabel: "Language",
    playersLabel: "Players",
    backToGame: "Back to Game",
    settings: "Settings",
    theme: "Theme",
    about: "About",
    appDescription:
      "Risk Dice Battle - A mobile-optimized dice battle simulator following official Risk game rules.",
    close: "Close",

    // Battle screens
    whoIsAttacking: "Who's Attacking?",
    whoIsDefending: "Who's Defending?",
    numberOfArmiesAttack: "Number of armies to attack with",
    numberOfArmiesDefend: "Number of armies in territory",
    battle: "Battle!",

    // Battle UI
    rollDice: "Roll Dice",
    withdraw: "Withdraw",
    newBattle: "New Battle",
    clickToStartBattle: "Click Roll to start battle!",
    clickRollToStart: "Click Roll Dice to start!",
    rolling: "Rolling...",

    // Battle results
    victory: "Victory!",
    battleOver: "Battle Over!",
    hasConquered: "has conquered the territory!",
    noMoreArmies: "has no more armies to attack with!",
    winsThisRound: "wins this round!",
    loses: "loses",
    army: "army",
    armies: "armies",
    bothLoseArmies: "Both lose armies!",
    attacker: "Attacker",
    defender: "Defender",
    attackerWins: "{{name}} wins the battle!",
    defenderWins: "{{name}} successfully defends!",
    battleError: "Battle Error",
    battleSetupError: "Battle setup is incomplete. Please start over.",
    backToSetup: "Back to Setup",
    confirmWithdraw: "Confirm Withdraw",

    // Alerts
    enterAtLeastTwoPlayers: "Please enter at least 2 player names!",
    selectNumberOfArmies: "Please select the number of armies!",
    attackerMustHaveArmy: "Attacker must select at least 1 army to attack with!",
    defenderMustHaveArmy: "Defender must have at least 1 army!",

    // Confirmations
    confirmLeaveGame: "Are you sure you want to leave the current game?",

    // Language names
    englishLanguage: "English",
    danishLanguage: "Danish",
  },

  da: {
    // App title
    appTitle: "Risk Terning Kamp",

    // Player setup
    playerSetupTitle: "Risk Terning Kamp",
    playerSetupSubtitle: "Indtast spillernavne (lad være tom for at springe over)",
    redPlayer: "Rød Spiller",
    bluePlayer: "Blå Spiller",
    greenPlayer: "Grøn Spiller",
    yellowPlayer: "Gul Spiller",
    blackPlayer: "Sort Spiller",
    purplePlayer: "Lilla Spiller",
    saveAndStart: "Gem & Start",

    // Settings
    settingsTitle: "Indstillinger",
    languageLabel: "Sprog",
    playersLabel: "Spillere",
    backToGame: "Tilbage til Spil",
    settings: "Indstillinger",
    theme: "Tema",
    about: "Om",
    appDescription:
      "Risk Terning Kamp - En mobil-optimeret terningkamp simulator der følger officielle Risk spelregler.",
    close: "Luk",

    // Battle screens
    whoIsAttacking: "Hvem Angriber?",
    whoIsDefending: "Hvem Forsvarer?",
    numberOfArmiesAttack: "Antal hære til angreb",
    numberOfArmiesDefend: "Antal hære i territorium",
    battle: "Kamp!",

    // Battle UI
    rollDice: "Kast Terninger",
    withdraw: "Træk tilbage",
    newBattle: "Ny Kamp",
    clickToStartBattle: "Klik Kast for at starte kamp!",
    clickRollToStart: "Klik Kast Terninger for at starte!",
    rolling: "Kaster...",

    // Battle results
    victory: "Sejr!",
    battleOver: "Kamp Slut!",
    hasConquered: "har erobret territoriet!",
    noMoreArmies: "har ikke flere hære til at angribe med!",
    winsThisRound: "vinder denne runde!",
    loses: "taber",
    army: "hær",
    armies: "hære",
    bothLoseArmies: "Begge taber hære!",
    attacker: "Angriber",
    defender: "Forsvarer",
    attackerWins: "{{name}} vinder kampen!",
    defenderWins: "{{name}} forsvarer succesfuldt!",
    battleError: "Kamp Fejl",
    battleSetupError: "Kamp opsætning er ufuldstændig. Begynd forfra.",
    backToSetup: "Tilbage til Opsætning",
    confirmWithdraw: "Bekræft Tilbagetrækning",

    // Alerts
    enterAtLeastTwoPlayers: "Indtast venligst mindst 2 spillernavne!",
    selectNumberOfArmies: "Vælg venligst antal hære!",
    attackerMustHaveArmy: "Angriber skal vælge mindst 1 hær til at angribe med!",
    defenderMustHaveArmy: "Forsvarer skal have mindst 1 hær!",

    // Confirmations
    confirmLeaveGame: "Er du sikker på, at du vil forlade det nuværende spil?",

    // Language names
    englishLanguage: "Engelsk",
    danishLanguage: "Dansk",
  },
};

export const supportedLanguages: Language[] = ["en", "da"];

export function isLanguageSupported(lang: string): lang is Language {
  return supportedLanguages.includes(lang as Language);
}

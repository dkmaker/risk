export const translations = {
    en: {
        // App title
        appTitle: 'Risk Dice Battle',
        
        // Player setup
        playerSetupTitle: 'Risk Dice Battle',
        playerSetupSubtitle: 'Enter player names (leave blank to skip)',
        redPlayer: 'Red Player',
        bluePlayer: 'Blue Player',
        greenPlayer: 'Green Player',
        yellowPlayer: 'Yellow Player',
        blackPlayer: 'Black Player',
        purplePlayer: 'Purple Player',
        saveAndStart: 'Save & Start',
        
        // Settings
        settingsTitle: 'Settings',
        languageLabel: 'Language',
        playersLabel: 'Players',
        backToGame: 'Back to Game',
        
        // Battle screens
        whoIsAttacking: "Who's Attacking?",
        whoIsDefending: "Who's Defending?",
        numberOfArmiesAttack: 'Number of armies to attack with',
        numberOfArmiesDefend: 'Number of armies in territory',
        battle: 'Battle!',
        
        // Battle UI
        rollDice: 'Roll Dice',
        withdraw: 'Withdraw',
        newBattle: 'New Battle',
        clickToStartBattle: 'Click Roll to start battle!',
        
        // Battle results
        victory: 'Victory!',
        battleOver: 'Battle Over!',
        hasConquered: 'has conquered the territory!',
        noMoreArmies: 'has no more armies to attack with!',
        winsThisRound: 'wins this round!',
        loses: 'loses',
        army: 'army',
        armies: 'armies',
        bothLoseArmies: 'Both lose armies!',
        attacker: 'Attacker',
        defender: 'Defender',
        
        // Alerts
        enterAtLeastTwoPlayers: 'Please enter at least 2 player names!',
        selectNumberOfArmies: 'Please select the number of armies!',
        attackerMustHaveArmy: 'Attacker must select at least 1 army to attack with!',
        defenderMustHaveArmy: 'Defender must have at least 1 army!',
        
        // Confirmations
        confirmLeaveGame: 'Are you sure you want to leave the current game?',
        confirmWithdraw: 'Are you sure you want to withdraw from battle?',
        
        // Language names
        englishLanguage: 'English',
        danishLanguage: 'Danish'
    },
    
    da: {
        // App title
        appTitle: 'Risk Terning Kamp',
        
        // Player setup
        playerSetupTitle: 'Risk Terning Kamp',
        playerSetupSubtitle: 'Indtast spillernavne (lad være tom for at springe over)',
        redPlayer: 'Rød Spiller',
        bluePlayer: 'Blå Spiller',
        greenPlayer: 'Grøn Spiller',
        yellowPlayer: 'Gul Spiller',
        blackPlayer: 'Sort Spiller',
        purplePlayer: 'Lilla Spiller',
        saveAndStart: 'Gem & Start',
        
        // Settings
        settingsTitle: 'Indstillinger',
        languageLabel: 'Sprog',
        playersLabel: 'Spillere',
        backToGame: 'Tilbage til Spil',
        
        // Battle screens
        whoIsAttacking: 'Hvem Angriber?',
        whoIsDefending: 'Hvem Forsvarer?',
        numberOfArmiesAttack: 'Antal hære til angreb',
        numberOfArmiesDefend: 'Antal hære i territorium',
        battle: 'Kamp!',
        
        // Battle UI
        rollDice: 'Kast Terninger',
        withdraw: 'Træk tilbage',
        newBattle: 'Ny Kamp',
        clickToStartBattle: 'Klik Kast for at starte kamp!',
        
        // Battle results
        victory: 'Sejr!',
        battleOver: 'Kamp Slut!',
        hasConquered: 'har erobret territoriet!',
        noMoreArmies: 'har ikke flere hære til at angribe med!',
        winsThisRound: 'vinder denne runde!',
        loses: 'taber',
        army: 'hær',
        armies: 'hære',
        bothLoseArmies: 'Begge taber hære!',
        attacker: 'Angriber',
        defender: 'Forsvarer',
        
        // Alerts
        enterAtLeastTwoPlayers: 'Indtast venligst mindst 2 spillernavne!',
        selectNumberOfArmies: 'Vælg venligst antal hære!',
        attackerMustHaveArmy: 'Angriber skal vælge mindst 1 hær til at angribe med!',
        defenderMustHaveArmy: 'Forsvarer skal have mindst 1 hær!',
        
        // Confirmations
        confirmLeaveGame: 'Er du sikker på, at du vil forlade det nuværende spil?',
        confirmWithdraw: 'Er du sikker på, at du vil trække dig tilbage fra kampen?',
        
        // Language names
        englishLanguage: 'Engelsk',
        danishLanguage: 'Dansk'
    }
};

// Language management
let currentLanguage = localStorage.getItem('selectedLanguage') || 'en';

export function getCurrentLanguage() {
    return currentLanguage;
}

export function setLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
}

export function t(key) {
    const keys = key.split('.');
    let value = translations[currentLanguage];
    
    for (const k of keys) {
        value = value?.[k];
    }
    
    return value || key;
}
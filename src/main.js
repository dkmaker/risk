import { t, getCurrentLanguage, setLanguage } from './translations.js';

let players = [];

let gameState = {
    attacker: {
        playerIndex: null,
        color: null,
        name: null,
        armies: 0,
        initialArmies: 0,
        page: 0
    },
    defender: {
        playerIndex: null,
        color: null,
        name: null,
        armies: 0,
        initialArmies: 0,
        page: 0
    }
};

// Load saved players from local storage
function loadPlayers() {
    const saved = localStorage.getItem('riskDicePlayers');
    if (saved) {
        players = JSON.parse(saved);
        if (players.length >= 2) {
            // Skip setup and go to attacker selection
            document.getElementById('player-setup').classList.remove('active');
            document.getElementById('attacker-selection').classList.add('active');
            updateHeaderIcon('⚔️');
            updatePlayerSelection();
        }
    }
}

// Save players to local storage
function savePlayersAndStart() {
    players = [];
    const colorCards = document.querySelectorAll('.player-color-card');
    
    colorCards.forEach(card => {
        const input = card.querySelector('.player-name-on-card');
        const name = input.value.trim();
        if (name) {
            players.push({
                name: name,
                color: card.dataset.color,
                colorName: input.dataset.player
            });
        }
    });
    
    if (players.length < 2) {
        alert(t('enterAtLeastTwoPlayers'));
        return;
    }
    
    localStorage.setItem('riskDicePlayers', JSON.stringify(players));
    
    document.getElementById('player-setup').classList.remove('active');
    document.getElementById('attacker-selection').classList.add('active');
    updateHeaderIcon('⚔️');
    updatePlayerSelection();
}

// Update player selection screen
function updatePlayerSelection() {
    const selectionList = document.getElementById('player-selection-list');
    selectionList.innerHTML = '';
    
    players.forEach((player, index) => {
        const btn = document.createElement('button');
        btn.className = 'player-select-btn';
        btn.onclick = () => selectAttacker(index);
        
        const nameSpan = document.createElement('span');
        nameSpan.className = 'player-name-display';
        nameSpan.textContent = player.name;
        
        const colorDiv = document.createElement('div');
        colorDiv.className = 'player-color-indicator';
        colorDiv.style.backgroundColor = player.color;
        
        btn.appendChild(nameSpan);
        btn.appendChild(colorDiv);
        selectionList.appendChild(btn);
    });
}

// Show settings screen
function showSettings() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('settings-screen').classList.add('active');
    updateHeaderIcon('⚙️');
    updateLanguageButtons();
    updateUILanguage();
}

// Edit players - go to player setup screen
function editPlayers() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('player-setup').classList.add('active');
    updateHeaderIcon('🎲');
    
    // Restore saved player names
    if (players.length > 0) {
        players.forEach(player => {
            const input = document.querySelector(`[data-player="${player.colorName}"]`);
            if (input) {
                input.value = player.name;
            }
        });
    }
}

// Back to game
function backToGame() {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    if (players.length >= 2) {
        document.getElementById('attacker-selection').classList.add('active');
        updateHeaderIcon('⚔️');
    } else {
        document.getElementById('player-setup').classList.add('active');
        updateHeaderIcon('🎲');
    }
}

// Update header icon
function updateHeaderIcon(icon) {
    const headerCenter = document.getElementById('header-center');
    if (icon === 'battle') {
        headerCenter.innerHTML = '<span class="header-icon">⚔️</span><span class="header-icon">🛡️</span>';
    } else {
        headerCenter.innerHTML = `<span class="header-icon">${icon}</span>`;
    }
}

// Select attacker
function selectAttacker(playerIndex) {
    gameState.attacker.playerIndex = playerIndex;
    gameState.attacker.color = players[playerIndex].color;
    gameState.attacker.name = players[playerIndex].name;
    
    document.getElementById('attacking-player-name').textContent = players[playerIndex].name;
    
    // Clear any previous battle state when starting new game
    clearBattleScreen();
    
    // Show defender selection
    document.getElementById('attacker-selection').classList.remove('active');
    document.getElementById('defender-selection').classList.add('active');
    updateHeaderIcon('🛡️');
    updateDefenderSelection();
}

// Select defender
function selectDefender(playerIndex) {
    gameState.defender.playerIndex = playerIndex;
    gameState.defender.color = players[playerIndex].color;
    gameState.defender.name = players[playerIndex].name;
    
    document.getElementById('defending-player-name').textContent = players[playerIndex].name;
    
    // Set background color for attacker setup
    const attackerScreen = document.getElementById('setup-attacker');
    attackerScreen.style.background = `linear-gradient(135deg, ${gameState.attacker.color} 0%, ${gameState.attacker.color}88 100%)`;
    
    document.getElementById('defender-selection').classList.remove('active');
    document.getElementById('setup-attacker').classList.add('active');
    updateHeaderIcon('⚔️');
}

// Update defender selection screen
function updateDefenderSelection() {
    const selectionList = document.getElementById('defender-selection-list');
    selectionList.innerHTML = '';
    
    players.forEach((player, index) => {
        if (index !== gameState.attacker.playerIndex) {
            const btn = document.createElement('button');
            btn.className = 'player-select-btn';
            btn.onclick = () => selectDefender(index);
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'player-name-display';
            nameSpan.textContent = player.name;
            
            const colorDiv = document.createElement('div');
            colorDiv.className = 'player-color-indicator';
            colorDiv.style.backgroundColor = player.color;
            
            btn.appendChild(nameSpan);
            btn.appendChild(colorDiv);
            selectionList.appendChild(btn);
        }
    });
}


// Army selection functions
function selectAttackerArmy(count) {
    count = parseInt(count);
    if (count < 1 || count > 50) return;
    
    gameState.attacker.armies = count;
    
    // Update button states
    document.querySelectorAll('#attacker-army-buttons .army-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.textContent) === count) {
            btn.classList.add('selected');
        }
    });
    
    // Auto-advance to defender setup
    setTimeout(() => {
        nextToDefender();
    }, 300);
}

function selectDefenderArmy(count) {
    count = parseInt(count);
    if (count < 1 || count > 50) return;
    
    gameState.defender.armies = count;
    
    // Update button states
    document.querySelectorAll('#defender-army-buttons .army-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (parseInt(btn.textContent) === count) {
            btn.classList.add('selected');
        }
    });
    
    // Auto-advance to battle
    setTimeout(() => {
        startBattle();
    }, 300);
}

function changeAttackerPage(direction) {
    const newPage = gameState.attacker.page + direction;
    if (newPage < 0 || newPage > 4) return; // 5 pages: 1-10, 11-20, 21-30, 31-40, 41-50
    
    gameState.attacker.page = newPage;
    updateAttackerButtons();
}

function changeDefenderPage(direction) {
    const newPage = gameState.defender.page + direction;
    if (newPage < 0 || newPage > 4) return;
    
    gameState.defender.page = newPage;
    updateDefenderButtons();
}

function updateAttackerButtons() {
    const page = gameState.attacker.page;
    const buttons = document.querySelectorAll('#attacker-army-buttons .army-btn');
    
    if (page === 0) {
        // First page: 1-9, >
        buttons.forEach((btn, index) => {
            btn.classList.remove('selected');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            
            if (index < 9) {
                const num = index + 1;
                btn.textContent = num;
                btn.setAttribute('onclick', `selectAttackerArmy(${num})`);
                if (num === gameState.attacker.armies) {
                    btn.classList.add('selected');
                }
            } else {
                btn.textContent = '>';
                btn.setAttribute('onclick', 'changeAttackerPage(1)');
            }
        });
    } else {
        // Other pages: <, numbers, >
        const startNum = page * 9 + 1;
        buttons.forEach((btn, index) => {
            btn.classList.remove('selected');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            
            if (index === 0) {
                btn.textContent = '<';
                btn.setAttribute('onclick', 'changeAttackerPage(-1)');
            } else if (index === 9) {
                btn.textContent = page < 5 ? '>' : startNum + 8;
                btn.setAttribute('onclick', page < 5 ? 'changeAttackerPage(1)' : `selectAttackerArmy(${startNum + 8})`);
                if (startNum + 8 === gameState.attacker.armies) {
                    btn.classList.add('selected');
                }
            } else {
                const num = startNum + index - 1;
                if (num <= 50) {
                    btn.textContent = num;
                    btn.setAttribute('onclick', `selectAttackerArmy(${num})`);
                    if (num === gameState.attacker.armies) {
                        btn.classList.add('selected');
                    }
                } else {
                    btn.style.display = 'none';
                }
            }
        });
    }
}

function updateDefenderButtons() {
    const page = gameState.defender.page;
    const buttons = document.querySelectorAll('#defender-army-buttons .army-btn');
    
    if (page === 0) {
        // First page: 1-9, >
        buttons.forEach((btn, index) => {
            btn.classList.remove('selected');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.display = 'block';
            
            if (index < 9) {
                const num = index + 1;
                btn.textContent = num;
                btn.setAttribute('onclick', `selectDefenderArmy(${num})`);
                if (num === gameState.defender.armies) {
                    btn.classList.add('selected');
                }
            } else {
                btn.textContent = '>';
                btn.setAttribute('onclick', 'changeDefenderPage(1)');
            }
        });
    } else {
        // Other pages: <, numbers, >
        const startNum = page * 9 + 1;
        buttons.forEach((btn, index) => {
            btn.classList.remove('selected');
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
            btn.style.display = 'block';
            
            if (index === 0) {
                btn.textContent = '<';
                btn.setAttribute('onclick', 'changeDefenderPage(-1)');
            } else if (index === 9) {
                btn.textContent = page < 5 ? '>' : startNum + 8;
                btn.setAttribute('onclick', page < 5 ? 'changeDefenderPage(1)' : `selectDefenderArmy(${startNum + 8})`);
                if (startNum + 8 === gameState.defender.armies) {
                    btn.classList.add('selected');
                }
            } else {
                const num = startNum + index - 1;
                if (num <= 50) {
                    btn.textContent = num;
                    btn.setAttribute('onclick', `selectDefenderArmy(${num})`);
                    if (num === gameState.defender.armies) {
                        btn.classList.add('selected');
                    }
                } else {
                    btn.style.display = 'none';
                }
            }
        });
    }
}

function nextToDefender() {
    if (gameState.attacker.armies === 0) {
        alert(t('selectNumberOfArmies'));
        return;
    }

    if (gameState.attacker.armies < 1) {
        alert(t('attackerMustHaveArmy'));
        return;
    }

    gameState.attacker.initialArmies = gameState.attacker.armies;

    // Set background color for defender setup
    const defenderScreen = document.getElementById('setup-defender');
    defenderScreen.style.background = `linear-gradient(135deg, ${gameState.defender.color} 0%, ${gameState.defender.color}88 100%)`;

    document.getElementById('setup-attacker').classList.remove('active');
    document.getElementById('setup-defender').classList.add('active');
    updateHeaderIcon('🛡️');
}

function startBattle() {
    if (gameState.defender.armies === 0) {
        alert(t('selectNumberOfArmies'));
        return;
    }

    if (gameState.defender.armies < 1) {
        alert(t('defenderMustHaveArmy'));
        return;
    }

    gameState.defender.initialArmies = gameState.defender.armies;

    // Clear battle screen first
    clearBattleScreen();

    // Set up battle screen
    document.getElementById('attacker-card').style.backgroundColor = gameState.attacker.color;
    document.getElementById('defender-card').style.backgroundColor = gameState.defender.color;
    document.querySelector('#attacker-card h3').textContent = gameState.attacker.name;
    document.querySelector('#defender-card h3').textContent = gameState.defender.name;
    
    // Update army counts but not dice info
    document.getElementById('attacker-count').textContent = gameState.attacker.armies;
    document.getElementById('defender-count').textContent = gameState.defender.armies;

    document.getElementById('setup-defender').classList.remove('active');
    document.getElementById('battle-screen').classList.add('active');
    updateHeaderIcon('battle');
}

function updateBattleDisplay() {
    document.getElementById('attacker-count').textContent = gameState.attacker.armies;
    document.getElementById('defender-count').textContent = gameState.defender.armies;

    // Check if battle should end
    if (gameState.attacker.armies < 1 || gameState.defender.armies === 0) {
        let message = '';
        if (gameState.defender.armies === 0) {
            message = `<strong>${t('victory')}</strong> ${gameState.attacker.name} ${t('hasConquered')}`;
        } else {
            message = `<strong>${t('battleOver')}</strong> ${gameState.attacker.name} ${t('noMoreArmies')}`;
        }
        document.getElementById('result-message').innerHTML = message;
        document.getElementById('roll-btn').style.display = 'none';
        
        // Change withdraw button to "New Battle"
        const withdrawBtn = document.getElementById('withdraw-btn');
        withdrawBtn.textContent = t('newBattle');
        withdrawBtn.className = 'btn'; // Reset to just primary button class
    }
}

function rollDice() {
    // Disable roll button during animation
    const rollBtn = document.getElementById('roll-btn');
    rollBtn.disabled = true;
    
    const attackerDiceCount = Math.min(gameState.attacker.armies, 3);
    const defenderDiceCount = Math.min(gameState.defender.armies, 2);

    // Roll dice
    const attackerRolls = [];
    const defenderRolls = [];

    for (let i = 0; i < attackerDiceCount; i++) {
        attackerRolls.push(Math.floor(Math.random() * 6) + 1);
    }

    for (let i = 0; i < defenderDiceCount; i++) {
        defenderRolls.push(Math.floor(Math.random() * 6) + 1);
    }

    // Sort dice (highest first)
    attackerRolls.sort((a, b) => b - a);
    defenderRolls.sort((a, b) => b - a);

    // Display dice with animations
    displayDiceComparison(attackerRolls, defenderRolls);

    // Calculate losses
    let attackerLosses = 0;
    let defenderLosses = 0;

    const comparisons = Math.min(attackerRolls.length, defenderRolls.length);

    for (let i = 0; i < comparisons; i++) {
        if (attackerRolls[i] > defenderRolls[i]) {
            defenderLosses++;
        } else {
            attackerLosses++;
        }
    }

    // Wait for dice animation to complete before showing results
    setTimeout(() => {
        // Apply glow effects to player cards
        const attackerCard = document.getElementById('attacker-card');
        const defenderCard = document.getElementById('defender-card');
        
        // Remove previous glow classes
        attackerCard.classList.remove('card-winner', 'card-loser', 'card-tie');
        defenderCard.classList.remove('card-winner', 'card-loser', 'card-tie');
        
        // Apply new glow based on results
        if (attackerLosses > 0 && defenderLosses > 0) {
            // Both lose - tie glow
            attackerCard.classList.add('card-tie');
            defenderCard.classList.add('card-tie');
        } else if (attackerLosses > 0) {
            // Defender wins
            attackerCard.classList.add('card-loser');
            defenderCard.classList.add('card-winner');
        } else if (defenderLosses > 0) {
            // Attacker wins
            attackerCard.classList.add('card-winner');
            defenderCard.classList.add('card-loser');
        }

        // Update armies
        gameState.attacker.armies -= attackerLosses;
        gameState.defender.armies -= defenderLosses;

        // Display result with visual styling
        const resultElement = document.getElementById('result-message');
        let resultText = '';
        
        // Remove previous classes
        resultElement.classList.remove('attacker-wins', 'defender-wins', 'both-lose');
        
        if (attackerLosses > 0 && defenderLosses > 0) {
            resultText = `${t('bothLoseArmies')}<br>${t('attacker')}: ${attackerLosses}, ${t('defender')}: ${defenderLosses}`;
            resultElement.classList.add('both-lose');
        } else if (attackerLosses > 0) {
            const armyText = attackerLosses === 1 ? t('army') : t('armies');
            resultText = `${gameState.defender.name} ${t('winsThisRound')}<br>${gameState.attacker.name} ${t('loses')} ${attackerLosses} ${armyText}`;
            resultElement.classList.add('defender-wins');
        } else if (defenderLosses > 0) {
            const armyText = defenderLosses === 1 ? t('army') : t('armies');
            resultText = `${gameState.attacker.name} ${t('winsThisRound')}<br>${gameState.defender.name} ${t('loses')} ${defenderLosses} ${armyText}`;
            resultElement.classList.add('attacker-wins');
        }

        resultElement.innerHTML = resultText;

        // Update battle display and re-enable button after a short delay
        setTimeout(() => {
            updateBattleDisplay();
            rollBtn.disabled = false;
        }, 400);
    }, 1100); // Wait for dice roll (500ms) + winner highlighting (600ms)
}

function displayDiceComparison(attackerRolls, defenderRolls) {
    const container = document.getElementById('dice-display');
    container.innerHTML = '';
    
    // Create main dice row
    const diceRow = document.createElement('div');
    diceRow.className = 'dice-row';
    
    // Attacker dice group
    const attackerGroup = document.createElement('div');
    attackerGroup.className = 'attacker-dice-group';
    
    attackerRolls.forEach((roll, index) => {
        const die = document.createElement('div');
        die.className = 'die attacker-die';
        die.textContent = roll;
        die.style.animationDelay = `${index * 0.1}s`;
        die.id = `attacker-die-${index}`;
        attackerGroup.appendChild(die);
    });
    
    // VS separator
    const vs = document.createElement('div');
    vs.className = 'vs-separator';
    vs.textContent = 'VS';
    
    // Defender dice group
    const defenderGroup = document.createElement('div');
    defenderGroup.className = 'defender-dice-group';
    
    defenderRolls.forEach((roll, index) => {
        const die = document.createElement('div');
        die.className = 'die defender-die';
        die.textContent = roll;
        die.style.animationDelay = `${index * 0.1}s`;
        die.id = `defender-die-${index}`;
        defenderGroup.appendChild(die);
    });
    
    diceRow.appendChild(attackerGroup);
    diceRow.appendChild(vs);
    diceRow.appendChild(defenderGroup);
    container.appendChild(diceRow);
    
    // Highlight winners/losers after animation
    const comparisons = Math.min(attackerRolls.length, defenderRolls.length);
    
    setTimeout(() => {
        for (let i = 0; i < comparisons; i++) {
            const aDie = document.getElementById(`attacker-die-${i}`);
            const dDie = document.getElementById(`defender-die-${i}`);
            
            if (attackerRolls[i] > defenderRolls[i]) {
                aDie.classList.add('winner');
                dDie.classList.add('loser');
            } else {
                // Defender wins ties
                aDie.classList.add('loser');
                dDie.classList.add('winner');
            }
        }
        
        // Fade unused attacker dice
        for (let i = comparisons; i < attackerRolls.length; i++) {
            const die = document.getElementById(`attacker-die-${i}`);
            if (die) die.style.opacity = '0.4';
        }
    }, 600);
}


function withdraw() {
    const withdrawBtn = document.getElementById('withdraw-btn');
    const isNewBattle = withdrawBtn.textContent === 'New Battle';
    
    if (isNewBattle) {
        // Direct return to home for new battle
        resetToHome();
    } else {
        // Confirm withdrawal during active battle
        if (confirm(t('confirmWithdraw'))) {
            resetToHome();
        }
    }
}

// Go home function
function goHome() {
    const currentScreen = document.querySelector('.screen.active');
    const inBattle = currentScreen.id === 'battle-screen';
    const inSetup = currentScreen.id === 'setup-attacker' || currentScreen.id === 'setup-defender';
    
    if (inBattle || inSetup) {
        if (confirm(t('confirmLeaveGame'))) {
            resetToHome();
        }
    } else {
        resetToHome();
    }
}

function clearBattleScreen() {
    // Clear battle display
    document.getElementById('dice-display').innerHTML = '';
    document.getElementById('result-message').innerHTML = t('clickToStartBattle');
    document.getElementById('result-message').classList.remove('attacker-wins', 'defender-wins', 'both-lose');
    
    // Clear glow effects from player cards
    const attackerCard = document.getElementById('attacker-card');
    const defenderCard = document.getElementById('defender-card');
    if (attackerCard) {
        attackerCard.classList.remove('card-winner', 'card-loser', 'card-tie');
    }
    if (defenderCard) {
        defenderCard.classList.remove('card-winner', 'card-loser', 'card-tie');
    }
    
    // Reset roll button
    const rollBtn = document.getElementById('roll-btn');
    rollBtn.style.display = 'block';
    rollBtn.disabled = false;
    
    // Reset withdraw button - ensure clean state
    const withdrawBtn = document.getElementById('withdraw-btn');
    withdrawBtn.textContent = t('withdraw');
    withdrawBtn.className = 'btn btn-secondary'; // Reset all classes
}

function resetToHome() {
    // Reset game state
    gameState.attacker.armies = 0;
    gameState.defender.armies = 0;
    gameState.attacker.page = 0;
    gameState.defender.page = 0;
    
    // Clear backgrounds
    document.getElementById('setup-attacker').style.background = '';
    document.getElementById('setup-defender').style.background = '';
    
    // Clear battle screen
    clearBattleScreen();
    
    // Go to player selection
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById('attacker-selection').classList.add('active');
    updateHeaderIcon('⚔️');
    
    // Reset buttons
    updateAttackerButtons();
    updateDefenderButtons();
}

// Make functions available globally
window.savePlayersAndStart = savePlayersAndStart;
window.selectAttacker = selectAttacker;
window.selectDefender = selectDefender;
window.selectAttackerArmy = selectAttackerArmy;
window.selectDefenderArmy = selectDefenderArmy;
window.changeAttackerPage = changeAttackerPage;
window.changeDefenderPage = changeDefenderPage;
window.rollDice = rollDice;
window.withdraw = withdraw;
window.goHome = goHome;
window.showSettings = showSettings;
window.changeLanguage = changeLanguage;
window.editPlayers = editPlayers;
window.backToGame = backToGame;

// Change language
function changeLanguage(lang) {
    setLanguage(lang);
    updateLanguageButtons();
    updateUILanguage();
}

// Update language button states
function updateLanguageButtons() {
    const currentLang = getCurrentLanguage();
    document.querySelectorAll('.language-btn').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Update all UI text to current language
function updateUILanguage() {
    // Settings screen
    document.getElementById('settings-title').textContent = t('settingsTitle');
    document.getElementById('language-label').textContent = t('languageLabel');
    document.getElementById('players-label').textContent = t('playersLabel');
    document.getElementById('edit-players-btn').textContent = t('playersLabel');
    document.getElementById('back-to-game-btn').textContent = t('backToGame');
    
    // Update language button texts
    document.getElementById('english-lang-text').textContent = t('englishLanguage');
    document.getElementById('danish-lang-text').textContent = t('danishLanguage');
    
    // Player setup
    document.getElementById('player-setup-title').textContent = t('playerSetupTitle');
    document.getElementById('player-setup-subtitle').textContent = t('playerSetupSubtitle');
    document.getElementById('save-start-btn').textContent = t('saveAndStart');
    
    // Update placeholders
    document.querySelector('[data-player="red"]').placeholder = t('redPlayer');
    document.querySelector('[data-player="blue"]').placeholder = t('bluePlayer');
    document.querySelector('[data-player="green"]').placeholder = t('greenPlayer');
    document.querySelector('[data-player="yellow"]').placeholder = t('yellowPlayer');
    document.querySelector('[data-player="black"]').placeholder = t('blackPlayer');
    document.querySelector('[data-player="purple"]').placeholder = t('purplePlayer');
    
    // Battle screens
    document.getElementById('who-attacking').textContent = t('whoIsAttacking');
    document.getElementById('who-defending').textContent = t('whoIsDefending');
    document.getElementById('attacker-army-label').textContent = t('numberOfArmiesAttack');
    document.getElementById('defender-army-label').textContent = t('numberOfArmiesDefend');
    document.getElementById('battle-title').textContent = t('battle');
    
    // Battle buttons
    document.getElementById('roll-btn').textContent = t('rollDice');
    const withdrawBtn = document.getElementById('withdraw-btn');
    if (withdrawBtn.textContent === 'New Battle' || withdrawBtn.textContent === 'Ny Kamp') {
        withdrawBtn.textContent = t('newBattle');
    } else {
        withdrawBtn.textContent = t('withdraw');
    }
    
    // Result message
    const resultMessage = document.getElementById('result-message');
    if (resultMessage.textContent === 'Click Roll to start battle!' || 
        resultMessage.textContent === 'Klik Kast for at starte kamp!') {
        resultMessage.textContent = t('clickToStartBattle');
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', function() {
    loadPlayers();
    updateUILanguage();
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker registration failed: ', err));
    });
}
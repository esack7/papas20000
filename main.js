"use strict";
// console.log('File is linked')
function randomId() {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
}
class Player {
    constructor(name) {
        this.id = 'player' + randomId();
        this.name = name;
        this.scores = [];
        this.totalScore = 0;
    }
    addRoundPoints(points) {
        if (this.totalScore === 0 && points < 1000 && points !== 0) {
            this.scores.push(0);
            return;
        }
        if (this.totalScore + points > Game.winningScore) {
            this.scores.push(0);
            throw new Error('Over20000');
        }
        if (points % 50 !== 0) {
            throw new Error('Not multiple of 50');
        }
        this.scores.push(points);
        this.totalScore = this.scores.reduce((acc, curr) => acc + curr);
        if (this.totalScore === Game.winningScore) {
            playLastRound(this);
        }
    }
    getScoresArray() {
        return this.scores.map(score => score.toString());
    }
    getTotalScore() {
        return this.totalScore;
    }
}
class Game {
    constructor() {
        this.id = 'game' + randomId();
        this.players = [];
        this.winnersBracket = [];
        this.currentPlayIndex = 0;
        this.activeGame = true;
        this.lastRound = false;
    }
    addPlayer(player) {
        this.players.push(player);
    }
    getCurrentPlayer() {
        return this.players[this.currentPlayIndex];
    }
    nextTurn() {
        const totalPlayers = this.players.length;
        this.currentPlayIndex += 1;
        if (this.currentPlayIndex >= totalPlayers) {
            this.currentPlayIndex = 0;
        }
    }
    addToWinnersBracket(player) {
        this.winnersBracket.push(player.name);
    }
}
Game.winningScore = 20000;
const loginSection = document.getElementById('login');
const addusersSection = document.getElementById('addusers');
const gameplaySection = document.getElementById('gameplay');
const gameOverSection = document.getElementById('gameOver');
const totalScore = document.getElementById('totalScore');
const scoreInput = document.getElementById('roundScore');
const playerInput = document.getElementById('playername');
const playersList = document.getElementById('listOfPlayers');
const addPlayerButton = document.getElementById('addplayer');
const addToScoreButton = document.getElementById('addToScore');
const prevScoresList = document.getElementById('previousScores');
const currentPlayerTitle = document.getElementById('currentPlayer');
const gameWarning = document.getElementById('gameWarning');
const previousScore = document.getElementById('previousScore');
const endTitle = document.getElementById('endTitle');
const endScores = document.getElementById('endScores');
const reloadPageButton = document.getElementById('reloadPage');
let game;
function startGame(e) {
    if (e.target != null) {
        const selected = e.target;
        if (selected.innerText === 'Start Game') {
            if (addusersSection.hidden) {
                loginSection.hidden = true;
                addusersSection.hidden = false;
                game = new Game();
            }
            else if (!addusersSection.hidden && game.players.length !== 0) {
                addusersSection.hidden = true;
                gameplaySection.hidden = false;
                currentPlayerTitle.innerText = `${game.getCurrentPlayer().name}'s turn`;
                totalScore.innerText = '0';
            }
        }
    }
}
;
function handleAddPlayerClick() {
    const playerNameInput = playerInput.value.trim();
    playerInput.value = '';
    playersList.innerHTML = '';
    if (playerNameInput !== '') {
        game.addPlayer(new Player(playerNameInput));
    }
    game.players.forEach(element => {
        const playerListItem = document.createElement('li');
        playerListItem.appendChild(document.createTextNode(element.name));
        playersList.appendChild(playerListItem);
    });
}
;
function handleAddToScoreClick() {
    const numberInput = parseInt(scoreInput.value);
    let error = false;
    scoreInput.value = '';
    if (!isNaN(numberInput)) {
        prevScoresList.innerHTML = '';
        const lastPlayer = game.getCurrentPlayer();
        try {
            game.getCurrentPlayer().addRoundPoints(numberInput);
        }
        catch (err) {
            error = true;
            if (err.message === 'Over20000') {
                gameWarning.innerText = `${lastPlayer.name}'s total score went over 20,000 so their last score was zero`;
            }
            if (err.message === 'Not multiple of 50') {
                gameWarning.innerText = 'The score must be a multiple of 50.';
                gameWarning.style.display = 'inherit';
                return;
            }
        }
        game.nextTurn();
        const currentPlayer = game.getCurrentPlayer();
        if (game.lastRound && game.winnersBracket.includes(currentPlayer.name)) {
            if (game.winnersBracket.length === 1) {
                handleWin(currentPlayer);
            }
            else {
                handleShowdown(game);
            }
        }
        else {
            const playersTotalScore = currentPlayer.getTotalScore();
            const lastPlayerScores = lastPlayer.getScoresArray();
            if (playersTotalScore === 0) {
                error = true;
                gameWarning.innerText = `You must score at least 1000 points to get on the board, otherwise your score is 0 for this round.`;
            }
            if (!error) {
                gameWarning.style.display = 'none';
            }
            else {
                gameWarning.style.display = 'inherit';
            }
            if (lastPlayerScores.length > 0 && playersTotalScore !== 0) {
                previousScore.innerText = `${lastPlayer.name}'s score was ${lastPlayerScores[lastPlayerScores.length - 1]}`;
                previousScore.hidden = false;
            }
            currentPlayerTitle.innerText = `${currentPlayer.name}'s turn`;
            totalScore.innerText = playersTotalScore.toString();
            currentPlayer.getScoresArray().forEach(score => {
                const scoreListItem = document.createElement('li');
                scoreListItem.appendChild(document.createTextNode(score));
                prevScoresList.appendChild(scoreListItem);
            });
        }
    }
}
;
function playLastRound(playerWhoReachedTwentyThousand) {
    game.lastRound = true;
    game.addToWinnersBracket(playerWhoReachedTwentyThousand);
}
function handleWin(winningPlayer) {
    console.log(`${winningPlayer.name} has won the game!!!`);
    gameplaySection.hidden = true;
    gameOverSection.hidden = false;
    endTitle.innerText = `${winningPlayer.name} has won the game!!!`;
    game.players.forEach(player => {
        const playerRow = document.createElement('tr');
        const playerNameTD = document.createElement('td');
        playerNameTD.appendChild(document.createTextNode(player.name));
        playerRow.appendChild(playerNameTD);
        const playerScoreTD = document.createElement('td');
        playerScoreTD.appendChild(document.createTextNode(player.getTotalScore().toLocaleString()));
        playerRow.appendChild(playerScoreTD);
        endScores.appendChild(playerRow);
    });
    game.activeGame = false;
}
function handleShowdown(game) {
    console.log(`Game Showdown!!!`);
    gameplaySection.hidden = true;
    gameOverSection.hidden = false;
    let listOfShowdownPlayers = '\n';
    game.winnersBracket.forEach(player => listOfShowdownPlayers = listOfShowdownPlayers + player + '\n');
    endTitle.innerText = `The following players tied at 20,000 points each!
    ${listOfShowdownPlayers}
    Time for a SHOWDOWN!!!`;
    game.players.forEach(player => {
        const playerRow = document.createElement('tr');
        const playerNameTD = document.createElement('td');
        playerNameTD.appendChild(document.createTextNode(player.name));
        playerRow.appendChild(playerNameTD);
        const playerScoreTD = document.createElement('td');
        playerScoreTD.appendChild(document.createTextNode(player.getTotalScore().toLocaleString()));
        playerRow.appendChild(playerScoreTD);
        endScores.appendChild(playerRow);
    });
    game.activeGame = false;
}
function playAgain() {
    window.location.reload();
}
loginSection.addEventListener('click', e => startGame(e));
addusersSection.addEventListener('click', e => startGame(e));
addToScoreButton.addEventListener('click', handleAddToScoreClick);
addPlayerButton.addEventListener('click', handleAddPlayerClick);
reloadPageButton.addEventListener('click', playAgain);

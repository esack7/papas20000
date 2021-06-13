"use strict";
console.log('File is linked');
const loginSection = document.getElementById('login');
const addusersSection = document.getElementById('addusers');
const gameplaySection = document.getElementById('gameplay');
const counter = document.getElementById('totalScore');
const scoreInput = document.getElementById('roundScore');
const playerInput = document.getElementById('playername');
const playersList = document.getElementById('listOfPlayers');
const addPlayerButton = document.getElementById('addplayer');
const addToScoreButton = document.getElementById('addToScore');
const prevScoresList = document.getElementById('previousScores');
const currentPlayerTitle = document.getElementById('currentPlayer');
let game;
let currentPlayer = '';
function startGame(e) {
    if (e.target != null) {
        const selected = e.target;
        if (selected.innerText === 'Start Game') {
            if (addusersSection.hidden) {
                loginSection.hidden = true;
                addusersSection.hidden = false;
                game = {
                    count: 0,
                    currentPlayer: 0,
                    players: [],
                    playerMap: new Map()
                };
                counter.innerText = game.count.toString();
            }
            else {
                addusersSection.hidden = true;
                gameplaySection.hidden = false;
                currentPlayer = game.players[game.currentPlayer];
                currentPlayerTitle.innerText = `${currentPlayer}'s turn`;
            }
        }
    }
}
;
function handleAddPlayerClick() {
    const playerNameInput = playerInput.value;
    playerInput.value = '';
    playersList.innerHTML = '';
    game.players.push(playerNameInput);
    game.playerMap.set(playerNameInput, []);
    game.players.forEach(element => {
        const playerListItem = document.createElement('li');
        playerListItem.appendChild(document.createTextNode(element));
        playersList.appendChild(playerListItem);
    });
}
;
function nextPlayersTurn() {
}
function handleAddToScoreClick() {
    const numberInput = parseInt(scoreInput.value);
    scoreInput.value = '';
    if (!isNaN(numberInput)) {
        prevScoresList.innerHTML = '';
        game.playerMap.get(currentPlayer).push(numberInput);
        game.count += numberInput;
        counter.innerText = game.count.toString();
        // console.log(scoresArray);
        game.playerMap.get(currentPlayer).forEach(element => {
            const scoreListItem = document.createElement('li');
            scoreListItem.appendChild(document.createTextNode(element.toString()));
            prevScoresList.appendChild(scoreListItem);
        });
    }
}
;
loginSection.addEventListener('click', e => startGame(e));
addusersSection.addEventListener('click', e => startGame(e));
addToScoreButton.addEventListener('click', handleAddToScoreClick);
addPlayerButton.addEventListener('click', handleAddPlayerClick);

import { Player } from './player';
import { removeAllChildNodes } from './utils';
import { Game } from './game';

export const loginSection = <HTMLElement>document.getElementById('login');
export const addusersSection = <HTMLElement>document.getElementById('addusers');
export const gameplaySection = <HTMLElement>document.getElementById('gameplay');
export const gameOverSection = <HTMLElement>document.getElementById('gameOver');
export const menuSection = <HTMLElement>document.getElementById('menu');
export const leaderboardSection = <HTMLElement>document.getElementById('leaderboard');
export const totalScore = <HTMLHeadingElement>document.getElementById('totalScore');
export const scoreInput = <HTMLInputElement>document.getElementById('roundScore');
export const playerInput = <HTMLInputElement>document.getElementById('playername');
export const playersList = <HTMLOListElement>document.getElementById('listOfPlayers');
export const addPlayerButton = <HTMLButtonElement>document.getElementById('addplayer');
export const addToScoreButton = <HTMLButtonElement>document.getElementById('addToScore');
export const showMenuButton = <HTMLButtonElement>document.getElementById('showMenu');
export const closeMenuButton = <HTMLButtonElement>document.getElementById('closeMenu');
export const closeLeaderboard = <HTMLButtonElement>document.getElementById('closeLeaderboard');
export const cancelGameButton = <HTMLButtonElement>document.getElementById('cancelGame');
export const showLeaderboardButton = <HTMLButtonElement>document.getElementById('showLeaderboard');
export const undoButton = <HTMLButtonElement>document.getElementById('undoLastMove');
export const prevScoresList = <HTMLOListElement>document.getElementById('previousScores');
export const currentPlayerTitle = <HTMLHeadingElement>document.getElementById('currentPlayer');
export const gameWarning = <HTMLHeadingElement>document.getElementById('gameWarning');
export const previousScore = <HTMLHeadingElement>document.getElementById('previousScore');
export const endTitle = <HTMLHeadingElement>document.getElementById('endTitle');
export const endScores = <HTMLHeadingElement>document.getElementById('endScores');
export const leaderboardScores = <HTMLHeadingElement>document.getElementById('leaderboardScores');
export const reloadPageButton = <HTMLHeadingElement>document.getElementById('reloadPage');

export function handlePostScoreDisplay(game: Game) {
    const currentPlayer = game.getCurrentPlayer();
    gameWarning.hidden = true;
    let lastPlayer: Player;
    if (game.currentPlayIndex === 0) {
        lastPlayer = game.players[game.players.length - 1]
    } else {
        lastPlayer = game.players[game.currentPlayIndex - 1]
    }
    if (game.lastRound && game.winnersBracket.includes(currentPlayer.name)) {
            if (game.winnersBracket.length === 1) {
                handleWin(currentPlayer, game);
            } else {
                handleShowdown(game);
            }
    } else {
        const playersTotalScore = currentPlayer.getTotalScore();
        const lastPlayerScores = lastPlayer.getScoresArray();
        if (playersTotalScore === 0) {
            game.errorState = true;
            game.gameWarningText = `You must score at least 1000 points to get on the board, otherwise your score is 0 for this round.`;
        }
        if (game.errorState) {
            gameWarning.innerText = game.gameWarningText;
            gameWarning.hidden = false;
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

export function handleAddPlayerClick(game: Game) {
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
    })
};

export function handleAddToScoreClick(game: Game) {
    game.previousState = '';
    game.previousState = JSON.stringify(game);
    const numberInput = parseInt(scoreInput.value);
    game.errorState = false;
    scoreInput.value = '';
    if (!isNaN(numberInput)) {
        prevScoresList.innerHTML = '';
        const lastPlayer = game.getCurrentPlayer();
        try {
            game.getCurrentPlayer().addRoundPoints(numberInput, game);
        } catch (err: any) {
            game.errorState = true;
            if (err.message === 'Over20000') {
                game.gameWarningText = `${lastPlayer.name}'s total score went over 20,000 so their last score was zero`;
            }
            if (err.message === 'Not multiple of 50') {
                game.gameWarningText = 'The score must be a multiple of 50.';
                localStorage.setItem('recentGame', JSON.stringify(game));
                handlePostScoreDisplay(game);
                return;
            }
        }
        game.nextTurn();
        localStorage.setItem('recentGame', JSON.stringify(game));
        handlePostScoreDisplay(game);
    }
};

export function handleShowMenuClick(game: Game) {
    if(game.previousState === '') {
        undoButton.hidden = true;
    } else {
        undoButton.hidden = false;
    }
    gameplaySection.hidden = true;
    menuSection.hidden = false;
}

export function handleCloseMenuClick() {
    menuSection.hidden = true;
    gameplaySection.hidden = false;
}

export function handleCancelGame(game: Game) {
    game.activeGame = false;
    localStorage.setItem('recentGame', JSON.stringify(game));
    window.location.reload();
}

export function handleUndoLastScore(game: Game) {
    localStorage.setItem('recentGame', game.previousState);
    window.location.reload();
}

export function handleShowLeaderboard(game: Game) {
    menuSection.hidden = true;
    leaderboardSection.hidden = false;
    removeAllChildNodes(leaderboardScores);
    const sortingArray: Player[] = [];
    game.players.forEach(player => sortingArray.push(player));
    sortingArray.sort((a, b) => b.getTotalScore() - a.getTotalScore()).forEach(player => {
        const playerRow = document.createElement('tr');
        const playerNameTD = document.createElement('td');
        playerNameTD.appendChild(document.createTextNode(player.name));
        playerRow.appendChild(playerNameTD);
        const playerScoreTD = document.createElement('td');
        playerScoreTD.appendChild(document.createTextNode(player.getTotalScore().toLocaleString()));
        playerRow.appendChild(playerScoreTD);
        leaderboardScores.appendChild(playerRow);
    });
}

export function handleCloseLeaderboard() {
    leaderboardSection.hidden = true;
    gameplaySection.hidden = false;
}

export function handleWin(winningPlayer: Player, game: Game) {
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
}

export function handleShowdown(game: Game) {
    gameplaySection.hidden = true;
    gameOverSection.hidden = false;
    let listOfShowdownPlayers = '\n';
    game.winnersBracket.forEach(player => listOfShowdownPlayers = listOfShowdownPlayers + player + '\n');
    endTitle.innerText = `The following players tied at 20,000 points each!\n    ${listOfShowdownPlayers}\n    Time for a SHOWDOWN!!!`;
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
}
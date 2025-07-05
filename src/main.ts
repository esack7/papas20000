import { Game, GameInterface } from './game';
import { Player } from './player';
import {
    loginSection,
    addusersSection,
    gameplaySection,
    gameOverSection,
    menuSection,
    leaderboardSection,
    totalScore,
    scoreInput,
    playerInput,
    playersList,
    addPlayerButton,
    addToScoreButton,
    showMenuButton,
    closeMenuButton,
    closeLeaderboard,
    cancelGameButton,
    showLeaderboardButton,
    undoButton,
    prevScoresList,
    currentPlayerTitle,
    gameWarning,
    previousScore,
    endTitle,
    endScores,
    leaderboardScores,
    reloadPageButton,
    handleAddPlayerClick,
    handleAddToScoreClick,
    handleShowMenuClick,
    handleCloseMenuClick,
    handleCancelGame,
    handleUndoLastScore,
    handleShowLeaderboard,
    handleCloseLeaderboard,
    handlePostScoreDisplay,
    handleWin,
    handleShowdown
} from './ui';

let game: Game;

function startGame(e: Event) {
    if (e.target != null) {
        const selected = <HTMLElement>e.target;
        if (selected.innerText === 'Start Game') {
            if (addusersSection.hidden) {
                loginSection.hidden = true;
                addusersSection.hidden = false;
                game = new Game();
            } else if (!addusersSection.hidden && game.players.length !== 0) {
                addusersSection.hidden = true;
                gameplaySection.hidden = false;
                localStorage.setItem('recentGame', JSON.stringify(game));
                handlePostScoreDisplay(game);
            }
        }
    }
};


    





function playAgain() {
    game.activeGame = false;
    localStorage.setItem('recentGame', JSON.stringify(game));
    window.location.reload();
}

function loadGame(gameState: GameInterface) {
    game = new Game(gameState.id, gameState.players, gameState.winnersBracket, gameState.currentPlayIndex, gameState.activeGame, gameState.lastRound, gameState.gameWarningText, gameState.errorState);
    loginSection.hidden = true;
    addusersSection.hidden = true;
    gameplaySection.hidden = false;
    handlePostScoreDisplay(game);
}

window.onload = () => {
    if (localStorage.recentGame) {
        const gameState = <GameInterface>JSON.parse(localStorage.recentGame);
        if (gameState.activeGame) {
            loadGame(gameState);
        }
    }
}

loginSection.addEventListener('click', e => startGame(e));
addusersSection.addEventListener('click', e => startGame(e));
addToScoreButton.addEventListener('click', () => handleAddToScoreClick(game));
addPlayerButton.addEventListener('click', () => handleAddPlayerClick(game));
reloadPageButton.addEventListener('click', playAgain);
showMenuButton.addEventListener('click', () => handleShowMenuClick(game));
closeMenuButton.addEventListener('click', handleCloseMenuClick);
cancelGameButton.addEventListener('click', () => handleCancelGame(game));
undoButton.addEventListener('click', () => handleUndoLastScore(game));
showLeaderboardButton.addEventListener('click', () => handleShowLeaderboard(game));
closeLeaderboard.addEventListener('click', handleCloseLeaderboard);
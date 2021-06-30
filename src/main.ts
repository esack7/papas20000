function randomId(): string {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
}

class Player {
    readonly id: string;
    readonly name: string;
    readonly scores: number[];
    private totalScore: number;

    constructor(name: string, id: string = 'player' + randomId(), scores: number[] = [], totalScore = 0) {
        this.id = id;
        this.name = name;
        this.scores = scores;
        this.totalScore = totalScore;
    }

    addRoundPoints(points: number): void {
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

    getScoresArray(): string[] {
        return this.scores.map(score => score.toString());
    }

    getTotalScore(): number {
        return this.totalScore;
    }
}

interface GameInterface {
    id: string;
    players: Player[];
    winnersBracket: string[];
    currentPlayIndex: number;
    activeGame: boolean;
    lastRound: boolean;
    gameWarningText: string;
    errorState: boolean;
}

class Game implements GameInterface {
    readonly id: string;
    readonly players: Player[];
    readonly winnersBracket: string[];
    currentPlayIndex: number;
    activeGame: boolean;
    lastRound: boolean;
    gameWarningText: string;
    errorState: boolean;
    static winningScore: number = 20000;

    constructor(id = `game${randomId()}`, players: Player[] = [], winnersBracket: string[] = [], currentPlayIndex = 0, activeGame = true, lastRound = false, gameWarningText = '', errorState = false) {
        this.id = id
        this.winnersBracket = winnersBracket;
        this.currentPlayIndex = currentPlayIndex;
        this.activeGame = activeGame;
        this.lastRound = lastRound;
        this.gameWarningText = gameWarningText;
        this.errorState = errorState;
        if (players.length === 0) {
            this.players = players;
        } else {
            this.players = players.map(player => {
                if (player.scores.length === 0) {
                    return new Player(player.name, player.id, player.scores, 0)
                } else {
                    return new Player(player.name, player.id, player.scores, player.scores.reduce((acc, curr) => acc + curr))
                }
            })
        }
    }

    addPlayer(player: Player) {
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
    addToWinnersBracket(player: Player) {
        this.winnersBracket.push(player.name);
    }
}

const loginSection = <HTMLElement>document.getElementById('login');
const addusersSection = <HTMLElement>document.getElementById('addusers');
const gameplaySection = <HTMLElement>document.getElementById('gameplay');
const gameOverSection = <HTMLElement>document.getElementById('gameOver');
const menuSection = <HTMLElement>document.getElementById('menu');
const totalScore = <HTMLHeadingElement>document.getElementById('totalScore');
const scoreInput = <HTMLInputElement>document.getElementById('roundScore');
const playerInput = <HTMLInputElement>document.getElementById('playername');
const playersList = <HTMLOListElement>document.getElementById('listOfPlayers');
const addPlayerButton = <HTMLButtonElement>document.getElementById('addplayer');
const addToScoreButton = <HTMLButtonElement>document.getElementById('addToScore');
const showMenuButton = <HTMLButtonElement>document.getElementById('showMenu');
const closeMenuButton = <HTMLButtonElement>document.getElementById('closeMenu');
const prevScoresList = <HTMLOListElement>document.getElementById('previousScores');
const currentPlayerTitle = <HTMLHeadingElement>document.getElementById('currentPlayer');
const gameWarning = <HTMLHeadingElement>document.getElementById('gameWarning');
const previousScore = <HTMLHeadingElement>document.getElementById('previousScore');
const endTitle = <HTMLHeadingElement>document.getElementById('endTitle');
const endScores = <HTMLHeadingElement>document.getElementById('endScores');
const reloadPageButton = <HTMLHeadingElement>document.getElementById('reloadPage');

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
                handlePostScoreDisplay();
            }
        }
    }
};

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
    })
};

function handleAddToScoreClick() {
    const numberInput = parseInt(scoreInput.value);
    game.errorState = false;
    scoreInput.value = '';
    if (!isNaN(numberInput)) {
        prevScoresList.innerHTML = '';
        const lastPlayer = game.getCurrentPlayer();
        try {
            game.getCurrentPlayer().addRoundPoints(numberInput);
        } catch (err) {
            game.errorState = true;
            if (err.message === 'Over20000') {
                game.gameWarningText = `${lastPlayer.name}'s total score went over 20,000 so their last score was zero`;
            }
            if (err.message === 'Not multiple of 50') {
                game.gameWarningText = 'The score must be a multiple of 50.';
                localStorage.setItem('recentGame', JSON.stringify(game));
                handlePostScoreDisplay();
                return;
            }
        }
        game.nextTurn();
        localStorage.setItem('recentGame', JSON.stringify(game));
        handlePostScoreDisplay();
    }
};

function handlePostScoreDisplay() {
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
            handleWin(currentPlayer);
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

function playLastRound(playerWhoReachedTwentyThousand: Player) {
    game.lastRound = true;
    game.addToWinnersBracket(playerWhoReachedTwentyThousand);
}

function handleWin(winningPlayer: Player) {
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
    localStorage.setItem('recentGame', JSON.stringify(game));
}

function handleShowdown(game: Game) {
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
    localStorage.setItem('recentGame', JSON.stringify(game));
}

function playAgain() {
    window.location.reload();
}

function loadGame(gameState: GameInterface) {
    game = new Game(gameState.id, gameState.players, gameState.winnersBracket, gameState.currentPlayIndex, gameState.activeGame, gameState.lastRound, gameState.gameWarningText, gameState.errorState);
    loginSection.hidden = true;
    addusersSection.hidden = true;
    gameplaySection.hidden = false;
    handlePostScoreDisplay();
}

function handleShowMenuClick() {
    gameplaySection.hidden = true;
    menuSection.hidden = false;
}

function handleCloseMenuClick() {
    menuSection.hidden = true;
    gameplaySection.hidden = false;
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
addToScoreButton.addEventListener('click', handleAddToScoreClick);
addPlayerButton.addEventListener('click', handleAddPlayerClick);
reloadPageButton.addEventListener('click', playAgain);
showMenuButton.addEventListener('click', handleShowMenuClick);
closeMenuButton.addEventListener('click', handleCloseMenuClick);
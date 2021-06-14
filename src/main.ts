// console.log('File is linked')
function randomId(): string {
    const uint32 = window.crypto.getRandomValues(new Uint32Array(1))[0];
    return uint32.toString(16);
}

class Player {
    readonly id: string;
    readonly name: string;
    private scores: number[];
    private totalScore: number;

    constructor(name: string) {
        this.id = 'player' + randomId();
        this.name = name;
        this.scores = [];
        this.totalScore = 0;
    }

    addRoundPoints(points: number): void {
        if(this.totalScore === 0 && points < 1000 && points !== 0) {
            this.scores.push(0);
            return;
        }

        if(this.totalScore + points > 20000) {
            this.scores.push(0);
            throw new Error('Over20000');
        }

        this.scores.push(points);
        this.totalScore = this.scores.reduce((acc, curr) => acc + curr);
    }

    getScoresArray(): string[] {
        return this.scores.map(score => score.toString());
    }

    getTotalScore(): number {
        return this.totalScore;
    }
}

class Game {
    readonly id: string;
    readonly players: Player[];
    private currentPlayIndex: number;
    readonly winningScore: number;

    constructor() {
        this.id = 'game' + randomId();
        this.players = [];
        this.currentPlayIndex = 0;
        this.winningScore = 20000
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
        if(this.currentPlayIndex >= totalPlayers) {
            this.currentPlayIndex = 0;
        }
    }
}

const loginSection = <HTMLElement>document.getElementById('login');
const addusersSection = <HTMLElement>document.getElementById('addusers');
const gameplaySection = <HTMLElement>document.getElementById('gameplay');
const totalScore = <HTMLHeadingElement>document.getElementById('totalScore');
const scoreInput = <HTMLInputElement>document.getElementById('roundScore');
const playerInput = <HTMLInputElement>document.getElementById('playername');
const playersList = <HTMLOListElement>document.getElementById('listOfPlayers');
const addPlayerButton = <HTMLButtonElement>document.getElementById('addplayer');
const addToScoreButton = <HTMLButtonElement>document.getElementById('addToScore');
const prevScoresList = <HTMLOListElement>document.getElementById('previousScores');
const currentPlayerTitle = <HTMLHeadingElement>document.getElementById('currentPlayer');
const gameWarning = <HTMLHeadingElement>document.getElementById('gameWarning');

let game: Game;

function startGame(e: Event) {
    if(e.target != null) {
        const selected = <HTMLElement>e.target;
        if(selected.innerText === 'Start Game') {
            if(addusersSection.hidden) {
                loginSection.hidden = true;
                addusersSection.hidden = false;
                game = new Game();
            } else {
                addusersSection.hidden = true;
                gameplaySection.hidden = false;
                currentPlayerTitle.innerText = `${game.getCurrentPlayer().name}'s turn`;
                totalScore.innerText = '0';
            }
        }
    }
};

function handleAddPlayerClick() {
    const playerNameInput = playerInput.value.trim();
    playerInput.value = '';
    playersList.innerHTML = '';
    game.addPlayer(new Player(playerNameInput));
    game.players.forEach(element => {
        const playerListItem = document.createElement('li');
        playerListItem.appendChild(document.createTextNode(element.name));
        playersList.appendChild(playerListItem);
    })
};

function handleAddToScoreClick() {
    const numberInput = parseInt(scoreInput.value);
    let error = false;
    scoreInput.value = '';
    if (!isNaN(numberInput)) {
        prevScoresList.innerHTML = '';
        try {
            game.getCurrentPlayer().addRoundPoints(numberInput); //Need to check for win
        } catch (err) {
            error = true;
            if(err.message === 'Over20000') {
                const lastPlayer = game.getCurrentPlayer().name;
                gameWarning.innerText = `${lastPlayer}'s total score went over 20,000 so their last score was zero`;
            }
        }
        
        game.nextTurn();
        const currentPlayer = game.getCurrentPlayer();
        const playersTotalScore = currentPlayer.getTotalScore();
        if(currentPlayer.getTotalScore() === 0) {
            error = true;
            gameWarning.innerText = `You must score at least 1000 points to get on the board, otherwise your score is 0 for this round.`;
        }
        if(!error) {
            gameWarning.style.display = 'none';
        } else {
            gameWarning.style.display = 'inherit';
        }
        currentPlayerTitle.innerText = `${currentPlayer.name}'s turn`;
        totalScore.innerText = playersTotalScore.toString();
        currentPlayer.getScoresArray().forEach(score => {
            const scoreListItem = document.createElement('li');
            scoreListItem.appendChild(document.createTextNode(score));
            prevScoresList.appendChild(scoreListItem);
        });
    }
};

loginSection.addEventListener('click', e => startGame(e));
addusersSection.addEventListener('click', e => startGame(e));
addToScoreButton.addEventListener('click', handleAddToScoreClick);
addPlayerButton.addEventListener('click', handleAddPlayerClick);
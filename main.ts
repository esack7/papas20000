console.log('File is linked')
interface Game {
    count: number;
    currentPlayer: number;
    players: string[];
    playerMap: Map<string, number[]>;
}

const loginSection = <HTMLElement>document.getElementById('login');
const addusersSection = <HTMLElement>document.getElementById('addusers');
const gameplaySection = <HTMLElement>document.getElementById('gameplay');
const counter = <HTMLHeadingElement>document.getElementById('totalScore');
const scoreInput = <HTMLInputElement>document.getElementById('roundScore');
const playerInput = <HTMLInputElement>document.getElementById('playername');
const playersList = <HTMLOListElement>document.getElementById('listOfPlayers');
const addPlayerButton = <HTMLButtonElement>document.getElementById('addplayer');
const addToScoreButton = <HTMLButtonElement>document.getElementById('addToScore');
const prevScoresList = <HTMLOListElement>document.getElementById('previousScores');
const currentPlayerTitle = <HTMLHeadingElement>document.getElementById('currentPlayer');

let game: Game;
let currentPlayer = '';

function startGame(e: Event) {
    if(e.target != null) {
        const selected = <HTMLElement>e.target;
        if(selected.innerText === 'Start Game') {
            if(addusersSection.hidden) {
                loginSection.hidden = true;
                addusersSection.hidden = false;
                game = {
                    count: 0,
                    currentPlayer: 0,
                    players: [],
                    playerMap: new Map<string, number[]>()
                };
                counter.innerText = game.count.toString();
            } else {
                addusersSection.hidden = true;
                gameplaySection.hidden = false;
                currentPlayer = game.players[game.currentPlayer];
                currentPlayerTitle.innerText = `${currentPlayer}'s turn`
            }
        }
    }
};

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
    })
};

function nextPlayersTurn() {
    
}

function handleAddToScoreClick() {
    const numberInput = parseInt(scoreInput.value)
    scoreInput.value = '';
    if (!isNaN(numberInput)) {
        prevScoresList.innerHTML = '';
        game.playerMap.get(currentPlayer)!.push(numberInput);
        game.count += numberInput;
        counter.innerText = game.count.toString();
        // console.log(scoresArray);
        game.playerMap.get(currentPlayer)!.forEach(element => {
            const scoreListItem = document.createElement('li');
            scoreListItem.appendChild(document.createTextNode(element.toString()));
            prevScoresList.appendChild(scoreListItem);
        });
    }
};

loginSection.addEventListener('click', e => startGame(e));
addusersSection.addEventListener('click', e => startGame(e));
addToScoreButton.addEventListener('click', handleAddToScoreClick);
addPlayerButton.addEventListener('click', handleAddPlayerClick);
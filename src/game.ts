import { Player } from './player';
import { randomId } from './utils';

export interface GameInterface {
    id: string;
    players: Player[];
    winnersBracket: string[];
    currentPlayIndex: number;
    activeGame: boolean;
    lastRound: boolean;
    gameWarningText: string;
    errorState: boolean;
    previousState: string;
}

export class Game implements GameInterface {
    readonly id: string;
    readonly players: Player[];
    readonly winnersBracket: string[];
    currentPlayIndex: number;
    activeGame: boolean;
    lastRound: boolean;
    gameWarningText: string;
    errorState: boolean;
    previousState: string;
    static winningScore: number = 20000;

    constructor(id = `game${randomId()}`, players: Player[] = [], winnersBracket: string[] = [], currentPlayIndex = 0, activeGame = true, lastRound = false, gameWarningText = '', errorState = false, previousState = '') {
        this.id = id
        this.winnersBracket = winnersBracket;
        this.currentPlayIndex = currentPlayIndex;
        this.activeGame = activeGame;
        this.lastRound = lastRound;
        this.gameWarningText = gameWarningText;
        this.errorState = errorState;
        this.previousState = previousState;
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

    playLastRound(playerWhoReachedTwentyThousand: Player) {
        this.lastRound = true;
        this.addToWinnersBracket(playerWhoReachedTwentyThousand);
    }

    handleWin(winningPlayer: Player) {
        this.activeGame = false;
        localStorage.setItem('recentGame', JSON.stringify(this));
    }

    handleShowdown() {
        this.activeGame = false;
        localStorage.setItem('recentGame', JSON.stringify(this));
    }
}
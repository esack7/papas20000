import { randomId } from './utils';
import { Game } from './game';

export class Player {
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

    addRoundPoints(points: number, game: Game): void {
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
            game.playLastRound(this);
        }
    }

    getScoresArray(): string[] {
        return this.scores.map(score => score.toString());
    }

    getTotalScore(): number {
        return this.totalScore;
    }
}
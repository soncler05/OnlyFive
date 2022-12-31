import { Pin } from "src/tools/pin";
import { Player } from "src/tools/player";

export class Game {
    id: number;
    urlId: string;
    startDate: Date;
    endDate?: Date;
    hostDevice: string;
    guestDevice: string;
    hostId: string;
    guestId: string;
    gameRound: GameRoundsEnum;
    host: Player;
    guest: Player;
    hostName: string;
    guestName: string;
    hostScore: number;
    guestScore: number;
    lastRoundOffset: number;
}
export class Round {
    offset: number;
    startDate: Date;
    endDate: Date;
    pawnMap: string;
    gameId: number;
}
export class LastRound {
    round: Round;
    game: Game;
}

export class NewPin {
    offset: number;
    pin: Pin;
    gameUrlId: string;
}

export class CompleteRound {
    offset: number;
    playerId: string;
    gameUrlId: string;
}

export enum GameRoundsEnum{
    One = 1,
    Three = 3,
    Five = 5,
    Nine = 9
}

import { Player } from "src/tools/player";
import { User } from "./user";

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
    // host: User;
    // guest: User;
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

export enum GameRoundsEnum{
    One = 1,
    Three = 3,
    Five = 5,
    Nine = 9
}
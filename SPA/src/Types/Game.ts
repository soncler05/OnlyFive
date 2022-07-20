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
}
export class Round {
    offset: number;
    startDate: string;
    endDate: string;
    pawnMap: string;
    gameId: string;
}

export enum GameRoundsEnum{
    One = 1,
    Three = 3,
    Five = 5,
    Nine = 9
}
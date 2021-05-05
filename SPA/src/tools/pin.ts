export interface Pin extends BasePin {
    // x: number;
    // y: number;
    id: number;
    playerId: string;
}
export interface PinGroup extends BasePin {
    pinIds: number[];
    playerId: string;
    directionIndex: number;
}
export interface BasePin {
    x: number;
    y: number;
}

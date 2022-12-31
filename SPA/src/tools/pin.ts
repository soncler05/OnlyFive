export interface Pin extends BasePin {
    id: number;
    playerId: string;
    date: Date;
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
export interface IsValidGroup  {
    isGroupValid: IsValidGroupResult;
    group: PinGroup;
}
export interface IsValidGroupResult {
    result: boolean,
        start: boolean,
        end: boolean,
        startAdditionalPins: number,
        endAdditionalPins: number,
        startPattern: number[],
        endPattern: number[]
}

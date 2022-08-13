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

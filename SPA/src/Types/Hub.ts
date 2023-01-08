export interface Hub {
    type: HubDataTypeEnum;
    data: string;
}

export enum HubDataTypeEnum {
    Ping = 1,
    Guest,
    Host,
    NewUserName,
    Pin
}


export enum UserTypeEnum
{
    Host = 1,
    Guest = 2
}

export interface HubNewGuest {
    deviceId: string;
    playerId: string;
    userName: string;
}

export interface HubNewUserName {
    playerType: UserTypeEnum;
    userName: string;
}
export interface HubCallback {
    type: HubDataTypeEnum;
    callback: (data) => void;
}
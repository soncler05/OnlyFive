export interface Player {
    playerId: string;
    name: string;
    userName: string;
    color: string;
    device: string;
    currentTurn: boolean;
}

export class Helper {
    public static readonly COLORS: string[] = [
        '#D33F49',
        '#77BA99'
    ];
    public static readonly AUTOMATICPLAYER: Player = {
        playerId: '73B7E6AC-CD0E-480F-81EE-1BBBA9A9E95A',
        color: '#D33F49',
        userName: 'SmartNía',
        name: 'Nía',
        currentTurn: true
    } as Player;

    public static uuidv4(): string {
        // @ts-ignore
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
      
}
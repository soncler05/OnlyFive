import { CanvasProfile } from "./canvas-profile";
import { Player } from "./player";


export class Helper {
    public static readonly COLORS: string[] = [
        '#D33F49',
        '#77BA99'
    ];
    public static readonly AUTOMATIC_PLAYER: Player = {
        playerId: '40b2ad9d-64e2-4b41-9706-8b4e29fe6851',
        color: Helper.COLORS[0],
        userName: 'SmartNía',
        name: 'Nía',
        currentTurn: true
    } as Player;
    public static readonly DEFAULT_PLAYER: Player = {
        playerId: '9a1bc0bc-8a63-4b8d-b094-56353d2a8031',
        color: Helper.COLORS[1],
        userName: 'defaultUser',
        name: 'defaultUser',
        currentTurn: true
    } as Player;
    public static readonly DEFAULT_GUEST_PLAYER: Player = {
        playerId: 'B8B1D26B-ED7F-4994-81F0-87089D0154AA',
        color: Helper.COLORS[0],
        userName: 'defaultGuest',
        name: 'defaultGuest',
        currentTurn: true
    } as Player;

    
    public  static get PLAYERS() : Player[] {
        return [this.AUTOMATIC_PLAYER, this.DEFAULT_PLAYER, this.DEFAULT_GUEST_PLAYER];
    }
    
    
    public static readonly REGULAR_PROFILE: CanvasProfile = {
        height: 1600,
        width: 2000,
        image: "./assets/img/bcg40.jpg",
        cellSideSize: 10
    };
    public static readonly MOBILE_PROFILE: CanvasProfile = {
        height: 800,
        width: 1000,
        image: "./assets/img/bcg20.jpg",
        cellSideSize: 5
    };

    public static completePlayerInfo(info: Player): Player {
        if (!info) return null;
        const additional = this.PLAYERS.find(p => p.playerId === info.playerId); 
        return {...info, ...additional}
      }

    public static uuidv4(): string {
        // @ts-ignore
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    public static  generateUID(): string {
        // I generate the UID from two parts here 
        // to ensure the random number provide enough bits.
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        var firstPart2 = ("000" + firstPart.toString(36)).slice(-3);
        var secondPart2 = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart2 + secondPart2;
    }
    public static  modifyStringifiedObject(propertyName: string, value: string, config?: any ): string {
        let data = config ? JSON.parse(config) : {};
        data[propertyName] = value;
        return JSON.stringify(data);
    }
    public static nameof(f: Function): string {
        return /\.([^\.;]+);?\s*\}$/.exec(f.toString())[1]
    }
}

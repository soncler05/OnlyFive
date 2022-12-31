import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { ReplaySubject } from "rxjs";
import { take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Helper } from "src/tools/Helper";
import { Hub, HubCallback, HubDataTypeEnum, HubNewGuest } from "src/Types/Hub";

export abstract class SignalrClassData {
  abstract stopConnection(): void;
  abstract startConnection(): void;
}

@Injectable()
export class SignalrService extends SignalrClassData {

  private hubConnection: signalR.HubConnection;
  private readonly MAIN_STREAM = "mainStream"; 
  public connectionObs: ReplaySubject<void> = new ReplaySubject<void>();

  linkConnection: string = environment.baseUrl.substring(0, environment.baseUrl.length - 4) + '/room';
  constructor(private http: HttpClient 
    // , private tokenServ: NbTokenStorage
    ) {
    super();
  }

  startConnection = async () => {
    // const token = this.tokenServ.get();
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });
    this.hubConnection = new signalR.HubConnectionBuilder()
      // .configureLogging(LogLevel.Debug)
      .withUrl(this.linkConnection,
        {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          // accessTokenFactory: () => token.getValue(),
        }
      )
      .build();

    await this.hubConnection
      .start()
      .then(() => {
        this.connectionObs.next();
        console.log('Connection started');
      })
      .catch(err => console.log('Error while starting connection: ' + err));
  };

  stopConnection = () => {
    this.hubConnection.stop().then(() => {
      console.log('Connection stopped');
    })
  };
  
  listenRoom = (roomId: string, playerId: string, deviceId: string, userName: string, callbacks: HubCallback[]) => {
    this.connectionObs.pipe(take(1)).subscribe(() => {
      this.hubConnection.invoke('JoinRoom', roomId, playerId, deviceId, userName).catch(error => {
        console.error(error);
      });
      this.hubConnection.on(this.MAIN_STREAM, (data: Hub) => {
        const callback = callbacks.find(c => c.type === data.type).callback;
        if(callback) {
          const parsedData = JSON.parse(data.data);
          callback(parsedData);
        } else 
        console.error("Bad hub type");
      });
    })
  };
  
  sendPin = (roomId: string, pin: string) => {
    this.hubConnection.invoke('SendPin', roomId, pin).catch(error => {
      console.error(error);
    });
  };

  leftRoom = (roomId: number) => {
    this.hubConnection.invoke('LeftRoom', roomId).catch(error => {
      console.error(error);
    });
  };

}

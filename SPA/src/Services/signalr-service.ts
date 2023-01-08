import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { ReplaySubject, Subject } from "rxjs";
import { take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Hub, HubCallback } from "src/Types/Hub";

export abstract class SignalrClassData {
  abstract stopConnection(): void;
  abstract startConnection(): void;
}

@Injectable()
export class SignalrService extends SignalrClassData {

  linkConnection: string = environment.baseUrl.substring(0, environment.baseUrl.length - 4) + '/room';
  private hubConnection: signalR.HubConnection = new signalR.HubConnectionBuilder()
  // .configureLogging(LogLevel.Debug)
  .withUrl(this.linkConnection,
    {
      skipNegotiation: true,
      transport: signalR.HttpTransportType.WebSockets,
      // accessTokenFactory: () => token.getValue(),
    }
  )
  .build();
  private readonly MAIN_STREAM = "mainStream"; 
  private _isConnected = false;
  public connectionObs: Subject<boolean> = new Subject<boolean>();
  
  public get isConnected() : boolean {
    return this._isConnected;
  }
  

  constructor(private http: HttpClient 
    // , private tokenServ: NbTokenStorage
    ) {
    super();
    this.hubConnection.onclose((error) => {
      this._isConnected = false;
      this.connectionObs.next(this.isConnected);
    });
    this.hubConnection.onreconnected((error) => {
      this._isConnected = true;
    });
  }

  startConnection = async () => {
    // const token = this.tokenServ.get();
    Object.defineProperty(WebSocket, 'OPEN', { value: 1, });

    await this.hubConnection
      .start()
      .then(() => {
        this._isConnected = true;
        this.connectionObs.next(this.isConnected);
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Pin } from 'src/tools/pin';
import { CompleteRound, LastRound, NewPin, Round } from 'src/Types/Game';

@Injectable({
  providedIn: 'root'
})
export class RoundService {
  private readonly PATH = `${environment.baseUrl}/round`;
constructor(private httpClient: HttpClient) { }

  public saveLast(game: LastRound): Observable<void> {
    return this.httpClient.put<void>(this.PATH + "/last", game);
  }

  public newPin(data: NewPin): Observable<Pin> {
    return this.httpClient.put<Pin>(this.PATH + "/newPin", data);
  }

  public complete(data: CompleteRound): Observable<void> {
    return this.httpClient.put<void>(this.PATH + "/complete", data);
  }
}

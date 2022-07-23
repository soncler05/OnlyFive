import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { Round } from 'src/Types/Game';

@Injectable({
  providedIn: 'root'
})
export class RoundService {
  private readonly PATH = `${environment.baseUrl}/round`;
constructor(private httpClient: HttpClient) { }

  public saveLast(game: Round): Observable<void> {
    return this.httpClient.put<void>(this.PATH + "/last", game);
  }
}

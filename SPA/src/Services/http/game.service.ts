import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Game } from 'src/Types/Game';

@Injectable({
  providedIn: 'root'
})
export class GameService {
private readonly PATH = `${environment.baseUrl}/game`;
constructor( private httpClient: HttpClient ) { }


public create(game: Game): Observable<Game> {
  return this.httpClient.post<Game>(this.PATH, game);
}

public update(game: Game): Observable<void> {
  return this.httpClient.put<void>(this.PATH, game);
}
public find(id: string): Observable<Game> {
  return this.httpClient.get<Game>(`${this.PATH}/${id}`);
}
public findByUrlId(urlId: string): Observable<Game> {
  return this.httpClient.get<Game>(`${this.PATH}/urlId/${urlId}`);
}

public delete(id: string): Observable<void> {
  return this.httpClient.delete<void>(`${this.PATH}/${id}`);
}

}

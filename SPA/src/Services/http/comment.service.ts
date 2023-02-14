import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Comment } from 'src/Types/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly PATH = `${environment.baseUrl}/comment`;
  constructor( private httpClient: HttpClient ) { }
  
  public send(comment: Comment): Observable<Comment> {
    return this.httpClient.post<Comment>(this.PATH, comment);
  }
  

}

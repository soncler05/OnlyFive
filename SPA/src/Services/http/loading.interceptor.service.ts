import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar-observables';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {

constructor(private slimLoadingBarService: SlimLoadingBarService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.slimLoadingBarService.start();
    return next.handle(req)
      .pipe(catchError((err) => {
        this.slimLoadingBarService.stop();
        return err;
      }), map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
        if (evt instanceof HttpResponse) {
          this.slimLoadingBarService.complete();
        }
        return evt;
      }));
  }

}

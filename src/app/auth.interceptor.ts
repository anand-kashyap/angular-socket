import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { environment } from '@env/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.apiService.getToken(),
      reqObj: any = { url: environment.socketUrl + req.url };
    if (token) {
      reqObj.headers = req.headers.set('x-access-token', token);
    }
    req = req.clone(reqObj);
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // console.log('event--->>>', event);
          const { status } = event;
          if (status === 401) {
            this.apiService.logout();
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.apiService.logout();
        }
        /* let data = {};
        data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        }; */
        return throwError(error);
      })
    ) as any;
  }
}

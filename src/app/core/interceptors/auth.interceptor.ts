import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const idToken = localStorage.getItem('id_token');

    if (idToken) {
      const clonedReq: HttpRequest<unknown> = request.clone({
        headers: request.headers.set("Authorization", `Bearer ${idToken}`)
      });
      return next.handle(clonedReq);
    }
    else {
      return next.handle(request);
    }
  }
}

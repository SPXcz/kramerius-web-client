import { Injectable } from '@angular/core';
import { HttpEvent, HttpRequest, HttpInterceptor, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AppSettings } from './app-settings';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private locals: LocalStorageService, private settings: AppSettings) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor', request.url);
    if (!request.url.startsWith(this.settings.url)) {
      return next.handle(request);
    }
    const token = this.locals.getProperty('auth.token');
    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + token
        }
      });
    }
    return next.handle(request);
  }
}

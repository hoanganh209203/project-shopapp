import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '../../service/tokens/token.service';

@Injectable()
export class tokenInterceptor implements HttpInterceptor {
  constructor(private tokenService : TokenService){}
  intercept(
    req: HttpRequest<any>,
     next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.tokenService.getToken();
    if(token){

      req =  req.clone({
        setHeaders:{
          Authorization: `Bearer ${token}`
        },
      })
    }
    return next.handle(req);
  }

};

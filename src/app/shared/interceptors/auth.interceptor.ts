import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.startsWith(environment.api);
    const isLoginOrRegister = request.url.includes('/usuario/autenticar') || request.url.includes('/usuario/inserir') || request.url.includes('/usuario/verificar-existente') || request.url.includes('/convidados');

    if (isApiUrl && !isLoginOrRegister) {
      return this.authService.firebaseReady$.pipe(
        take(1),
        switchMap(() => {
          if (this.authService.isTokenLogicallyExpired()) {
            this.toastr.warning('Sessao expirada. Redirecionando para login.');
            this.authService.logout();
            return EMPTY;
          }

          const backendToken = this.authService.getToken();

          if (backendToken) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${backendToken}`
              }
            });
          } else {
            this.authService.logout();
            return EMPTY;
          }

          return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 401) {
                this.toastr.warning('Não autorizado. Redirecionando para login.');
                this.authService.logout();
              }
              return throwError(() => error);
            })
          );
        })
      );
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (isApiUrl && !isLoginOrRegister && error.status === 401) {
          this.toastr.warning('Não autorizado. Redirecionando para login.');
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
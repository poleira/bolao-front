import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isApiUrl = request.url.startsWith(environment.api);
    const isLoginOrRegister = request.url.includes('/usuario/autenticar') || request.url.includes('/usuario/inserir');

    if (isApiUrl && !isLoginOrRegister) { 
      if (this.authService.isTokenLogicallyExpired()) {
        console.warn('Sessao expirada. Redirecionando para login.');
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
        console.warn('Sem token de autenticação. Redirecionando para login.');
        this.authService.logout();
        return EMPTY;
      }
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (isApiUrl && !isLoginOrRegister && error.status === 401) {
          console.error('Erro 401: Não autorizado. Redirecionando para login.');
          this.authService.logout();
        }
        return throwError(() => error);
      })
    );
  }
}
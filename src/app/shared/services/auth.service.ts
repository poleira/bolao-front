import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginRequest } from 'src/app/login/models/requests/login.request';
import { AutenticacaoResponse } from 'src/app/login/models/responses/autenticacao.response';
import { UsuarioRequest } from 'src/app/login/models/requests/usuario.request';
import { Router } from '@angular/router';

const AUTH_TOKEN_KEY = 'auth-token'; // Backend token
const AUTH_USER_KEY = 'auth-user';
const FIREBASE_TOKEN_EXPIRATION_KEY = 'firebase-token-expiration'; // Key for Firebase token expiration

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = environment.api + "usuario";

  authStatus = new BehaviorSubject<boolean>(this.calculateInitialAuthStatus());
  
  constructor(private http: HttpClient, private router: Router) {}

  private calculateInitialAuthStatus(): boolean {
    const tokenPresent = !!sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (!tokenPresent) {
      return false;
    }
    return !this.isTokenLogicallyExpired();
  }

  login(request: LoginRequest): Observable<AutenticacaoResponse> {
    return this.http.post<AutenticacaoResponse>(`${this.url}/autenticar`, request).pipe(
      tap(response => this.saveBackendSession(response)), 
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  inserir(request: UsuarioRequest): Observable<any> {
    return this.http.post(`${this.url}/inserir`, request);
  }

  private saveBackendSession(authResponse: AutenticacaoResponse): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);

    if (authResponse && authResponse.token) {
      sessionStorage.setItem(AUTH_TOKEN_KEY, authResponse.token);
      const userToStore = { ...authResponse };
      sessionStorage.setItem(AUTH_USER_KEY, JSON.stringify(userToStore));
    } else {
      this.clearClientSessionData();
      this.authStatus.next(false);
    }
  }

  completeFirebaseSession(firebaseTokenExpirationEpoch: number): void {
    sessionStorage.setItem(FIREBASE_TOKEN_EXPIRATION_KEY, firebaseTokenExpirationEpoch.toString());
    this.authStatus.next(true && !this.isTokenLogicallyExpired());
  }

  isTokenLogicallyExpired(): boolean {
    const expirationTimeEpochStr = sessionStorage.getItem(FIREBASE_TOKEN_EXPIRATION_KEY);
    if (!expirationTimeEpochStr) {
      return true;
    }
    const expirationTimeEpoch = parseInt(expirationTimeEpochStr, 10);
    console.log('Expiration Time:', new Date(expirationTimeEpoch).toLocaleString());
    console.log('Current Time:', new Date(Date.now()).toLocaleString());
    const bufferSeconds = 60;
    return (Date.now() + (bufferSeconds * 1000)) >= expirationTimeEpoch;
  }

  private clearClientSessionData(): void {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(FIREBASE_TOKEN_EXPIRATION_KEY);
  }

  logout(redirectToLogin: boolean = true): void {
    this.clearClientSessionData();
    this.authStatus.next(false);
    if (redirectToLogin) {
      this.router.navigate(['/login']);
    }
  }

  getToken(): string | null {
    if (this.isTokenLogicallyExpired()) {
      this.logout();
      return null;
    }
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }


  private isBackendTokenPresent(): boolean {
    return !!sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  isUserAuthenticatedSync(): boolean {
    return this.isBackendTokenPresent() && !this.isTokenLogicallyExpired();
  }
}
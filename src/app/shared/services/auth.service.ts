import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginRequest } from 'src/app/login/models/requests/login.request';
import { AutenticacaoResponse } from 'src/app/login/models/responses/autenticacao.response';
import { UsuarioRequest } from 'src/app/login/models/requests/usuario.request';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = environment.api + "usuario";

  authStatus = new BehaviorSubject<boolean>(this.hasToken());
  
  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AutenticacaoResponse> {
    return this.http.post<AutenticacaoResponse>(`${this.url}/autenticar`, request);
  }

  inserir(request: UsuarioRequest): Observable<any> {
    return this.http.post(`${this.url}/inserir`, request);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.url}/logout`, {});
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('usuario');
  }

  isAuthenticated(): boolean {
    return this.authStatus.value;
}
}
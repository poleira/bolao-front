import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BolaoUsuarioResponse } from 'src/app/home/models/responses/bolao-usuario.response';
import { AssociarUsuarioViaHubRequest } from '../models/requests/associar-usuario-hub.request';

@Injectable({
  providedIn: 'root'
})
export class BoloesUsuariosService {
  private apiUrl = `${environment.api}boloes-usuarios`;

  private bolaoUsuarioSubject = new BehaviorSubject<BolaoUsuarioResponse>({} as BolaoUsuarioResponse);
  private adminStateSubject = new BehaviorSubject<{ usuarioEhAdmin: boolean; nomeUsuarioLogado: string }>({
    usuarioEhAdmin: false,
    nomeUsuarioLogado: ''
  });

  constructor(private http: HttpClient) { }

  recuperarBoloesUsuario(): Observable<BolaoUsuarioResponse[]> {
    return this.http.get<BolaoUsuarioResponse[]>(this.apiUrl);
  }

  recuperar(id: number): Observable<BolaoUsuarioResponse> {
    return this.http.get<BolaoUsuarioResponse>(`${this.apiUrl}/${id}`);
  }

  receberBolaoUsuario(bolaoUsuario: BolaoUsuarioResponse): void {
    this.bolaoUsuarioSubject.next(bolaoUsuario);
  }

  getBolaoUsuario(): Observable<BolaoUsuarioResponse> {
    return this.bolaoUsuarioSubject.asObservable();
  }

  setAdminState(usuarioEhAdmin: boolean, nomeUsuarioLogado: string): void {
    this.adminStateSubject.next({ usuarioEhAdmin, nomeUsuarioLogado });
  }

  getAdminState(): Observable<{ usuarioEhAdmin: boolean; nomeUsuarioLogado: string }> {
    return this.adminStateSubject.asObservable();
  }

  associarUsuarioBolaoViaHub(request: AssociarUsuarioViaHubRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, request);
  }
}

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

  constructor(private http: HttpClient) { }

  recuperarBoloesUsuario(hashUsuario: string): Observable<BolaoUsuarioResponse[]> {
    return this.http.get<BolaoUsuarioResponse[]>(this.apiUrl, { params: { hashUsuario } });
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

  associarUsuarioBolaoViaHub(request: AssociarUsuarioViaHubRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}`, request);
  }
}

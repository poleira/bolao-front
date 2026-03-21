import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsuarioResponse } from 'src/app/shared/models/responses/usuario.response';
import { VerificarUsuarioExistenteRequest } from 'src/app/shared/models/requests/verificar-usuario-existente.request';
import { AlterarNomeUsuarioRequest } from 'src/app/shared/models/requests/alterar-nome-usuario.request';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = environment.api + 'usuario';

  constructor(private http: HttpClient) { }

  obterUsuarioLogado(): Observable<UsuarioResponse> {
    return this.http.get<UsuarioResponse>(`${this.apiUrl}/me`);
  }

  verificarUsuarioExistente(request: VerificarUsuarioExistenteRequest): Observable<{ mensagem: string }> {
    return this.http.post<{ mensagem: string }>(`${this.apiUrl}/verificar-existente`, request);
  }

  alterarNome(request: AlterarNomeUsuarioRequest): Observable<{ mensagem: string }> {
    return this.http.put<{ mensagem: string }>(`${this.apiUrl}/alterar-nome`, request);
  }
}

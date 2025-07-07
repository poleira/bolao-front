import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NotificacaoResponse } from '../models/responses/notificacao.response';
import { MarcarNotificacaoComoLidaRequest } from '../models/requests/marcar-notificacao-lida.request';

@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {
  private apiUrl = `${environment.api}notificacoes`;

  constructor(private http: HttpClient) { }

  listarNotificacoesPorUsuario(): Observable<NotificacaoResponse[]> {
    return this.http.get<NotificacaoResponse[]>(this.apiUrl);
  }

  validarSeUsuarioPossuiAlgumaNotificacaoNaoLida(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/nao-lidas`);
  }

  marcarNotificacaoComoLida(request: MarcarNotificacaoComoLidaRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/marcar-como-lida`, request);
  }

  excluirNotificacao(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  aceitarSolicitacao(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}`, {});
  }
}
 
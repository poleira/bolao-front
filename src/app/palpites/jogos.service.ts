import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JogoGrupoRequest } from '../shared/models/requests/jogo-grupo.request';
import { JogoGrupoResponse } from '../shared/models/responses/jogo-grupo.response';

@Injectable({
  providedIn: 'root'
})
export class JogosService {

  private apiUrl = `${environment.api}jogos-grupo`;

  constructor(private http: HttpClient) { }

  listarJogosGrupo(request: JogoGrupoRequest): Observable<JogoGrupoResponse[]> {
    return this.http.get<JogoGrupoResponse[]>(this.apiUrl, { params: { ...request } });
  }

  listarJogosBrasil(): Observable<JogoGrupoResponse[]> {
    return this.http.get<JogoGrupoResponse[]>(`${this.apiUrl}/brasil`);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegraResponse } from 'src/app/home/models/responses/regra.response';
import { BolaoRequest } from 'src/app/home/models/requests/bolao.request';
import { BolaoResponse } from 'src/app/home/models/responses/bolao.response';
import { BolaoEditarRequest } from 'src/app/home/models/requests/bolao-editar.request';
import { AssociarUsuarioRequest } from 'src/app/shared/models/requests/associar-usuario.request';
import { BolaoListarRequest } from '../models/requests/bolao-listar.request';
import { BolaoListarResponse } from '../models/responses/bolao-listar.response';
import { AssociarUsuarioViaHubRequest } from 'src/app/shared/models/requests/associar-usuario-hub.request';
import { HashBolaoRequest } from 'src/app/shared/models/requests/hash-bolao.request';
import { BolaoRegraResponse } from '../models/responses/bolao-regra.response';
import { ModoJogoResponse } from '../models/responses/bolao-modo-jogo.response';

@Injectable({
  providedIn: 'root'
})
export class BolaoService {
  private apiUrlBoloes = environment.api + "boloes";
  private apiUrlRegras = environment.api + "regras";
  private apiUrlModoJogo = environment.api + "modos-jogos";
  
  constructor(private http: HttpClient) { }

  recuperarRegras(): Observable<RegraResponse[]> {
    return this.http.get<RegraResponse[]>(this.apiUrlRegras);
  }

  recuperarModoJogo(hash: string): Observable<ModoJogoResponse> {
    return this.http.get<ModoJogoResponse>(`${this.apiUrlModoJogo}/boloes`, { params: new HashBolaoRequest({HashBolao: hash}) as any });
  }

  criarBolao(request: BolaoRequest): Observable<BolaoResponse> {
    return this.http.post<BolaoResponse>(this.apiUrlBoloes, request);
  }

  editarBolao(request: BolaoEditarRequest): Observable<void> {
    return this.http.put<void>(`${this.apiUrlBoloes}`, request);
  }

  recuperarPorToken(tokenAcesso: string) {
    const encodedToken = encodeURIComponent(tokenAcesso);
    return this.http.get<BolaoResponse>(`${this.apiUrlBoloes}/${encodedToken}`);
  }

  associarUsuarioBolao(request: AssociarUsuarioRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrlBoloes}/boloes-usuarios`, request);
  }

  listarBoloes(request: BolaoListarRequest): Observable<BolaoListarResponse[]> {
    return this.http.get<BolaoListarResponse[]>(this.apiUrlBoloes, { params: request as any });
  }

  listarRegrasBolao(request: HashBolaoRequest): Observable<BolaoRegraResponse[]> {
    return this.http.get<BolaoRegraResponse[]>(`${this.apiUrlBoloes}/regras-boloes`, { params: request as any });
  }
  
}

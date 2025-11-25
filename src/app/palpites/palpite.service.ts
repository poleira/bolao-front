import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PalpiteGrupoSelecaoRequest } from '../shared/models/requests/palpite-grupo-selecao.request';
import { SelecaoResponse } from '../shared/models/responses/selecao.response';
import { PalpiteGrupoSelecaoResponse } from '../shared/models/responses/paplpite-grupo-selecao.response';
import { PalpiteArtilheiroRequest } from '../shared/models/requests/palpite-artilheiro.request';
import { PalpiteArtilheiroResponse } from '../shared/models/responses/palpite-artilheiro.response';
import { JogadorResponse } from '../shared/models/responses/jogador.response';
import { PalpiteTerceiroLugarRequest } from '../shared/models/requests/palpite-terceiro-lugar-request';
import { PalpiteTerceiroLugarResponse } from '../shared/models/responses/palpite-terceiro-lugar.response';
import { EliminatoriasResponse } from '../shared/models/responses/eliminatorias.response';

@Injectable({
  providedIn: 'root'
})
export class PalpiteService {

  private apiUrlPalpites = `${environment.api}palpites`;
  private apiUrl = `${environment.api}`;
  
  constructor(private http: HttpClient) { }

  palpitarGrupoSelecao(request: PalpiteGrupoSelecaoRequest[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrlPalpites}/grupos-selecoes`, request);
  }

  recuperarPalpiteGrupoSelecao(hashBolao: string): Observable<PalpiteGrupoSelecaoResponse[]> {
    return this.http.get<PalpiteGrupoSelecaoResponse[]>(`${this.apiUrlPalpites}/grupos-selecoes`, { params: { HashBolao: hashBolao } });
  }

  listarSelecoes(): Observable<SelecaoResponse[]> {
    return this.http.get<SelecaoResponse[]>(this.apiUrl + "selecoes");
  }

  salvarPalpiteArtilheiro(request: PalpiteArtilheiroRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrlPalpites}/artilheiros`, request);
  }

  recuperarPalpiteArtilheiro(hashBolao: string): Observable<PalpiteArtilheiroResponse> {
    return this.http.get<PalpiteArtilheiroResponse>(`${this.apiUrlPalpites}/artilheiros`, { params: { HashBolao: hashBolao } });
  }
  
  listarJogadores(nome: string): Observable<JogadorResponse[]> {
    return this.http.get<JogadorResponse[]>(this.apiUrl + "jogadores", { params: { Nome: nome } });
  }

  recuperarTerceirosLugares(hashBolao: string): Observable<SelecaoResponse[]> {
    return this.http.get<SelecaoResponse[]>(`${this.apiUrlPalpites}/terceiros-lugares`, { params: { HashBolao: hashBolao } });
  }

  recuperarPalpitesTerceirosLugares(hashBolao: string): Observable<PalpiteTerceiroLugarResponse[]> {
    return this.http.get<PalpiteTerceiroLugarResponse[]>(`${this.apiUrlPalpites}/terceiros-lugares/palpites`, { params: { HashBolao: hashBolao } });
  }

  palpitarTerceiroLugar(request: PalpiteTerceiroLugarRequest[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrlPalpites}/terceiros-lugares`, request);
  }

  recuperarEliminatorias(hashBolao: string): Observable<EliminatoriasResponse> {
    return this.http.get<EliminatoriasResponse>(`${this.apiUrlPalpites}/eliminatorias`, { params: { HashBolao: hashBolao } });
  }

}

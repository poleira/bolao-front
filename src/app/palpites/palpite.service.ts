import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PalpiteGrupoSelecaoRequest } from '../shared/models/requests/palpite-grupo-selecao.request';
import { SelecaoResponse } from '../shared/models/responses/selecao.response';
import { PalpiteGrupoSelecaoResponse } from '../shared/models/responses/paplpite-grupo-selecao.response';

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
  

}

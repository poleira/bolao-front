import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegraResponse } from 'src/app/home/models/responses/regra.response';
import { BolaoRequest } from 'src/app/home/models/requests/bolao.request';
import { BolaoResponse } from 'src/app/home/models/responses/bolao.response';

@Injectable({
  providedIn: 'root'
})
export class BolaoService {
  private apiUrl = environment.api + "boloes";

  constructor(private http: HttpClient) { }

  recuperarRegras(): Observable<RegraResponse[]> {
    return this.http.get<RegraResponse[]>(this.apiUrl + '/regras');
  }

  criarBolao(request: BolaoRequest): Observable<BolaoResponse> {
    return this.http.post<BolaoResponse>(this.apiUrl, request);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HashBolaoRequest } from 'src/app/shared/models/requests/hash-bolao.request';
import { RankResponse } from 'src/app/home/models/responses/rank.response';

@Injectable({
  providedIn: 'root'
})
export class RankService {
  private apiUrlRank = environment.api + 'rank';

  constructor(private http: HttpClient) { }

  listar(request: HashBolaoRequest): Observable<RankResponse[]> {
    return this.http.get<RankResponse[]>(this.apiUrlRank, { params: request as any });
  }
}

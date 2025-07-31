import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RegraResponse } from 'src/app/home/models/responses/regra.response';

@Injectable({
  providedIn: 'root'
})
export class RegrasService {
  private readonly url = environment.api + "regras";

  constructor(private http: HttpClient) { }
  
  listar(): Observable<RegraResponse[]> {
    return this.http.get<RegraResponse[]>(`${this.url}`);
  }
}

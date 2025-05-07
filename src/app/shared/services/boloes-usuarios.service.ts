import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BolaoUsuarioResponse } from 'src/app/home/models/responses/bolao-usuario.response';

@Injectable({
  providedIn: 'root'
})
export class BoloesUsuariosService {
  private apiUrl = `${environment.api}boloes-usuarios`;

  constructor(private http: HttpClient) { }

  recuperarBoloesUsuario(hashUsuario: string): Observable<BolaoUsuarioResponse[]> {
    return this.http.get<BolaoUsuarioResponse[]>(this.apiUrl, { params: { hashUsuario } });
  }

  recuperar(id: number): Observable<BolaoUsuarioResponse> {
    return this.http.get<BolaoUsuarioResponse>(`${this.apiUrl}/${id}`);
  }
}

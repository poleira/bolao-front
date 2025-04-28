import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly url = environment.api;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.url}/login`, { email, password });
  }

  register(email: string, password: string, name: string): Observable<any> {
    return this.http.post(`${this.url}/inserir`, { email, password, name });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.url}/logout`, {});
  }
}
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from 'src/app/autenticacao/usuario/token';
import { Usuario } from 'src/app/autenticacao/usuario/usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean = true;
  usuario: string = '';
  senha: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    localStorage.removeItem('jwt');
  }

  login() {
    this.http
      .post<AuthenticatedResponse>(
        'https://localhost:7288/api/Login',
        {
          usuario: this.usuario,
          senha: this.senha,
        },
        {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        }
      )
      .subscribe({
        next: (response: AuthenticatedResponse) => {
          const token = response.token;
          const id = response.id;
          localStorage.setItem('jwt', token);
          localStorage.setItem('id', id);
          this.invalidLogin = false;
          this.router.navigate(['painel']);
        },
        error: () => alert('Usuario ou senha errados.'),
      });
  }
}

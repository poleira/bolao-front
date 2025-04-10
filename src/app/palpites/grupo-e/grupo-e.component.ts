import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-grupo-e',
  templateUrl: './grupo-e.component.html',
  styleUrls: ['./grupo-e.component.css'],
})
export class GrupoEComponent implements OnInit {
  Espanha: any = 0;
  EspanhaPontos: number = 0;
  CostaRica: any = 0;
  CostaRicaPontos: number = 0;
  Alemanha: any = 0;
  AlemanhaPontos: number = 0;
  Japao: any = 0;
  JapaoPontos: number = 0;
  Usuario: String = '';
  data: any;
  HabilitaPalpite: any;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  ngOnInit(): void {
    this.httpClient
      .get<any>(
        'https://localhost:7288/api/HabilitarPalpite',
        {}
      )
      .subscribe((data) => {
        this.HabilitaPalpite = data.geral;
      });
  }

  goPainel() {
    this.router.navigate(['painel']);
  }

  enviar() {
    const token = localStorage.getItem('jwt');

    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.Usuario =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
      console.log(this.Usuario);
    }

    const espanha = parseInt(this.Espanha, 10);
    const costaRica = parseInt(this.CostaRica, 10);
    const alemanha = parseInt(this.Alemanha, 10);
    const japao = parseInt(this.Japao, 10);

    this.httpClient
      .put('https://localhost:7288/api/Ge', {
        usuario: this.Usuario,
        espanha: espanha,
        costaRica: costaRica,
        alemanha: alemanha,
        japao: japao,
        espanhaPontos: this.EspanhaPontos,
        costaRicaPontos: this.CostaRicaPontos,
        alemanhaPontos: this.AlemanhaPontos,
        japaoPontos: this.JapaoPontos,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

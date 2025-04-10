import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-grupo-g',
  templateUrl: './grupo-g.component.html',
  styleUrls: ['./grupo-g.component.css'],
})
export class GrupoGComponent implements OnInit {
  Brasil: any;
  BrasilPontos: number = 0;
  Servia: any;
  ServiaPontos: number = 0;
  Suica: any;
  SuicaPontos: number = 0;
  Camaroes: any;
  CamaroesPontos: number = 0;
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

    const brasil = parseInt(this.Brasil, 10);
    const servia = parseInt(this.Servia, 10);
    const suica = parseInt(this.Suica, 10);
    const camaroes = parseInt(this.Camaroes, 10);

    this.httpClient
      .put('https://localhost:7288/api/Gg', {
        brasil: brasil,
        servia: servia,
        suica: suica,
        camaroes: camaroes,
        brasilPontos: this.BrasilPontos,
        serviaPontos: this.ServiaPontos,
        suicaPontos: this.SuicaPontos,
        camaroesPontos: this.CamaroesPontos,
        usuario: this.Usuario,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

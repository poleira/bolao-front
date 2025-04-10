import { Usuario } from 'src/app/autenticacao/usuario/usuario';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router, Routes } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-grupo-a',
  templateUrl: './grupo-a.component.html',
  styleUrls: ['./grupo-a.component.css'],
})
export class GrupoAComponent implements OnInit {
  Qatar: any = 0;
  QatarPontos: number = 0;
  Ecuador: any = 0;
  EcuadorPontos: number = 0;
  SenegalPontos: number = 0;
  Senegal: any = 0;
  Holanda: any = 0;
  HolandaPontos: number = 0;
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
    }

    const equador = parseInt(this.Ecuador, 10);
    const qatar = parseInt(this.Qatar, 10);
    const holanda = parseInt(this.Holanda, 10);
    const senegal = parseInt(this.Senegal, 10);

    console.log(this.HabilitaPalpite);
    this.httpClient
      .put<any>('https://localhost:7288/api/Ga', {
        usuario: this.Usuario,
        qatar: qatar,
        equador: equador,
        senegal: senegal,
        holanda: holanda,
        qatarPontos: this.QatarPontos,
        equadorPontos: this.EcuadorPontos,
        senegalPontos: this.SenegalPontos,
        holandaPontos: this.HolandaPontos,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

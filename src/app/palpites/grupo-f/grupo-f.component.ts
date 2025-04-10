import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-grupo-f',
  templateUrl: './grupo-f.component.html',
  styleUrls: ['./grupo-f.component.css'],
})
export class GrupoFComponent implements OnInit {
  Belgica: any = 0;
  BelgicaPontos: number = 0;
  Canada: any = 0;
  CanadaPontos: number = 0;
  Marrocos: any = 0;
  MarrocosPontos: number = 0;
  Croacia: any = 0;
  CroaciaPontos: number = 0;
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

    const belgica = parseInt(this.Belgica, 10);
    const canada = parseInt(this.Canada, 10);
    const marrocos = parseInt(this.Marrocos, 10);
    const croacia = parseInt(this.Croacia, 10);

    this.httpClient
      .put<any>('https://localhost:7288/api/Gf', {
        usuario: this.Usuario,
        belgica: belgica,
        canada: canada,
        marrocos: marrocos,
        croacia: croacia,
        belgicaPontos: this.BelgicaPontos,
        canadaPontos: this.CanadaPontos,
        marrocosPontos: this.MarrocosPontos,
        croaciaPontos: this.CroaciaPontos,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

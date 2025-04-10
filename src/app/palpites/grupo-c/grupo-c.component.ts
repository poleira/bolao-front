import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-grupo-c',
  templateUrl: './grupo-c.component.html',
  styleUrls: ['./grupo-c.component.css'],
})
export class GrupoCComponent implements OnInit {
  Argentina: any;
  ArgentinaPontos: number = 0;
  ArabiaSaudita: any;
  ArabiaSauditaPontos: number = 0;
  Mexico: any;
  MexicoPontos: number = 0;
  Polonia: any;
  PoloniaPontos: number = 0;
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

    const argentina = parseInt(this.Argentina, 10);
    const arabiaSaudita = parseInt(this.ArabiaSaudita, 10);
    const mexico = parseInt(this.Mexico, 10);
    const polonia = parseInt(this.Polonia, 10);

    this.httpClient
      .put<any>('https://localhost:7288/api/Gc', {
        usuario: this.Usuario,
        argentina: argentina,
        arabiaSaudita: arabiaSaudita,
        mexico: mexico,
        polonia: polonia,
        argentinaPontos: this.ArgentinaPontos,
        arabiaSauditaPontos: this.ArabiaSauditaPontos,
        mexicoPontos: this.MexicoPontos,
        poloniaPontos: this.PoloniaPontos,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

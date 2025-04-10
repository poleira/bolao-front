import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-grupo-d',
  templateUrl: './grupo-d.component.html',
  styleUrls: ['./grupo-d.component.css'],
})
export class GrupoDComponent implements OnInit {
  Franca: any = 0;
  FrancaPontos: number = 0;
  Australia: any = 0;
  AustraliaPontos: number = 0;
  Dinamarca: any = 0;
  DinamarcaPontos: number = 0;
  Tunisia: any = 0;
  TunisiaPontos: number = 0;
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

    const franca = parseInt(this.Franca, 10);
    const australia = parseInt(this.Australia, 10);
    const dinamarca = parseInt(this.Dinamarca, 10);
    const tunisia = parseInt(this.Tunisia, 10);

    this.httpClient
      .put('https://localhost:7288/api/Gd', {
        usuario: this.Usuario,
        franca: franca,
        australia: australia,
        dinamarca: dinamarca,
        tunisia: tunisia,
        francaPontos: this.FrancaPontos,
        australiaPontos: this.AustraliaPontos,
        dinamarcaPontos: this.DinamarcaPontos,
        tunisiaPontos: this.TunisiaPontos,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

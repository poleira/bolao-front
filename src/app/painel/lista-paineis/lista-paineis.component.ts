import { GrupoA } from './Interfaces/grupo-a';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HeaderComponent } from 'src/app/header/header.component';
import { __await } from 'tslib';

@Component({
  selector: 'app-lista-paineis',
  templateUrl: './lista-paineis.component.html',
  styleUrls: ['./lista-paineis.component.css'],
  providers: [HeaderComponent],
})
export class ListaPaineisComponent implements OnInit {
  Usuario: string = '';

  GrupoA: any;
  GrupoB: any;
  GrupoC: any;
  GrupoD: any;
  GrupoE: any;
  GrupoF: any;
  GrupoG: any;
  GrupoH: any;

  ArrayA: any[] = [];
  ArrayB: any[] = [];
  ArrayC: any[] = [];
  ArrayD: any[] = [];
  ArrayE: any[] = [];
  ArrayF: any[] = [];
  ArrayG: any[] = [];
  ArrayH: any[] = [];
  data: any;

  constructor(
    private jwtHelper: JwtHelperService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUsuario();
    this.http
      .post<any>('https://localhost:7288/api/Painel', {
        usuario: this.Usuario,
      })
      .subscribe((data) => {
        this.data = data;
        this.GrupoA = {
          equador: data.equador,
          qatar: data.qatar,
          holanda: data.holanda,
          senegal: data.senegal,
        };
        this.GrupoB = {
          inglaterra: data.inglaterra,
          iram: data.iram,
          usa: data.usa,
          paisDeGales: data.paisDeGales,
        };
        this.GrupoC = {
          argentina: data.argentina,
          arabiaSaudita: data.arabiaSaudita,
          mexico: data.mexico,
          polonia: data.polonia,
        };
        this.GrupoD = {
          franca: data.franca,
          australia: data.australia,
          dinamarca: data.dinamarca,
          tunisia: data.tunisia,
        };
        this.GrupoE = {
          espanha: data.espanha,
          costaRica: data.costaRica,
          alemanha: data.alemanha,
          japao: data.japao,
        };
        this.GrupoF = {
          belgica: data.belgica,
          canada: data.canada,
          marrocos: data.marrocos,
          croacia: data.croacia,
        };
        this.GrupoG = {
          brasil: data.brasil,
          servia: data.servia,
          suica: data.suica,
          camaroes: data.camaroes,
        };
        this.GrupoH = {
          portugal: data.portugal,
          gana: data.gana,
          uruguai: data.uruguai,
          coreiaDoSul: data.coreiaDoSul,
        };
        this.Organize();
      });
  }

  getPontos(pais: any) {
    return this.data[`${pais}Pontos`];
  }

  Organize() {
    console.log(this.GrupoD);
    this.ArrayA = Object.keys(this.GrupoA).sort(
      (a, b) => this.GrupoA[a] - this.GrupoA[b]
    );
    this.ArrayB = Object.keys(this.GrupoB).sort(
      (a, b) => this.GrupoB[a] - this.GrupoB[b]
    );
    this.ArrayC = Object.keys(this.GrupoC).sort(
      (a, b) => this.GrupoC[a] - this.GrupoC[b]
    );
    this.ArrayD = Object.keys(this.GrupoD).sort(
      (a, b) => this.GrupoD[a] - this.GrupoD[b]
    );
    this.ArrayE = Object.keys(this.GrupoE).sort(
      (a, b) => this.GrupoE[a] - this.GrupoE[b]
    );
    this.ArrayF = Object.keys(this.GrupoF).sort(
      (a, b) => this.GrupoF[a] - this.GrupoF[b]
    );
    this.ArrayG = Object.keys(this.GrupoG).sort(
      (a, b) => this.GrupoG[a] - this.GrupoG[b]
    );
    this.ArrayH = Object.keys(this.GrupoH).sort(
      (a, b) => this.GrupoH[a] - this.GrupoH[b]
    );
    console.log(this.ArrayD);
  }

  navegarGrupoA = () => {
    this.router.navigate(['grupoA']);
  };

  isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem('jwt');
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      return true;
    }
    return false;
  };

  getUsuario() {
    const token = localStorage.getItem('jwt');

    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.Usuario =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }
  }
}

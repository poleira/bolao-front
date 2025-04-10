import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-grupo-b',
  templateUrl: './grupo-b.component.html',
  styleUrls: ['./grupo-b.component.css'],
})
export class GrupoBComponent implements OnInit {
  Inglaterra: any;
  InglaterraPontos: number = 0;
  Iram: any;
  IramPontos: number = 0;
  USA: any;
  USAPontos: number = 0;
  PaisDeGales: any;
  PaisDeGalesPontos: number = 0;
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

    const inglaterra = parseInt(this.Inglaterra, 10);
    const iram = parseInt(this.Iram, 10);
    const usa = parseInt(this.USA, 10);
    const paisDeGales = parseInt(this.PaisDeGales, 10);

    this.httpClient
      .put<any>('https://localhost:7288/api/Gb', {
        usuario: this.Usuario,
        inglaterra: inglaterra,
        iram: iram,
        usa: usa,
        paisDeGales: paisDeGales,
        inglaterraPontos: this.InglaterraPontos,
        iramPontos: this.IramPontos,
        usaPontos: this.USAPontos,
        paisDeGalesPontos: this.PaisDeGalesPontos,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

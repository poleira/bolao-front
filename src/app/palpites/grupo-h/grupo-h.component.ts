import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-grupo-h',
  templateUrl: './grupo-h.component.html',
  styleUrls: ['./grupo-h.component.css'],
})
export class GrupoHComponent implements OnInit {
  Portugal: any;
  PortugalPontos!: number;
  Gana: any;
  GanaPontos: number = 0;
  Uruguai: any;
  UruguaiPontos: number = 0;
  CoreiaDoSul: any;
  CoreiaDoSulPontos: number = 0;
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

    const portugal = parseInt(this.Portugal, 10);
    const gana = parseInt(this.Gana, 10);
    const uruguai = parseInt(this.Uruguai, 10);
    const coreiaDoSul = parseInt(this.CoreiaDoSul, 10);

    this.httpClient
      .put('https://localhost:7288/api/Gh', {
        portugal: portugal,
        gana: gana,
        uruguai: uruguai,
        coreiaDoSul: coreiaDoSul,
        portugalPontos: this.PortugalPontos,
        ganaPontos: this.GanaPontos,
        uruguaiPontos: this.UruguaiPontos,
        coreiaDoSulPontos: this.CoreiaDoSulPontos,
        usuario: this.Usuario,
      })
      .subscribe((data) => {
        this.data = data;
        alert('Registrado, boa sorte!');
        this.goPainel();
      });
  }
}

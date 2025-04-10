import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

export type Pais = {
  nome: string;
  bandeira: string;
};

@Component({
  selector: 'app-mata-mata-grid',
  templateUrl: './mata-mata-grid.component.html',
  styleUrls: ['./mata-mata-grid.component.css'],
})
export class MataMataGridComponent implements OnInit {
  data: any;
  Usuario: any;
  edit: any;
  paises: Array<Array<any>> = [[], [], [], [], [], [], [], [], []];
  labels = [
    'Oitavas de final',
    'Quartas de final',
    'Semifinal',
    'Final',
    'Campeão',
    'Final',
    'Semifinal',
    'Quartas de final',
    'Oitavas de final',
  ];
  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService
  ) {}

  organizar = (teste: any): any => {
    var response: any = teste;
    for (let i = 1; i <= 16; i++) {
      if (i <= 8)
        this.paises[0].push({
          nome: response[`time${i}`],
          bandeira: `https://countryflagsapi.com/svg/${
            response[`time${i}Sigla`]
          }`,
        });
      else
        this.paises[8].push({
          nome: response[`time${i}`],
          bandeira: `https://countryflagsapi.com/svg/${
            response[`time${i}Sigla`]
          }`,
        });
    }

    this.paises[1] = [undefined, undefined, undefined, undefined];
    this.paises[2] = [undefined, undefined];
    this.paises[3] = [undefined];
    this.paises[4] = [undefined];
    this.paises[5] = [undefined];
    this.paises[6] = [undefined, undefined];
    this.paises[7] = [undefined, undefined, undefined, undefined];
  };

  async ngOnInit() {
    const token = localStorage.getItem('jwt');
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.Usuario =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    }
    this.edit = await this.http
      .get<any>(
        'https://localhost:7288/api/HabilitarPalpite',
        {}
      )
      .toPromise();

    let result = await this.http
      .post<any>('https://localhost:7288/api/Oitavas', {
        usuario: this.Usuario,
      })
      .toPromise();

    this.organizar(result);
  }

  goPainel() {
    this.router.navigate(['painel']);
  }

  onPaisClick(index: Array<number>, i: number = 0) {
    if (index[0] == 4) return;
    let pais = this.paises[index[0]][index[1]];
    let inc = index[0] < 4 ? 1 : -1;
    this.paises[index[0] + inc][Math.floor(index[1] / 2)] =
      i == 0 ? pais : undefined;
    this.onPaisClick([index[0] + inc, Math.floor(index[1] / 2)], -1);
  }

  isActive(pais: Pais, index: Array<number>) {
    try {
      let inc = index[0] < 4 ? 1 : -1;
      if (this.paises[index[0] + inc][Math.floor(index[1] / 2)] === pais)
        return true;
    } catch {}
    return false;
  }

  async send() {
    let quartasPayload: any = {};
    for (let i = 0; i < [...this.paises[1], ...this.paises[7]].length; i++) {
      quartasPayload[`time${i + 1}`] = (
        [...this.paises[1], ...this.paises[7]][i] as Pais
      )?.nome;
    }

    let semisPayload: any = {};
    for (let i = 0; i < [...this.paises[2], ...this.paises[6]].length; i++) {
      semisPayload[`time${i + 1}`] = (
        [...this.paises[2], ...this.paises[6]][i] as Pais
      )?.nome;
    }

    let finaisPayload: any = {};
    for (let i = 0; i < [...this.paises[3], ...this.paises[5]].length; i++) {
      finaisPayload[`time${i + 1}`] = (
        [...this.paises[3], ...this.paises[5]][i] as Pais
      )?.nome;
    }

    let campeaoPayload = {
      time: this.paises[4][0]?.nome,
    };

    let oitavasResponse = await this.http
      .put<any>('https://localhost:7288/api/Quartas', {
        usuario: this.Usuario,
        time1: quartasPayload.time1,
        time2: quartasPayload.time2,
        time3: quartasPayload.time3,
        time4: quartasPayload.time4,
        time5: quartasPayload.time5,
        time6: quartasPayload.time6,
        time7: quartasPayload.time7,
        time8: quartasPayload.time8,
      })
      .toPromise();

    let quartasResponse = await this.http
      .put<any>('https://localhost:7288/api/Semis', {
        usuario: this.Usuario,
        time1: semisPayload.time1,
        time2: semisPayload.time2,
        time3: semisPayload.time3,
        time4: semisPayload.time4,
      })
      .toPromise();

    let semisResponse = await this.http
      .put<any>('https://localhost:7288/api/Finais', {
        usuario: this.Usuario,
        time1: finaisPayload.time1,
        time2: finaisPayload.time2,
      })
      .toPromise();

    let finaisResponse = await this.http
      .put<any>('https://localhost:7288/api/Campeao', {
        usuario: this.Usuario,
        time: campeaoPayload.time,
      })
      .toPromise();

    console.log(quartasPayload, semisPayload, finaisPayload, campeaoPayload);

    alert('Registrado, boa sorte!');
    this.goPainel();
  }
}

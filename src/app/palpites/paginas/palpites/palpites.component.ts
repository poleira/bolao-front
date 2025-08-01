import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RegraResponse } from 'src/app/home/models/responses/regra.response';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent implements OnInit {

  regras!: RegraResponse[];
  bolaoToken!: number;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.verificarParametrosRota();
    //Mock de dados para teste
    const mockRegras: RegraResponse[] = [
      { id: 1, descricao: 'Fase de Grupos', explicacao: "25" },
      { id: 2, descricao: 'Regra #2', explicacao: "18 "},
      { id: 3, descricao: 'Regra #3', explicacao: '10' },
      { id: 4, descricao: 'Regra #4', explicacao: "1" }
    ];

    this.regras = mockRegras;
  }

  private verificarParametrosRota(): void {
    this.route.params.subscribe(params => {
      if (params['token']) {
        this.bolaoToken = params['token'];
      }
    });
  }
}
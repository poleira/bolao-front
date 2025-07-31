import { Component, OnInit } from '@angular/core';
import { RegraResponse } from 'src/app/home/models/responses/regra.response';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent implements OnInit {

  regras!: RegraResponse[];
  idBolao!: number;

  constructor(
    ) { }

  ngOnInit(): void {
    //Mock de dados para teste
    const mockRegras: RegraResponse[] = [
      { id: 1, descricao: 'Regra #1', explicacao: "25" },
      { id: 2, descricao: 'Regra #2', explicacao: "18 "},
      { id: 3, descricao: 'Regra #3', explicacao: '10' },
      { id: 4, descricao: 'Regra #4', explicacao: "1" }
    ];

    this.regras = mockRegras;
  }
}
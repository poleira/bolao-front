import { Component, Input, OnInit } from '@angular/core';
import { GrupoResponse } from 'src/app/shared/models/responses/grupo.response';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tabela-grupo',
  templateUrl: './tabela-grupo.component.html',
  styleUrls: ['./tabela-grupo.component.css']
})
export class TabelaGrupoComponent implements OnInit {

  @Input() grupo!: GrupoResponse;
  @Input() selecoes: SelecaoResponse[] = [];
  @Input() esconderPontuacao: boolean = false;

  ordemManual: SelecaoResponse[] | null = null;

  get selecoesExibidas(): SelecaoResponse[] {
    let lista: SelecaoResponse[];

    if (this.ordemManual) {
      lista = this.ordemManual;
    } else {
      lista = [...this.selecoes].sort((a, b) => {
        if (b.pontuacaoSelecao === a.pontuacaoSelecao) {
          return a.nome.localeCompare(b.nome);
        }
        return b.pontuacaoSelecao - a.pontuacaoSelecao;
      });
    }

    // Atualiza sempre a posição ao exibir
    lista.forEach((selecao, index) => {
      selecao.posicaoSelecaoFaseDeGrupos = index + 1;
    });

    return lista;
  }


  constructor() {}

  ngOnInit(): void {}

  drop(event: CdkDragDrop<SelecaoResponse[]>) {
    if (!this.ordemManual) {
      this.ordemManual = [...this.selecoesExibidas];
    }
    moveItemInArray(this.ordemManual, event.previousIndex, event.currentIndex);
  }



}


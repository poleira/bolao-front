import { Component, Input, OnInit } from '@angular/core';
import { SelecaoResponse } from 'src/app/shared/models/responses/selecao.response';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MOCK_12_SELECOES_TERCEIROS } from '../../modais/fase-eliminatoria-modal/mock';

@Component({
  selector: 'app-tabela-terceiro',
  templateUrl: './tabela-terceiro.component.html',
  styleUrls: ['./tabela-terceiro.component.css']
})
export class TabelaTerceiroComponent implements OnInit {

  @Input() selecoes: SelecaoResponse[] = MOCK_12_SELECOES_TERCEIROS;
  ordemManual: SelecaoResponse[] | null = null;

  get selecoesExibidas(): SelecaoResponse[] {
    return this.ordemManual ? this.ordemManual : [...this.selecoes];
  }

  constructor() { }

  ngOnInit(): void {}

  drop(event: CdkDragDrop<SelecaoResponse[]>) {
    if (!this.ordemManual) {
      this.ordemManual = [...this.selecoesExibidas];
    }
    moveItemInArray(this.ordemManual, event.previousIndex, event.currentIndex);
  }

}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { CabecalhoComponent } from "src/app/shared/componentes/cabecalho/cabecalho.component";
import { MensagemComponent } from "src/app/shared/componentes/mensagem/mensagem.component";
import { SenhaBolaoModalComponent } from './componentes/modais/senha-bolao-modal/senha-bolao-modal.component';
import { FormsModule } from "@angular/forms";
import { NotificacoesModalComponent } from './componentes/modais/notificacoes-modal/notificacoes-modal.component';
import { VisualizarPalpitesModalComponent } from './componentes/modais/visualizar-palpites-modal/visualizar-palpites-modal.component';
import { RodapeComponent } from './componentes/rodape/rodape.component';

@NgModule({
  declarations: [
    SenhaBolaoModalComponent,
    CabecalhoComponent,
    MensagemComponent,
    NotificacoesModalComponent,
    VisualizarPalpitesModalComponent,
    RodapeComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-spin' })
  ],
  exports: [
    SenhaBolaoModalComponent,
    CabecalhoComponent,
    MensagemComponent,
    VisualizarPalpitesModalComponent,
    RodapeComponent
  ]
})
export class SharedModule { }
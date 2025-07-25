import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from "ngx-spinner";
import { CabecalhoComponent } from "src/app/shared/componentes/cabecalho/cabecalho.component";
import { MensagemComponent } from "src/app/shared/componentes/mensagem/mensagem.component";
import { SenhaBolaoModalComponent } from './componentes/modais/senha-bolao-modal/senha-bolao-modal.component';
import { FormsModule } from "@angular/forms";
import { NotificacoesModalComponent } from './componentes/modais/notificacoes-modal/notificacoes-modal.component';

@NgModule({
  declarations: [
    SenhaBolaoModalComponent,
    CabecalhoComponent,
    MensagemComponent,
    NotificacoesModalComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    NgxSpinnerModule.forRoot({ type: 'ball-spin' })
  ],
  exports: [
    SenhaBolaoModalComponent,
    CabecalhoComponent,
    MensagemComponent
  ]
})
export class SharedModule { }
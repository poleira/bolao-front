import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PalpitesRoutingModule } from './palpites-routing.module';
import { PalpitesComponent } from './paginas/palpites/palpites.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { FaseDeGrupoAccordionComponent } from './modais/fase-de-grupo-modal/fase-de-grupo-accordion.component';
import { TabelaGrupoComponent } from './components/tabela-grupo/tabela-grupo.component';

@NgModule({
  declarations: [
    PalpitesComponent,
    FaseDeGrupoAccordionComponent,
    TabelaGrupoComponent
  ],
  imports: [
    CommonModule,
    PalpitesRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
    DragDropModule,
    ModalModule.forRoot()
  ]
})
export class PalpitesModule { }
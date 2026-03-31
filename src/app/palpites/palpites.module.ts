import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PalpitesRoutingModule } from './palpites-routing.module';
import { PalpitesComponent } from './paginas/palpites/palpites.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';
import { FaseDeGrupoAccordionComponent } from './modais/fase-de-grupo-accordion/fase-de-grupo-accordion.component';
import { TabelaGrupoComponent } from './components/tabela-grupo/tabela-grupo.component';
import { ArtilheiroAccordionComponent } from './modais/artilheiro-accordion/artilheiro-accordion.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FaseEliminatoriaAccordionComponent } from './modais/fase-eliminatoria-accordion/fase-eliminatoria-accordion.component';
import { JogosBrAccordionComponent } from './modais/jogos-br-accordion/jogos-br-accordion.component';
import { MelhoresTerceirosAccordeonComponent } from './modais/melhores-terceiros-accordeon/melhores-terceiros-accordeon.component';
import { TabelaTerceiroComponent } from './components/tabela-terceiro/tabela-terceiro.component';

@NgModule({
  declarations: [
    PalpitesComponent,
    FaseDeGrupoAccordionComponent,
    TabelaGrupoComponent,
    ArtilheiroAccordionComponent,
    FaseEliminatoriaAccordionComponent,
    JogosBrAccordionComponent,
    MelhoresTerceirosAccordeonComponent,
    TabelaTerceiroComponent
  ],
  imports: [
    CommonModule,
    PalpitesRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxSpinnerModule,
    DragDropModule,
    NgSelectModule,
    ModalModule.forRoot()
  ]
})
export class PalpitesModule { }
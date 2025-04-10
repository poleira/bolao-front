import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PainelRoutingModule } from './painel-routing.module';
import { ListaPaineisComponent } from './lista-paineis/lista-paineis.component';
import { HeaderComponent } from '../header/header.component';
import { RankComponent } from './rank/rank.component';


@NgModule({
  declarations: [
    ListaPaineisComponent, HeaderComponent, RankComponent
  ],
  imports: [
    CommonModule,
    PainelRoutingModule
  ]
})
export class PainelModule { }

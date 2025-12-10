import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegrasRoutingModule } from './regras-routing.module';
import { RegrasComponent } from './paginas/regras.component';
import { FormsModule } from '@angular/forms';
import { CabecalhoComponent } from '../shared/componentes/cabecalho/cabecalho.component';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    RegrasComponent
  ],
  imports: [
    CommonModule, 
    RegrasRoutingModule, 
    FormsModule,
    SharedModule,
    ModalModule.forRoot()
  ],
})
export class RegrasModule {}

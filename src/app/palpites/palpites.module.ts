import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PalpitesRoutingModule } from './palpites-routing.module';
import { PalpitesComponent } from './paginas/palpites/palpites.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PalpitesComponent
  ],
  imports: [
    CommonModule,
    PalpitesRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    NgxSpinnerModule,
    ModalModule.forRoot()
  ]
})
export class PalpitesModule { }
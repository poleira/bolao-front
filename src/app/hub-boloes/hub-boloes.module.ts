import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HubBoloesComponent } from './paginas/hub-boloes.component';
import { SharedModule } from '../shared/shared.module';
import { HubBoloesRoutingModule } from './hub-boloes-routing.module';

@NgModule({
  declarations: [
    HubBoloesComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HubBoloesRoutingModule,
    SharedModule
  ]
})
export class HubBoloesModule { }

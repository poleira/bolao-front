import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoARoutingModule } from './grupo-a-routing.module';
import { FormsModule } from '@angular/forms';
import { GrupoAComponent } from './grupo-a.component';


@NgModule({
  declarations: [GrupoAComponent],
  imports: [
    CommonModule,
    GrupoARoutingModule,
    FormsModule
  ]
})
export class GrupoAModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoFRoutingModule } from './grupo-f-routing.module';
import { GrupoFComponent } from './grupo-f.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GrupoFComponent],
  imports: [CommonModule, GrupoFRoutingModule, FormsModule],
})
export class GrupoFModule {}

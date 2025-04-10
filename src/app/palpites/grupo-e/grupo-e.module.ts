import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoERoutingModule } from './grupo-e-routing.module';
import { FormsModule } from '@angular/forms';
import { GrupoEComponent } from './grupo-e.component';

@NgModule({
  declarations: [GrupoEComponent],
  imports: [CommonModule, GrupoERoutingModule, FormsModule],
})
export class GrupoEModule {}

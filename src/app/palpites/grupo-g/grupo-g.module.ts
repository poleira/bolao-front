import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoGRoutingModule } from './grupo-g-routing.module';
import { FormsModule } from '@angular/forms';
import { GrupoGComponent } from './grupo-g.component';

@NgModule({
  declarations: [GrupoGComponent],
  imports: [CommonModule, GrupoGRoutingModule, FormsModule],
})
export class GrupoGModule {}

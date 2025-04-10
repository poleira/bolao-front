import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoHRoutingModule } from './grupo-h-routing.module';
import { GrupoGRoutingModule } from '../grupo-g/grupo-g-routing.module';
import { FormsModule } from '@angular/forms';
import { GrupoGComponent } from '../grupo-g/grupo-g.component';
import { GrupoHComponent } from './grupo-h.component';

@NgModule({
  declarations: [GrupoHComponent],
  imports: [CommonModule, GrupoHRoutingModule, FormsModule],
})
export class GrupoHModule {}

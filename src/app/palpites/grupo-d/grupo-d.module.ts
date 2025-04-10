import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoDRoutingModule } from './grupo-d-routing.module';
import { GrupoDComponent } from './grupo-d.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GrupoDComponent],
  imports: [CommonModule, GrupoDRoutingModule, FormsModule],
})
export class GrupoDModule {}

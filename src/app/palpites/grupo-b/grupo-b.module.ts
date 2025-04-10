import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoBRoutingModule } from './grupo-b-routing.module';
import { GrupoBComponent } from './grupo-b.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [GrupoBComponent],
  imports: [CommonModule, GrupoBRoutingModule, FormsModule],
})
export class GrupoBModule {}

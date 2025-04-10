import { GrupoCComponent } from './grupo-c.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupoCRoutingModule } from './grupo-c-routing.module';

@NgModule({
  declarations: [GrupoCComponent],
  imports: [CommonModule, GrupoCRoutingModule, FormsModule],
})
export class GrupoCModule {}

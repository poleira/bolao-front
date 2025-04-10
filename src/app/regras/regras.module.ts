import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegrasRoutingModule } from './regras-routing.module';
import { RegrasComponent } from './regras.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RegrasComponent],
  imports: [CommonModule, RegrasRoutingModule, FormsModule],
})
export class RegrasModule {}

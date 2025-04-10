import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JogoBRRoutingModule } from './jogo-br-routing.module';
import { JogoBRComponent } from './jogo-br.component';

@NgModule({
  declarations: [JogoBRComponent],
  imports: [CommonModule, JogoBRRoutingModule, FormsModule],
})
export class JogoBRModule {}

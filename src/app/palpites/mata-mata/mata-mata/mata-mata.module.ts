import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MataMataGridComponent } from '../mata-mata-grid/mata-mata-grid.component';
import { MataMataPaisComponent } from '../mata-mata-pais/mata-mata-pais.component';
import { MataMataRoutingModule } from './mata-mata-routing.module';


@NgModule({
  declarations: [MataMataGridComponent, MataMataPaisComponent],
  imports: [
    CommonModule,
    MataMataRoutingModule
  ],
  exports: [MataMataGridComponent, MataMataPaisComponent]
})
export class MataMataModule { }

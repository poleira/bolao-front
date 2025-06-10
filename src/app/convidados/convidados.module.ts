import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConvidadosRoutingModule } from 'src/app/convidados/convidados-routing.module';
import { ConvidadosComponent } from './pages/convidados.component';


@NgModule({
  declarations: [
    ConvidadosComponent,
  ],
  imports: [
    CommonModule,
    ConvidadosRoutingModule,
    FormsModule, 
    SharedModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    NgxSpinnerModule.forRoot({ type: 'ball-spin' })
  ],
  providers:[],
  exports: [ConvidadosComponent],
})
export class ConvidadosModule { }
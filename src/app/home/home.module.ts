import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MensagemModule } from '../componentes/mensagem/mensagem.module';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './pages/home.component';
import { HomeRoutingModule } from './pages/home-routing.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, 
    MensagemModule, 
    ReactiveFormsModule, 
    HttpClientModule,
  ],
  providers:[],
  exports: [HomeComponent],
})
export class HomeModule { }

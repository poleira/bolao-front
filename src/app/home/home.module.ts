import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from 'src/app/home/pages/home.component';
import { HomeRoutingModule } from 'src/app/home/pages/home-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, 
    SharedModule, 
    ReactiveFormsModule, 
    HttpClientModule,
  ],
  providers:[],
  exports: [HomeComponent],
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from 'src/app/home/pages/home.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CriacaoBolaoFormularioComponent } from 'src/app/home/componentes/criacao-bolao-formulario/criacao-bolao-formulario.component';
import { HomeRoutingModule } from 'src/app/home/home-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    HomeComponent,
    CriacaoBolaoFormularioComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule, 
    SharedModule, 
    ReactiveFormsModule, 
    HttpClientModule,
    NgxSpinnerModule.forRoot({ type: 'ball-spin' })
  ],
  providers:[],
  exports: [HomeComponent],
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MensagemModule } from '../componentes/mensagem/mensagem.module';
import { HttpClientModule } from '@angular/common/http';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './pages/home.component';
import { HomeRoutingModule } from './pages/home-routing.module';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RecoverPasswordComponent,
    RegisterComponent
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

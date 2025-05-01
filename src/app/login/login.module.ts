import { NgModule } from '@angular/core';
import { LoginComponent } from './paginas/login/login.component';
import { RecoverPasswordComponent } from './components/recover-password/recover-password.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginRoutingModule } from './login-routing.module';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    LoginComponent,
    RecoverPasswordComponent,
    RegisterComponent
  ],
  imports: [
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    LoginRoutingModule
  ],
  providers:[],
  exports: [],
})
export class LoginModule { }

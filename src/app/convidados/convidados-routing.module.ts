import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvidadosComponent } from 'src/app/convidados/pages/convidados.component';
import { LoginComponent } from 'src/app/login/paginas/login/login.component';
import { RegisterComponent } from 'src/app/login/components/register/register.component';
import { RecoverPasswordComponent } from 'src/app/login/components/recover-password/recover-password.component';

const routes: Routes = [
  {
    path: '',
    component: ConvidadosComponent
  },
  {
    path: ':token',
    component: LoginComponent
  },
  {
    path: ':token/inserir',
    component: RegisterComponent
  },
  {
    path: ':token/recuperar-senha',
    component: RecoverPasswordComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvidadosRoutingModule { }

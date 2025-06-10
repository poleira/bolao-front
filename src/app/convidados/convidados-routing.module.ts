import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConvidadosComponent } from 'src/app/convidados/pages/convidados.component';
import { LoginComponent } from 'src/app/login/paginas/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: ConvidadosComponent
  },
  {
    path: ':token',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConvidadosRoutingModule { }

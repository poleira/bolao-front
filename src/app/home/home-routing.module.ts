import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home.component';
import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NovoUsuarioComponent } from './novo-usuario/novo-usuario.component';

const routes: Routes = [{
  //externo
  path: '',
  component: HomeComponent,
  children: [{ //interno
    path: '',
    component:LoginComponent
  },
  {
    path: 'novo-usuario',
    component: NovoUsuarioComponent
  }

]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

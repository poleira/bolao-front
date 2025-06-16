import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'hub-boloes',
    loadChildren: () => import('./hub-boloes/hub-boloes.module').then(m => m.HubBoloesModule)
  },
  {
    path: 'regras',
    loadChildren: () => import('./regras/regras.module').then(m => m.RegrasModule)
  },
  {
    path: '**',
    redirectTo: '/login'
  },
  {
    path: 'convidados',
    loadChildren: () => import('./convidados/convidados.module').then((m) => m.ConvidadosModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
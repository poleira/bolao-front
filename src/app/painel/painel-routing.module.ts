import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ListaPaineisComponent } from './lista-paineis/lista-paineis.component';
import { RankComponent } from './rank/rank.component';

const routes: Routes = [
  {
    path: '',
    component: ListaPaineisComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rank',
    component: RankComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'grupoB',
    loadChildren: () =>
      import('../palpites/grupo-b/grupo-b.module').then((m) => m.GrupoBModule),
  },
  {
    path: 'grupoA',
    loadChildren: () =>
      import('../palpites/grupo-a/grupo-a.module').then((m) => m.GrupoAModule),
  },
  {
    path: 'grupoC',
    loadChildren: () =>
      import('../palpites/grupo-c/grupo-c.module').then((m) => m.GrupoCModule),
  },
  {
    path: 'grupoD',
    loadChildren: () =>
      import('../palpites/grupo-d/grupo-d.module').then((m) => m.GrupoDModule),
  },
  {
    path: 'grupoE',
    loadChildren: () =>
      import('../palpites/grupo-e/grupo-e.module').then((m) => m.GrupoEModule),
  },
  {
    path: 'grupoF',
    loadChildren: () =>
      import('../palpites/grupo-f/grupo-f.module').then((m) => m.GrupoFModule),
  },
  {
    path: 'grupoG',
    loadChildren: () =>
      import('../palpites/grupo-g/grupo-g.module').then((m) => m.GrupoGModule),
  },
  {
    path: 'grupoH',
    loadChildren: () =>
      import('../palpites/grupo-h/grupo-h.module').then((m) => m.GrupoHModule),
  },
  {
    path: 'matamata',
    loadChildren: () =>
      import('../palpites/mata-mata/mata-mata/mata-mata.module').then(
        (m) => m.MataMataModule
      ),
  },
  {
    path: 'jogosbr',
    loadChildren: () =>
      import('../palpites/jogo-br/jogo-br.module').then((m) => m.JogoBRModule),
  },
  {
    path: 'regras',
    loadChildren: () =>
      import('../regras/regras.module').then((m) => m.RegrasModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PainelRoutingModule {}

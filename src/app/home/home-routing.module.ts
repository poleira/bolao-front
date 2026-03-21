import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from 'src/app/home/pages/home.component';
import { CriacaoBolaoFormularioComponent } from './componentes/criacao-bolao-formulario/criacao-bolao-formulario.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { PremiosComponent } from './pages/premios/premios.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'criar-bolao',
    component: CriacaoBolaoFormularioComponent
  },
  {
    path: 'editar-bolao/:tokenAcesso',
    component: CriacaoBolaoFormularioComponent,
  }
  ,
  {
    path: 'ranking/:tokenAcesso',
    component: RankingComponent
  },
  {
    path: 'premios/:tokenAcesso',
    component: PremiosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

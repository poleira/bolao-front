import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PalpitesComponent } from './paginas/palpites/palpites.component';

const routes: Routes = [
  {
    path: ':token',
    component: PalpitesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PalpitesRoutingModule { }

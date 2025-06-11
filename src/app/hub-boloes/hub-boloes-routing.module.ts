import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HubBoloesComponent } from './paginas/hub-boloes.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HubBoloesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HubBoloesRoutingModule { }

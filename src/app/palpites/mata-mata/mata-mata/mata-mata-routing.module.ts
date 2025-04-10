import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { MataMataGridComponent } from '../mata-mata-grid/mata-mata-grid.component';
import { MataMataPaisComponent } from '../mata-mata-pais/mata-mata-pais.component';


const routes: Routes = [
  {
    path: '',
    component: MataMataGridComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MataMataRoutingModule { }

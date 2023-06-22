import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CformComponent } from './shared/cform/cform.component';
import { CtableComponent } from './shared/ctable/ctable.component';
import { TableComponent } from './table/table.component';

const routes: Routes = [
  {path:'',component:TableComponent},
  // {path:'cform',component:CformComponent},
  // {path:'ctable',component:CtableComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

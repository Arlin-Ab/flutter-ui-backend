import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { EmpleadoListComponent } from './pages/empleado/empleado-list.component';
import { EmpleadoFormComponent } from './pages/empleado/empleado-form.component';

import { UserListComponent } from './pages/user/user-list.component';
import { UserFormComponent } from './pages/user/user-form.component';


const routes: Routes = [
  
  { path: 'empleados', component: EmpleadoListComponent },
  { path: 'empleado/new', component: EmpleadoFormComponent },
  { path: 'empleado/:id', component: EmpleadoFormComponent },
  
  { path: 'users', component: UserListComponent },
  { path: 'user/new', component: UserFormComponent },
  { path: 'user/:id', component: UserFormComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
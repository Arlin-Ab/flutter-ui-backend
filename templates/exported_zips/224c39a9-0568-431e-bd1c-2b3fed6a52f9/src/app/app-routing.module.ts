import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { MascotaListComponent } from './pages/mascota/mascota-list.component';
import { MascotaFormComponent } from './pages/mascota/mascota-form.component';

import { UsuarioListComponent } from './pages/usuario/usuario-list.component';
import { UsuarioFormComponent } from './pages/usuario/usuario-form.component';


const routes: Routes = [
  
  { path: 'mascotas', component: MascotaListComponent },
  { path: 'mascota/new', component: MascotaFormComponent },
  { path: 'mascota/:id', component: MascotaFormComponent },
  
  { path: 'usuarios', component: UsuarioListComponent },
  { path: 'usuario/new', component: UsuarioFormComponent },
  { path: 'usuario/:id', component: UsuarioFormComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
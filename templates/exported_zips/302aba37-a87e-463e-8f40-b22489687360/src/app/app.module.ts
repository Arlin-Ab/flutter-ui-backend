import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


import { MascotaListComponent } from './pages/mascota/mascota-list.component';
import { MascotaFormComponent } from './pages/mascota/mascota-form.component';

import { UsuarioListComponent } from './pages/usuario/usuario-list.component';
import { UsuarioFormComponent } from './pages/usuario/usuario-form.component';


@NgModule({
  declarations: [
    AppComponent,
    
    MascotaListComponent,
    MascotaFormComponent,
    
    UsuarioListComponent,
    UsuarioFormComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
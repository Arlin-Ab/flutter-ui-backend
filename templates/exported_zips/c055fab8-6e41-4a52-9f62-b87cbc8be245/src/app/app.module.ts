import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


import { EmpleadoListComponent } from './pages/empleado/empleado-list.component';
import { EmpleadoFormComponent } from './pages/empleado/empleado-form.component';

import { UserListComponent } from './pages/user/user-list.component';
import { UserFormComponent } from './pages/user/user-form.component';


@NgModule({
  declarations: [
    AppComponent,
    
    EmpleadoListComponent,
    EmpleadoFormComponent,
    
    UserListComponent,
    UserFormComponent,
    
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
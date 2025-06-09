import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';


import { ProductoListComponent } from './pages/producto/producto-list.component';
import { ProductoFormComponent } from './pages/producto/producto-form.component';

import { VentaListComponent } from './pages/venta/venta-list.component';
import { VentaFormComponent } from './pages/venta/venta-form.component';

import { Venta_ProductoListComponent } from './pages/venta_producto/venta_producto-list.component';
import { Venta_ProductoFormComponent } from './pages/venta_producto/venta_producto-form.component';


@NgModule({
  declarations: [
    AppComponent,
    
    ProductoListComponent,
    ProductoFormComponent,
    
    VentaListComponent,
    VentaFormComponent,
    
    Venta_ProductoListComponent,
    Venta_ProductoFormComponent,
    
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
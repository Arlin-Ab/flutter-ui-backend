import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { ProductoListComponent } from './pages/producto/producto-list.component';
import { ProductoFormComponent } from './pages/producto/producto-form.component';

import { VentaListComponent } from './pages/venta/venta-list.component';
import { VentaFormComponent } from './pages/venta/venta-form.component';

import { Venta_ProductoListComponent } from './pages/venta_producto/venta_producto-list.component';
import { Venta_ProductoFormComponent } from './pages/venta_producto/venta_producto-form.component';

import { ProxyConnectorListComponent } from './pages/proxyconnector/proxyconnector-list.component';
import { ProxyConnectorFormComponent } from './pages/proxyconnector/proxyconnector-form.component';


const routes: Routes = [
  
  { path: 'productos', component: ProductoListComponent },
  { path: 'producto/new', component: ProductoFormComponent },
  { path: 'producto/:id', component: ProductoFormComponent },
  
  { path: 'ventas', component: VentaListComponent },
  { path: 'venta/new', component: VentaFormComponent },
  { path: 'venta/:id', component: VentaFormComponent },
  
  { path: 'venta_productos', component: Venta_ProductoListComponent },
  { path: 'venta_producto/new', component: Venta_ProductoFormComponent },
  { path: 'venta_producto/:id', component: Venta_ProductoFormComponent },
  
  { path: 'proxyconnectors', component: ProxyConnectorListComponent },
  { path: 'proxyconnector/new', component: ProxyConnectorFormComponent },
  { path: 'proxyconnector/:id', component: ProxyConnectorFormComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
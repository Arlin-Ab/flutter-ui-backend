import { Component, OnInit } from '@angular/core';
import { Venta_Producto } from '../../models/venta_producto.model';
import { Venta_ProductoService } from '../../services/venta_producto.service';

@Component({
  selector: 'app-venta_producto-list',
  templateUrl: './venta_producto-list.component.html'
})
export class Venta_ProductoListComponent implements OnInit {
  items: Venta_Producto[] = [];

  constructor(private service: Venta_ProductoService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}

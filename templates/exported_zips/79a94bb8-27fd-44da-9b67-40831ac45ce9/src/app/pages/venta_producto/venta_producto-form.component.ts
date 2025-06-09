import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Venta_Producto } from '../../models/venta_producto.model';
import { Venta_ProductoService } from '../../services/venta_producto.service';

@Component({
  selector: 'app-venta_producto-form',
  templateUrl: './venta_producto-form.component.html',
  styleUrls: ['./venta_producto-form.component.css']
})
export class Venta_ProductoFormComponent implements OnInit {
  item: Venta_Producto = {
    
    
      
    
      
    
      
    
    
    id: '',
    
    
    "Cantidad": '',
    
    "Precio_unitario": '',
    
    "Sub_Total": '',
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Venta_ProductoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.service.getById(id).subscribe(data => this.item = data);
    }
  }

  save(): void {
    const request = this.isEdit
      ? this.service.update((this.item as any).id, this.item)
      : this.service.create(this.item);

    request.subscribe(() => this.router.navigate(['/venta_productos']));
  }
}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-form',
  templateUrl: './producto-form.component.html',
  styleUrls: ['./producto-form.component.css']
})
export class ProductoFormComponent implements OnInit {
  item: Producto = {
    
    
      
    
      
    
      
    
      
    
    
    id: '',
    
    
    "Descripción": '',
    
    "Nombre": '',
    
    "Precio_Unitario": '',
    
    "Stock": '',
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProductoService
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

    request.subscribe(() => this.router.navigate(['/productos']));
  }
}
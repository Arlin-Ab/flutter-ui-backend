import { Component, OnInit } from '@angular/core';
import { Venta } from '../../models/venta.model';
import { VentaService } from '../../services/venta.service';

@Component({
  selector: 'app-venta-list',
  templateUrl: './venta-list.component.html'
})
export class VentaListComponent implements OnInit {
  items: Venta[] = [];

  constructor(private service: VentaService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}

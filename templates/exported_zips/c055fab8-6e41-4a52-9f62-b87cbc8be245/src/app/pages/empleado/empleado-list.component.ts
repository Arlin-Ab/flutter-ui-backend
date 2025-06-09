import { Component, OnInit } from '@angular/core';
import { Empleado } from '../../models/empleado.model';
import { EmpleadoService } from '../../services/empleado.service';

@Component({
  selector: 'app-empleado-list',
  templateUrl: './empleado-list.component.html'
})
export class EmpleadoListComponent implements OnInit {
  items: Empleado[] = [];

  constructor(private service: EmpleadoService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): Observable<void> {
    let items = this.getLocalItems();
    items = items.filter(i => i.id !== id);
    this.saveLocalItems(items);
    return of(undefined);
  }
}

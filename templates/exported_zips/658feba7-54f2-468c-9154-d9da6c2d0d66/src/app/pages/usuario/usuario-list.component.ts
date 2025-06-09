import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-list',
  template: `
    <h2>Usuario List</h2>
    <a routerLink="/usuario/new">Create New</a>
    <ul>
      <li *ngFor="let item of items">
        {{ item | json }}
        <a [routerLink]="['/usuario', item['id']]">Edit</a>
        <button (click)="delete(item['id'])">Delete</button>
      </li>
    </ul>
  `
})
export class UsuarioListComponent implements OnInit {
  items: Usuario[] = [];

  constructor(private service: UsuarioService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}
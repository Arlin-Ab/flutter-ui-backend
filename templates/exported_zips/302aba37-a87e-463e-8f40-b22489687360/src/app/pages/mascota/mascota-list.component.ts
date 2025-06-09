import { Component, OnInit } from '@angular/core';
import { Mascota } from '../../models/mascota.model';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-list',
  template: `
    <h2>Mascota List</h2>
    <a routerLink="/mascota/new">Create New</a>
    <ul>
      <li *ngFor="let item of items">
        {{ item | json }}
        <a [routerLink]="['/mascota', item.id]">Edit</a>
        <button (click)="delete(item.id)">Delete</button>
      </li>
    </ul>
  `
})
export class MascotaListComponent implements OnInit {
  items: Mascota[] = [];

  constructor(private service: MascotaService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i.id !== id);
    });
  }
}
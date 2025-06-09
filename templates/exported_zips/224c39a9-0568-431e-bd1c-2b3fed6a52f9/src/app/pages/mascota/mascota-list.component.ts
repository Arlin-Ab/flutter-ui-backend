import { Component, OnInit } from '@angular/core';
import { Mascota } from '../../models/mascota.model';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-list',
  templateUrl: './mascota-list.component.html'
})
export class MascotaListComponent implements OnInit {
  items: Mascota[] = [];

  constructor(private service: MascotaService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}

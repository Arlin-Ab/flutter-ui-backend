import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mascota } from '../../models/mascota.model';
import { MascotaService } from '../../services/mascota.service';

@Component({
  selector: 'app-mascota-form',
  templateUrl: './mascota-form.component.html',
  styleUrls: ['./mascota-form.component.css']
})
export class MascotaFormComponent implements OnInit {
  item: Mascota = {
    
    "Edad": '',
    
    "Nombre": '',
    
    "Raza": '',
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: MascotaService
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

    request.subscribe(() => this.router.navigate(['/mascotas']));
  }
}
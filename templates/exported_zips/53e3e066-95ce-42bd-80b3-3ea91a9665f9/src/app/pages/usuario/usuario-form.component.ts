import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  template: `
    <h2>{{ isEdit ? "Edit" : "Create" }} Usuario</h2>
    <form (ngSubmit)="save()">
    
      <label>Correo Electronico</label>
      <input [(ngModel)]="item['Correo Electronico']" name="Correo_Electronico" required />
    
      <label>Edad</label>
      <input [(ngModel)]="item['Edad']" name="Edad" required />
    
      <label>Nombre</label>
      <input [(ngModel)]="item['Nombre']" name="Nombre" required />
    
      <button type="submit">Save</button>
    </form>
  `
})
export class UsuarioFormComponent implements OnInit {
  item: Usuario = {
    
    "Correo Electronico": '',
    
    "Edad": '',
    
    "Nombre": '',
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: UsuarioService
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

    request.subscribe(() => this.router.navigate(['/usuarios']));
  }
}
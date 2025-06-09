import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  item: Usuario = {
    
    
      
    
      
    
      
    
    
    id: '',
    
    
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
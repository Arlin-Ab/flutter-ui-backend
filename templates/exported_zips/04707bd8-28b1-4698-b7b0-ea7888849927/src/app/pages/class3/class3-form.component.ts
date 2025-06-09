import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Class3 } from '../../models/class3.model';
import { Class3Service } from '../../services/class3.service';

@Component({
  selector: 'app-class3-form',
  templateUrl: './class3-form.component.html',
  styleUrls: ['./class3-form.component.css']
})
export class Class3FormComponent implements OnInit {
  item: Class3 = {
    
    
    
    id: '',
    
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Class3Service
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

    request.subscribe(() => this.router.navigate(['/class3s']));
  }
}
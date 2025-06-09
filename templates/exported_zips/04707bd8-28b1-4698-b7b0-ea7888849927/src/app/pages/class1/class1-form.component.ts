import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Class1 } from '../../models/class1.model';
import { Class1Service } from '../../services/class1.service';

@Component({
  selector: 'app-class1-form',
  templateUrl: './class1-form.component.html',
  styleUrls: ['./class1-form.component.css']
})
export class Class1FormComponent implements OnInit {
  item: Class1 = {
    
    
    
    id: '',
    
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Class1Service
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

    request.subscribe(() => this.router.navigate(['/class1s']));
  }
}
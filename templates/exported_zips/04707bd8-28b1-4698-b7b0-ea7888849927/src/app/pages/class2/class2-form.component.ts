import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Class2 } from '../../models/class2.model';
import { Class2Service } from '../../services/class2.service';

@Component({
  selector: 'app-class2-form',
  templateUrl: './class2-form.component.html',
  styleUrls: ['./class2-form.component.css']
})
export class Class2FormComponent implements OnInit {
  item: Class2 = {
    
    
    
    id: '',
    
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Class2Service
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

    request.subscribe(() => this.router.navigate(['/class2s']));
  }
}
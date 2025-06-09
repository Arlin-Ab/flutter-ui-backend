import { Component, OnInit } from '@angular/core';
import { Class3 } from '../../models/class3.model';
import { Class3Service } from '../../services/class3.service';

@Component({
  selector: 'app-class3-list',
  templateUrl: './class3-list.component.html'
})
export class Class3ListComponent implements OnInit {
  items: Class3[] = [];

  constructor(private service: Class3Service) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}

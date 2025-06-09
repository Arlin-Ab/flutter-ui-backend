import { Component, OnInit } from '@angular/core';
import { Class1 } from '../../models/class1.model';
import { Class1Service } from '../../services/class1.service';

@Component({
  selector: 'app-class1-list',
  templateUrl: './class1-list.component.html'
})
export class Class1ListComponent implements OnInit {
  items: Class1[] = [];

  constructor(private service: Class1Service) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}

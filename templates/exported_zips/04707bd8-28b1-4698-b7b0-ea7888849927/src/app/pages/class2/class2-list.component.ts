import { Component, OnInit } from '@angular/core';
import { Class2 } from '../../models/class2.model';
import { Class2Service } from '../../services/class2.service';

@Component({
  selector: 'app-class2-list',
  templateUrl: './class2-list.component.html'
})
export class Class2ListComponent implements OnInit {
  items: Class2[] = [];

  constructor(private service: Class2Service) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}

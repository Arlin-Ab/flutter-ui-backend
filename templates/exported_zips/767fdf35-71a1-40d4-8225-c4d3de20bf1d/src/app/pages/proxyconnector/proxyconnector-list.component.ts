import { Component, OnInit } from '@angular/core';
import { ProxyConnector } from '../../models/proxyconnector.model';
import { ProxyConnectorService } from '../../services/proxyconnector.service';

@Component({
  selector: 'app-proxyconnector-list',
  templateUrl: './proxyconnector-list.component.html'
})
export class ProxyConnectorListComponent implements OnInit {
  items: ProxyConnector[] = [];

  constructor(private service: ProxyConnectorService) {}

  ngOnInit(): void {
    this.service.getAll().subscribe(data => this.items = data);
  }

  delete(id: string): void {
    this.service.delete(id).subscribe(() => {
      this.items = this.items.filter(i => i['id'] !== id);
    });
  }
}

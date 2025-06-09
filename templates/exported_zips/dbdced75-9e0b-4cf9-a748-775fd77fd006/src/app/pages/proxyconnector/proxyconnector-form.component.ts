import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProxyConnector } from '../../models/proxyconnector.model';
import { ProxyConnectorService } from '../../services/proxyconnector.service';

@Component({
  selector: 'app-proxyconnector-form',
  templateUrl: './proxyconnector-form.component.html',
  styleUrls: ['./proxyconnector-form.component.css']
})
export class ProxyConnectorFormComponent implements OnInit {
  item: ProxyConnector = {
    
    
    
    id: '',
    
    
  };
  isEdit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ProxyConnectorService
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

    request.subscribe(() => this.router.navigate(['/proxyconnectors']));
  }
}
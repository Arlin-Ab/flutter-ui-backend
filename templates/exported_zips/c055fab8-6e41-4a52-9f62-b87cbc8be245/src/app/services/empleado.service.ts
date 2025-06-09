import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Empleado } from '../models/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private storageKey = 'empleados';

  constructor() {}

  getAll(): Observable<Empleado[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Empleado> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Empleado);
  }

  create(data: Empleado): Observable<Empleado> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Empleado): Observable<Empleado> {
    let items = this.getLocalItems();
    items = items.map(i => i.id === id ? { ...data, id } : i);
    this.saveLocalItems(items);
    return of(data);
  }

  delete(id: string): Observable<void> {
    let items = this.getLocalItems();
    items = items.filter(i => i.id !== id);
    this.saveLocalItems(items);
    return of();
  }

  // Helpers
  private getLocalItems(): Empleado[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Empleado[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/empleados'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.baseUrl);
  }

  getById(id: string): Observable<Empleado> {
    return this.http.get<Empleado>(`${this.baseUrl}/${id}`);
  }

  create(data: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.baseUrl, data);
  }

  update(id: string, data: Empleado): Observable<Empleado> {
    return this.http.put<Empleado>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
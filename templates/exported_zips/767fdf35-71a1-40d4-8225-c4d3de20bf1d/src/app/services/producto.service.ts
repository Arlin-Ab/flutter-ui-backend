import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private storageKey = 'productos';

  constructor() {}

  getAll(): Observable<Producto[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Producto> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Producto);
  }

  create(data: Producto): Observable<Producto> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Producto): Observable<Producto> {
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
  private getLocalItems(): Producto[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Producto[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/productos'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.baseUrl);
  }

  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.baseUrl}/${id}`);
  }

  create(data: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.baseUrl, data);
  }

  update(id: string, data: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
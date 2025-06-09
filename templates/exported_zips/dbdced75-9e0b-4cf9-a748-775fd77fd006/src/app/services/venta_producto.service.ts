import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Venta_Producto } from '../models/venta_producto.model';

@Injectable({
  providedIn: 'root'
})
export class Venta_ProductoService {
  private storageKey = 'venta_productos';

  constructor() {}

  getAll(): Observable<Venta_Producto[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Venta_Producto> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Venta_Producto);
  }

  create(data: Venta_Producto): Observable<Venta_Producto> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Venta_Producto): Observable<Venta_Producto> {
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
  private getLocalItems(): Venta_Producto[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Venta_Producto[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/venta_productos'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Venta_Producto[]> {
    return this.http.get<Venta_Producto[]>(this.baseUrl);
  }

  getById(id: string): Observable<Venta_Producto> {
    return this.http.get<Venta_Producto>(`${this.baseUrl}/${id}`);
  }

  create(data: Venta_Producto): Observable<Venta_Producto> {
    return this.http.post<Venta_Producto>(this.baseUrl, data);
  }

  update(id: string, data: Venta_Producto): Observable<Venta_Producto> {
    return this.http.put<Venta_Producto>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
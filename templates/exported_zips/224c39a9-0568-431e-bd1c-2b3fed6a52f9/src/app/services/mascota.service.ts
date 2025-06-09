import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Mascota } from '../models/mascota.model';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private storageKey = 'mascotas';

  constructor() {}

  getAll(): Observable<Mascota[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Mascota> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Mascota);
  }

  create(data: Mascota): Observable<Mascota> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Mascota): Observable<Mascota> {
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
  private getLocalItems(): Mascota[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Mascota[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/mascotas'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.baseUrl);
  }

  getById(id: string): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.baseUrl}/${id}`);
  }

  create(data: Mascota): Observable<Mascota> {
    return this.http.post<Mascota>(this.baseUrl, data);
  }

  update(id: string, data: Mascota): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
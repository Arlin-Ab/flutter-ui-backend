import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Class3 } from '../models/class3.model';

@Injectable({
  providedIn: 'root'
})
export class Class3Service {
  private storageKey = 'class3s';

  constructor() {}

  getAll(): Observable<Class3[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Class3> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Class3);
  }

  create(data: Class3): Observable<Class3> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Class3): Observable<Class3> {
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
  private getLocalItems(): Class3[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Class3[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/class3s'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Class3[]> {
    return this.http.get<Class3[]>(this.baseUrl);
  }

  getById(id: string): Observable<Class3> {
    return this.http.get<Class3>(`${this.baseUrl}/${id}`);
  }

  create(data: Class3): Observable<Class3> {
    return this.http.post<Class3>(this.baseUrl, data);
  }

  update(id: string, data: Class3): Observable<Class3> {
    return this.http.put<Class3>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
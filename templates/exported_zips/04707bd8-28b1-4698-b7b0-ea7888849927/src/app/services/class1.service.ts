import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Class1 } from '../models/class1.model';

@Injectable({
  providedIn: 'root'
})
export class Class1Service {
  private storageKey = 'class1s';

  constructor() {}

  getAll(): Observable<Class1[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Class1> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Class1);
  }

  create(data: Class1): Observable<Class1> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Class1): Observable<Class1> {
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
  private getLocalItems(): Class1[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Class1[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/class1s'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Class1[]> {
    return this.http.get<Class1[]>(this.baseUrl);
  }

  getById(id: string): Observable<Class1> {
    return this.http.get<Class1>(`${this.baseUrl}/${id}`);
  }

  create(data: Class1): Observable<Class1> {
    return this.http.post<Class1>(this.baseUrl, data);
  }

  update(id: string, data: Class1): Observable<Class1> {
    return this.http.put<Class1>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
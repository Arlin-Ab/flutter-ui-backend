import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Class2 } from '../models/class2.model';

@Injectable({
  providedIn: 'root'
})
export class Class2Service {
  private storageKey = 'class2s';

  constructor() {}

  getAll(): Observable<Class2[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Class2> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Class2);
  }

  create(data: Class2): Observable<Class2> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Class2): Observable<Class2> {
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
  private getLocalItems(): Class2[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Class2[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/class2s'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Class2[]> {
    return this.http.get<Class2[]>(this.baseUrl);
  }

  getById(id: string): Observable<Class2> {
    return this.http.get<Class2>(`${this.baseUrl}/${id}`);
  }

  create(data: Class2): Observable<Class2> {
    return this.http.post<Class2>(this.baseUrl, data);
  }

  update(id: string, data: Class2): Observable<Class2> {
    return this.http.put<Class2>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private storageKey = 'users';

  constructor() {}

  getAll(): Observable<User[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<User> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as User);
  }

  create(data: User): Observable<User> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: User): Observable<User> {
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
  private getLocalItems(): User[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: User[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/users'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }

  create(data: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, data);
  }

  update(id: string, data: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
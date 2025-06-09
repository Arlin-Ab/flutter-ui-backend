import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private storageKey = 'usuarios';

  constructor() {}

  getAll(): Observable<Usuario[]> {
    const stored = localStorage.getItem(this.storageKey);
    return of(stored ? JSON.parse(stored) : []);
  }

  getById(id: string): Observable<Usuario> {
    const items = this.getLocalItems();
    const found = items.find(i => i.id === id);
    return of(found as Usuario);
  }

  create(data: Usuario): Observable<Usuario> {
    const items = this.getLocalItems();
    const newItem = { ...data, id: this.generateId() };
    items.push(newItem);
    this.saveLocalItems(items);
    return of(newItem);
  }

  update(id: string, data: Usuario): Observable<Usuario> {
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
  private getLocalItems(): Usuario[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveLocalItems(items: Usuario[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private generateId(): string {
    return crypto.randomUUID();
  }

  /*
  // Versión original con backend:
  private baseUrl = 'http://localhost:3000/usuarios'; // Ajusta la URL según backend

  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  getById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  create(data: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, data);
  }

  update(id: string, data: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  */
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mascota } from '../models/mascota.model';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
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
}

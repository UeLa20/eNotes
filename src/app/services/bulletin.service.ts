
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bulletin } from '../models/bulletin.model';

@Injectable({ providedIn: 'root' })
export class BulletinService {
    private apiUrl = 'http://localhost:8080/api/bulletins';

    constructor(private http: HttpClient) { }

    getAllBulletins(): Observable<Bulletin[]> {
        return this.http.get<Bulletin[]>(this.apiUrl);
    }

    getBulletinById(id: number): Observable<Bulletin> {
        return this.http.get<Bulletin>(`${this.apiUrl}/${id}`);
    }

    getBulletinByEtudiant(etudiantId: number): Observable<Bulletin> {
        return this.http.get<Bulletin>(`${this.apiUrl}/etudiant/${etudiantId}`);
    }

    createBulletin(bulletin: Bulletin): Observable<Bulletin> {
        return this.http.post<Bulletin>(this.apiUrl, bulletin);
    }

    updateBulletin(id: number, bulletin: Bulletin): Observable<Bulletin> {
        return this.http.put<Bulletin>(`${this.apiUrl}/${id}`, bulletin);
    }

    deleteBulletin(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

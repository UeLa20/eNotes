
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
    private apiUrl = 'http://localhost:8080/api/utilisateurs';

    constructor(private http: HttpClient) { }

    getAllUtilisateurs(): Observable<Utilisateur[]> {
        return this.http.get<Utilisateur[]>(this.apiUrl);
    }

    getUtilisateurById(id: number): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(`${this.apiUrl}/${id}`);
    }

    createUtilisateur(payload: any): Observable<Utilisateur> {
        return this.http.post<Utilisateur>(this.apiUrl, payload);
    }

    updateUtilisateur(id: number, payload: any): Observable<Utilisateur> {
        return this.http.put<Utilisateur>(`${this.apiUrl}/${id}`, payload);
    }

    deleteUtilisateur(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }

    getUtilisateurByEmail(email: string): Observable<Utilisateur> {
        return this.http.get<Utilisateur>(`${this.apiUrl}/email/${email}`);
    }
}

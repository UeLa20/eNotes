
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Utilisateur } from '../models/utilisateur.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/auth';

    private _currentUser = signal<Utilisateur | null>(null);
    public currentUser = this._currentUser.asReadonly();

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            this._currentUser.set(JSON.parse(storedUser));
        }
    }

    login(email: string, motDePasse: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, motDePasse }).pipe(
            tap(response => {
                this._currentUser.set(response.utilisateur);
                localStorage.setItem('currentUser', JSON.stringify(response.utilisateur));
            })
        );
    }

    logout() {
        this._currentUser.set(null);
        localStorage.removeItem('currentUser');
    }

    isLoggedIn(): boolean {
        return this._currentUser() !== null;
    }

    getUserRole(): string | undefined {
        return this._currentUser()?.role;
    }

    getCurrentUser(): Utilisateur | null {
        return this._currentUser();
    }
}

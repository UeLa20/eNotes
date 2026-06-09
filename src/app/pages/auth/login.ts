
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        PasswordModule,
        FormsModule,
        RouterModule,
        ToastModule,
        CardModule
    ],
    providers: [MessageService],
    styles: [`
        .login-wrapper {
            min-height: 100vh;
            display: flex;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        }

        .form-panel {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 2rem;
            flex: 1;
        }

        .form-card {
            width: 100%;
            max-width: 500px;
            border-radius: 1.5rem !important;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
        }

        .image-panel {
            display: none;
            flex: 1;
            position: relative;
        }

        @media (min-width: 1024px) {
            .image-panel {
                display: block;
            }
        }

        .full-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .image-overlay-text {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 3rem;
            background: linear-gradient(transparent, rgba(15, 23, 42, 0.9));
            color: white;
        }

        .logo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 2rem;
        }

        .logo-icon {
            width: 4rem;
            height: 4rem;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border-radius: 1.25rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
        }

        .welcome-text h2 {
            font-size: 1.75rem;
            font-weight: 700;
            color: #0f172a;
            margin: 0;
        }

        .welcome-text p {
            color: #64748b;
            margin: 0.5rem 0 0 0;
        }

        /* Professional input styling */
        ::ng-deep .form-field {
            width: 100%;
            margin-bottom: 1.5rem;
        }

        ::ng-deep .p-inputtext,
        ::ng-deep .p-password {
            width: 100% !important;
        }

        ::ng-deep .p-inputtext,
        ::ng-deep .p-password .p-inputtext {
            width: 100% !important;
            padding: 1rem 1.25rem !important;
            font-size: 1rem !important;
            border-radius: 0.75rem !important;
            border: 2px solid #e2e8f0 !important;
            background-color: white !important;
            transition: all 0.2s ease !important;
        }

        ::ng-deep .p-inputtext:focus,
        ::ng-deep .p-password .p-inputtext:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
            outline: none !important;
        }

        ::ng-deep .p-password {
            display: block;
        }

        ::ng-deep .p-button {
            width: 100%;
            padding: 1rem 1.5rem !important;
            font-size: 1rem !important;
            font-weight: 600 !important;
            border-radius: 0.75rem !important;
            background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
            border: none !important;
            box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3) !important;
        }

        ::ng-deep .p-button:hover {
            background: linear-gradient(135deg, #2563eb, #7c3aed) !important;
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4) !important;
        }

        ::ng-deep .p-checkbox .p-checkbox-box {
            border-radius: 0.375rem !important;
            border-color: #e2e8f0 !important;
        }

        ::ng-deep .p-checkbox .p-checkbox-box.p-highlight {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
            border-color: #3b82f6 !important;
        }

        .form-label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #475569;
            margin-bottom: 0.5rem;
        }
    `],
    template: `
        <div class="login-wrapper">
            <!-- Left Side - Professional Form -->
            <div class="form-panel">
                <p-card class="form-card">
                    <div class="logo-container">
                        <div class="logo-icon">
                            <i class="pi pi-graduation-cap text-3xl text-white"></i>
                        </div>
                    </div>

                    <div class="welcome-text text-center mb-8">
                        <h2>Bon retour !</h2>
                        <p>Connectez-vous à votre compte eNote</p>
                    </div>

                    <form (ngSubmit)="onLogin()" class="space-y-6">
                        <!-- Email -->
                        <div class="form-field">
                            <label class="form-label" for="email">Adresse email</label>
                            <input 
                                pInputText 
                                id="email" 
                                type="email" 
                                [(ngModel)]="email" 
                                name="email"
                                placeholder="ex: vous@email.com"
                            />
                        </div>

                        <!-- Password -->
                        <div class="form-field">
                            <label class="form-label" for="password">Mot de passe</label>
                            <p-password 
                                id="password" 
                                [(ngModel)]="password" 
                                name="password"
                                placeholder="Entrez votre mot de passe"
                                [toggleMask]="true" 
                                [feedback]="false"
                            />
                        </div>

                        <!-- Remember & Forgot -->
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center gap-2">
                                <p-checkbox 
                                    [(ngModel)]="rememberMe" 
                                    name="rememberMe" 
                                    inputId="remember"
                                    [binary]="true"
                                />
                                <label for="remember" class="text-sm font-medium text-slate-600 cursor-pointer">
                                    Se souvenir de moi
                                </label>
                            </div>
                            <a class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                Mot de passe oublié ?
                            </a>
                        </div>

                        <!-- Submit Button -->
                        <p-button 
                            label="Se connecter" 
                            type="submit"
                            icon="pi pi-arrow-right"
                            iconPos="right"
                        />
                    </form>

                    <div class="mt-8 text-center">
                        <span class="text-slate-600">Pas encore de compte ?</span>
                        <a class="ml-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">
                            Créer un compte
                        </a>
                    </div>
                </p-card>
            </div>

            <!-- Right Side - Image -->
            <div class="image-panel">
                <img 
                    src="demo/images/galleria/students.webp" 
                    alt="Gestion des notes" 
                    class="full-image"
                />
                <div class="image-overlay-text">
                    <h3 class="text-3xl font-bold mb-3">Gestion des Notes Simplifiée</h3>
                    <p class="text-lg text-slate-200 mb-0">
                        Gérez vos notes, bulletins et performances avec une plateforme moderne et intuitive.
                    </p>
                </div>
            </div>
        </div>

        <p-toast position="top-right" />
    `
})
export class Login {
    email: string = '';
    password: string = '';
    rememberMe: boolean = false;

    constructor(private authService: AuthService, private router: Router, private messageService: MessageService) { }

    onLogin() {
        if (!this.email || !this.password) {
            this.messageService.add({ 
                severity: 'warn', 
                summary: 'Champs incomplets', 
                detail: 'Veuillez saisir votre email et votre mot de passe' 
            });
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: (response) => {
                this.messageService.add({ 
                    severity: 'success', 
                    summary: 'Connexion réussie', 
                    detail: `Bienvenue !` 
                });
                setTimeout(() => {
                    this.router.navigate(['/']);
                }, 1200);
            },
            error: (error) => {
                this.messageService.add({ 
                    severity: 'error', 
                    summary: 'Erreur de connexion', 
                    detail: error.error.message || 'Identifiants incorrects' 
                });
            }
        });
    }
}

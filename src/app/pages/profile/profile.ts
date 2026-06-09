
import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CardModule, AvatarModule, ButtonModule, TagModule, CommonModule],
    template: `
        <div class="flex justify-content-center align-items-start pt-8">
            <div class="w-full max-w-4xl">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <!-- Profile Card -->
                    <div class="lg:col-span-1">
                        <p-card class="h-full">
                            <div class="flex flex-col align-items-center text-center">
                                <div class="mb-4">
                                    <p-avatar size="xlarge" shape="circle" styleClass="bg-primary">
                                        {{ authService.currentUser()?.nom?.charAt(0) }}{{ authService.currentUser()?.prenom?.charAt(0) }}
                                    </p-avatar>
                                </div>
                                <h3 class="text-2xl font-bold mb-1">{{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }}</h3>
                                <p-tag [value]="getRoleLabel()" [severity]="getRoleSeverity()"></p-tag>
                            </div>
                        </p-card>
                    </div>

                    <!-- Info Cards -->
                    <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <p-card header="Informations générales">
                            <div class="flex flex-col gap-3">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-user text-xl text-gray-500"></i>
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-500">Nom complet</span>
                                        <span class="font-medium">{{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }}</span>
                                    </div>
                                </div>
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-envelope text-xl text-gray-500"></i>
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-500">Email</span>
                                        <span class="font-medium">{{ authService.currentUser()?.email }}</span>
                                    </div>
                                </div>
                            </div>
                        </p-card>

                        <p-card header="Compte">
                            <div class="flex flex-col gap-3">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-shield text-xl text-gray-500"></i>
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-500">Rôle</span>
                                        <span class="font-medium">{{ getRoleLabel() }}</span>
                                    </div>
                                </div>
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-check-circle text-xl text-blue-900"></i>
                                    <div class="flex flex-col">
                                        <span class="text-sm text-gray-500">Statut</span>
                                        <span class="font-medium text-blue-900">Actif</span>
                                    </div>
                                </div>
                            </div>
                        </p-card>

                        <div class="md:col-span-2">
                            <p-card header="Activité">
                                <div class="flex align-items-center gap-3">
                                    <i class="pi pi-calendar text-xl text-gray-500"></i>
                                    <span class="text-gray-600">Dernière connexion: Aujourd'hui</span>
                                </div>
                            </p-card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Profile {
    authService = inject(AuthService);

    getRoleLabel(): string {
        const role = this.authService.getUserRole();
        const labels: Record<string, string> = {
            'ADMIN': 'Administrateur',
            'ENSEIGNANT': 'Enseignant',
            'ETUDIANT': 'Étudiant'
        };
        return labels[role || ''] || 'Utilisateur';
    }

    getRoleSeverity(): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        const role = this.authService.getUserRole();
        const severities: Record<string, any> = {
            'ADMIN': 'danger',
            'ENSEIGNANT': 'info',
            'ETUDIANT': 'success'
        };
        return severities[role || ''] || 'secondary';
    }
}


import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Enseignant } from '../../models/enseignant.model';
import { EnseignantService } from '../../services/enseignant.service';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-enseignants',
    standalone: true,
    imports: [TableModule, ButtonModule, ConfirmDialogModule, ToastModule, CardModule, ToolbarModule, RouterModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card">
            @if (isAdmin()) {
                <p-toolbar styleClass="mb-4">
                    <ng-template pTemplate="left">
                        <p-button label="Ajouter un Enseignant" icon="pi pi-plus" routerLink="/enseignants/new" severity="primary" />
                    </ng-template>
                </p-toolbar>
            }

            <p-table [value]="enseignants()" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        @if (isAdmin()) {
                            <th>Actions</th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-enseignant>
                    <tr>
                        <td>{{ enseignant.nom }}</td>
                        <td>{{ enseignant.prenom }}</td>
                        <td>{{ enseignant.email }}</td>
                        @if (isAdmin()) {
                            <td>
                                <p-button icon="pi pi-pencil" rounded [routerLink]="['/enseignants', enseignant.idUtilisateur, 'edit']" class="mr-2" />
                                <p-button icon="pi pi-trash" rounded severity="danger" (click)="deleteEnseignant(enseignant)" />
                            </td>
                        }
                    </tr>
                </ng-template>
            </p-table>
        </div>

        <p-confirmDialog />
        <p-toast />
    `
})
export class Enseignants implements OnInit {
    enseignants = signal<Enseignant[]>([]);

    constructor(
        private enseignantService: EnseignantService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private router: Router
    ) { }

    isAdmin(): boolean {
        return this.authService.getUserRole() === 'ADMIN';
    }

    ngOnInit() {
        this.loadEnseignants();
    }

    loadEnseignants() {
        this.enseignantService.getAllEnseignants().subscribe(data => {
            this.enseignants.set(data);
        });
    }

    deleteEnseignant(enseignant: Enseignant) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cet enseignant ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                if (enseignant.idUtilisateur) {
                    this.enseignantService.deleteEnseignant(enseignant.idUtilisateur).subscribe(() => {
                        this.loadEnseignants();
                        this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Enseignant supprimé' });
                    });
                }
            }
        });
    }
}

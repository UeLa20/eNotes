
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Classe } from '../../models/classe.model';
import { ClasseService } from '../../services/classe.service';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-classes',
    standalone: true,
    imports: [TableModule, ButtonModule, ConfirmDialogModule, ToastModule, CardModule, ToolbarModule, RouterModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card">
            @if (isAdmin()) {
                <p-toolbar styleClass="mb-4">
                    <ng-template pTemplate="left">
                        <p-button label="Ajouter une Classe" icon="pi pi-plus" routerLink="/classes/new" severity="primary" />
                    </ng-template>
                </p-toolbar>
            }

            <p-table [value]="classes()" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nom</th>
                        <th>Promotion</th>
                        @if (isAdmin()) {
                            <th>Actions</th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-classe>
                    <tr>
                        <td>{{ classe.nom }}</td>
                        <td>{{ classe.promotion }}</td>
                        @if (isAdmin()) {
                            <td>
                                <p-button icon="pi pi-pencil" rounded [routerLink]="['/classes', classe.idClasse, 'edit']" class="mr-2" />
                                <p-button icon="pi pi-trash" rounded severity="danger" (click)="deleteClasse(classe)" />
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
export class Classes implements OnInit {
    classes = signal<Classe[]>([]);

    constructor(
        private classeService: ClasseService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private router: Router
    ) { }

    isAdmin(): boolean {
        return this.authService.getUserRole() === 'ADMIN';
    }

    ngOnInit() {
        this.loadClasses();
    }

    loadClasses() {
        this.classeService.getAllClasses().subscribe(data => {
            this.classes.set(data);
        });
    }

    deleteClasse(classe: Classe) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cette classe ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                console.log('Suppression de la classe:', classe);
                if (classe.idClasse) {
                    this.classeService.deleteClasse(classe.idClasse).subscribe({
                        next: () => {
                            this.loadClasses();
                            this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Classe supprimée' });
                        },
                        error: (err) => {
                            console.error('Erreur lors de la suppression:', err);
                            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de supprimer la classe' });
                        }
                    });
                } else {
                    console.error('Aucun idClasse trouvé pour la classe:', classe);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'ID de classe introuvable' });
                }
            }
        });
    }
}


import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Etudiant } from '../../models/etudiant.model';
import { Classe } from '../../models/classe.model';
import { EtudiantService } from '../../services/etudiant.service';
import { ClasseService } from '../../services/classe.service';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-etudiants',
    standalone: true,
    imports: [TableModule, ButtonModule, ConfirmDialogModule, ToastModule, CardModule, ToolbarModule, RouterModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card">
            @if (isAdmin()) {
                <p-toolbar styleClass="mb-4">
                    <ng-template pTemplate="left">
                        <p-button label="Ajouter un Étudiant" icon="pi pi-plus" routerLink="/etudiants/new" severity="primary" />
                    </ng-template>
                </p-toolbar>
            }

            <p-table [value]="etudiants()" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Classe</th>
                        @if (isAdmin()) {
                            <th>Actions</th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-etudiant>
                    <tr>
                        <td>{{ etudiant.nom }}</td>
                        <td>{{ etudiant.prenom }}</td>
                        <td>{{ etudiant.email }}</td>
                        <td>{{ etudiant.classe?.nom }}</td>
                        @if (isAdmin()) {
                            <td>
                                <p-button icon="pi pi-pencil" rounded [routerLink]="['/etudiants', etudiant.idUtilisateur, 'edit']" class="mr-2" />
                                <p-button icon="pi pi-trash" rounded severity="danger" (click)="deleteEtudiant(etudiant)" />
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
export class Etudiants implements OnInit {
    etudiants = signal<Etudiant[]>([]);
    classes = signal<Classe[]>([]);

    constructor(
        private etudiantService: EtudiantService,
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
        this.loadEtudiants();
        this.loadClasses();
    }

    loadEtudiants() {
        this.etudiantService.getAllEtudiants().subscribe(data => {
            this.etudiants.set(data);
        });
    }

    loadClasses() {
        this.classeService.getAllClasses().subscribe(data => {
            this.classes.set(data);
        });
    }

    deleteEtudiant(etudiant: Etudiant) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cet étudiant ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                if (etudiant.idUtilisateur) {
                    this.etudiantService.deleteEtudiant(etudiant.idUtilisateur).subscribe(() => {
                        this.loadEtudiants();
                        this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Étudiant supprimé' });
                    });
                }
            }
        });
    }
}

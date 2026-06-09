
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Matiere } from '../../models/matiere.model';
import { Enseignant } from '../../models/enseignant.model';
import { Classe } from '../../models/classe.model';
import { MatiereService } from '../../services/matiere.service';
import { EnseignantService } from '../../services/enseignant.service';
import { ClasseService } from '../../services/classe.service';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-matieres',
    standalone: true,
    imports: [TableModule, ButtonModule, ConfirmDialogModule, ToastModule, CardModule, ToolbarModule, RouterModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card">
            @if (isAdmin()) {
                <p-toolbar styleClass="mb-4">
                    <ng-template pTemplate="left">
                        <p-button label="Ajouter une Matière" icon="pi pi-plus" routerLink="/matieres/new" severity="primary" />
                    </ng-template>
                </p-toolbar>
            }

            <p-table [value]="matieres()" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Nom</th>
                        <th>Description</th>
                        <th>Enseignant</th>
                        <th>Classe</th>
                        @if (isAdmin()) {
                            <th>Actions</th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-matiere>
                    <tr>
                        <td>{{ matiere.nom }}</td>
                        <td>{{ matiere.description }}</td>
                        <td>{{ matiere.enseignant?.nom }} {{ matiere.enseignant?.prenom }}</td>
                        <td>{{ matiere.classe?.nom }}</td>
                        @if (isAdmin()) {
                            <td>
                                <p-button icon="pi pi-pencil" rounded [routerLink]="['/matieres', matiere.idMatiere, 'edit']" class="mr-2" />
                                <p-button icon="pi pi-trash" rounded severity="danger" (click)="deleteMatiere(matiere)" />
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
export class Matieres implements OnInit {
    matieres = signal<Matiere[]>([]);
    enseignants = signal<Enseignant[]>([]);
    classes = signal<Classe[]>([]);

    constructor(
        private matiereService: MatiereService,
        private enseignantService: EnseignantService,
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
        this.loadMatieres();
        this.loadEnseignants();
        this.loadClasses();
    }

    loadMatieres() {
        this.matiereService.getAllMatieres().subscribe(data => {
            this.matieres.set(data);
        });
    }

    loadEnseignants() {
        this.enseignantService.getAllEnseignants().subscribe(data => {
            this.enseignants.set(data);
        });
    }

    loadClasses() {
        this.classeService.getAllClasses().subscribe(data => {
            this.classes.set(data);
        });
    }

    deleteMatiere(matiere: Matiere) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cette matière ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                if (matiere.idMatiere) {
                    this.matiereService.deleteMatiere(matiere.idMatiere).subscribe(() => {
                        this.loadMatieres();
                        this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Matière supprimée' });
                    });
                }
            }
        });
    }
}

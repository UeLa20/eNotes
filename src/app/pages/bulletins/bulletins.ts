
import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Bulletin } from '../../models/bulletin.model';
import { Etudiant } from '../../models/etudiant.model';
import { BulletinService } from '../../services/bulletin.service';
import { EtudiantService } from '../../services/etudiant.service';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { AuthService } from '../../services/auth.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
    selector: 'app-bulletins',
    standalone: true,
    imports: [TableModule, ButtonModule, ConfirmDialogModule, ToastModule, CardModule, ToolbarModule, RouterModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card">
            @if (isAdmin()) {
                <p-toolbar styleClass="mb-4">
                    <ng-template pTemplate="left">
                        <p-button label="Ajouter un Bulletin" icon="pi pi-plus" routerLink="/bulletins/new" severity="primary" />
                    </ng-template>
                </p-toolbar>
            }

            <p-table [value]="bulletins()" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Étudiant</th>
                        <th>Moyenne Générale</th>
                        <th>Mention</th>
                        <th>Télécharger</th>
                        @if (isAdmin()) {
                            <th>Actions</th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-bulletin>
                    <tr>
                        <td>{{ bulletin.etudiant?.nom }} {{ bulletin.etudiant?.prenom }}</td>
                        <td>{{ bulletin.moyenneGenerale }}</td>
                        <td>{{ bulletin.mention }}</td>
                        <td>
                            <p-button icon="pi pi-download" rounded severity="success" (click)="downloadPDF(bulletin)" />
                        </td>
                        @if (isAdmin()) {
                            <td>
                                <p-button icon="pi pi-pencil" rounded [routerLink]="['/bulletins', bulletin.idBulletin, 'edit']" class="mr-2" />
                                <p-button icon="pi pi-trash" rounded severity="danger" (click)="deleteBulletin(bulletin)" />
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
export class Bulletins implements OnInit {
    bulletins = signal<Bulletin[]>([]);
    etudiants = signal<Etudiant[]>([]);

    constructor(
        private bulletinService: BulletinService,
        private etudiantService: EtudiantService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private authService: AuthService,
        private router: Router
    ) { }

    isAdmin(): boolean {
        return this.authService.getUserRole() === 'ADMIN';
    }

    isTeacher(): boolean {
        return this.authService.getUserRole() === 'ENSEIGNANT';
    }

    isStudent(): boolean {
        return this.authService.getUserRole() === 'ETUDIANT';
    }

    ngOnInit() {
        this.loadBulletins();
        this.loadEtudiants();
    }

    loadBulletins() {
        const user = this.authService.getCurrentUser();
        if (this.isStudent() && user && user.idUtilisateur) {
            this.bulletinService.getBulletinByEtudiant(user.idUtilisateur).subscribe(data => {
                this.bulletins.set(data ? [data] : []);
            });
        } else {
            this.bulletinService.getAllBulletins().subscribe(data => {
                this.bulletins.set(data);
            });
        }
    }

    loadEtudiants() {
        this.etudiantService.getAllEtudiants().subscribe(data => {
            this.etudiants.set(data);
        });
    }

    deleteBulletin(bulletin: Bulletin) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer ce bulletin ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                if (bulletin.idBulletin) {
                    this.bulletinService.deleteBulletin(bulletin.idBulletin).subscribe(() => {
                        this.loadBulletins();
                        this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Bulletin supprimé' });
                    });
                }
            }
        });
    }

    downloadPDF(bulletin: Bulletin) {
        console.log('Bulletin à télécharger:', bulletin);
        const doc = new jsPDF();
        doc.setFontSize(24);
        doc.text('Bulletin de Notes', 14, 30);
        doc.setFontSize(14);
        doc.text(`Étudiant: ${bulletin.etudiant?.nom} ${bulletin.etudiant?.prenom}`, 14, 45);
        doc.text(`Classe: ${bulletin.etudiant?.classe?.nom || ''}`, 14, 60);
        doc.text(`Moyenne Générale: ${bulletin.moyenneGenerale}`, 14, 75);
        doc.text(`Mention: ${bulletin.mention}`, 14, 90);

        console.log('Notes:', bulletin.notes);

        if (bulletin.notes && bulletin.notes.length > 0) {
            const tableData = bulletin.notes.map(note => [
                note.matiere?.nom || '',
                note.matiere?.enseignant?.nom ? `${note.matiere.enseignant.nom} ${note.matiere.enseignant.prenom}` : '',
                note.valeur || '',
                note.dateSaisie || ''
            ]);
            autoTable(doc, {
                head: [['Matière', 'Enseignant', 'Note', 'Date']],
                body: tableData,
                startY: 105,
                headStyles: {
                    fillColor: [66, 139, 202]
                }
            });
        }

        doc.save(`bulletin_${bulletin.etudiant?.nom}_${bulletin.etudiant?.prenom}.pdf`);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Bulletin téléchargé' });
    }
}

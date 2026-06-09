

import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-notes',
    standalone: true,
    imports: [TableModule, ButtonModule, ToastModule, ConfirmDialogModule, CardModule, ToolbarModule],
    providers: [MessageService, ConfirmationService],
    template: `
        <div class="card">
            @if (isTeacher()) {
                <p-toolbar styleClass="mb-4">
                    <ng-template pTemplate="left">
                        <p-button label="Ajouter une Note" icon="pi pi-plus" (click)="openNew()" severity="primary" />
                    </ng-template>
                </p-toolbar>
            }

            <p-table [value]="notes()" [tableStyle]="{ 'min-width': '50rem' }" [paginator]="true" [rows]="5" [rowsPerPageOptions]="[5,10,20]">
                <ng-template pTemplate="header">
                    <tr>
                        <th>Valeur</th>
                        <th>Date Saisie</th>
                        @if (!isStudent()) {
                            <th>Étudiant</th>
                        }
                        <th>Matière</th>
                        @if (!isStudent()) {
                            <th>Enseignant</th>
                        }
                        @if (isTeacher()) {
                            <th>Actions</th>
                        }
                    </tr>
                </ng-template>
                <ng-template pTemplate="body" let-note>
                    <tr>
                        <td>{{ note.valeur }}</td>
                        <td>{{ note.dateSaisie }}</td>
                        @if (!isStudent()) {
                            <td>{{ note.etudiant?.nom }} {{ note.etudiant?.prenom }}</td>
                        }
                        <td>{{ note.matiere?.nom }}</td>
                        @if (!isStudent()) {
                            <td>{{ note.enseignant?.nom }} {{ note.enseignant?.prenom }}</td>
                        }
                        @if (isTeacher()) {
                            <td>
                                <p-button icon="pi pi-pencil" rounded (click)="editNote(note)" class="mr-2" />
                                <p-button icon="pi pi-trash" rounded severity="danger" (click)="deleteNote(note)" />
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
export class Notes implements OnInit {
    notes = signal<Note[]>([]);

    constructor(
        private noteService: NoteService,
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
        this.loadNotes();
    }

    loadNotes() {
        const user = this.authService.getCurrentUser();
        if (this.isStudent() && user && user.idUtilisateur) {
            this.noteService.getNotesByEtudiant(user.idUtilisateur).subscribe(data => {
                this.notes.set(data);
            });
        } else {
            this.noteService.getAllNotes().subscribe(data => {
                this.notes.set(data);
            });
        }
    }

    openNew() {
        this.router.navigate(['/notes/new']);
    }

    editNote(note: Note) {
        this.router.navigate(['/notes', note.idNote, 'edit']);
    }

    deleteNote(note: Note) {
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cette note ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                if (note.idNote) {
                    this.noteService.deleteNote(note.idNote).subscribe(() => {
                        this.loadNotes();
                        this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Note supprimée' });
                    });
                }
            }
        });
    }
}

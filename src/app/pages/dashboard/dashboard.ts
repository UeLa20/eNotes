
import { Component, OnInit, signal, effect } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { EtudiantService } from '../../services/etudiant.service';
import { EnseignantService } from '../../services/enseignant.service';
import { ClasseService } from '../../services/classe.service';
import { NoteService } from '../../services/note.service';
import { BulletinService } from '../../services/bulletin.service';
import { Etudiant } from '../../models/etudiant.model';
import { Enseignant } from '../../models/enseignant.model';
import { Classe } from '../../models/classe.model';
import { Note } from '../../models/note.model';
import { Bulletin } from '../../models/bulletin.model';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CardModule, ButtonModule, TableModule, CommonModule],
    template: `
        @if (isAdmin()) {
            <div class="grid grid-cols-12 gap-8">
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Étudiants</p>
                                <p class="text-4xl font-bold mt-2">{{ totalEtudiants() }}</p>
                            </div>
                            <div class="p-4 bg-blue-100 rounded-full">
                                <i class="pi pi-users text-3xl text-blue-600"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Enseignants</p>
                                <p class="text-4xl font-bold mt-2">{{ totalEnseignants() }}</p>
                            </div>
                            <div class="p-4 bg-blue-900/10 rounded-full">
                                <i class="pi pi-user text-3xl text-blue-900"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Classes</p>
                                <p class="text-4xl font-bold mt-2">{{ totalClasses() }}</p>
                            </div>
                            <div class="p-4 bg-yellow-100 rounded-full">
                                <i class="pi pi-building text-3xl text-yellow-600"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Notes</p>
                                <p class="text-4xl font-bold mt-2">{{ totalNotes() }}</p>
                            </div>
                            <div class="p-4 bg-purple-100 rounded-full">
                                <i class="pi pi-check text-3xl text-purple-600"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12 xl:col-span-6">
                    <p-card header="Derniers étudiants ajoutés" class="h-full">
                        <p-table [value]="recentEtudiants()" [tableStyle]="{ 'min-width': '100%' }">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Nom</th>
                                    <th>Prénom</th>
                                    <th>Email</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-etudiant>
                                <tr>
                                    <td>{{ etudiant.nom }}</td>
                                    <td>{{ etudiant.prenom }}</td>
                                    <td>{{ etudiant.email }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </div>

                <div class="col-span-12 xl:col-span-6">
                    <p-card header="Dernières notes saisies" class="h-full">
                        <p-table [value]="recentNotes()" [tableStyle]="{ 'min-width': '100%' }">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Valeur</th>
                                    <th>Étudiant</th>
                                    <th>Matière</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-note>
                                <tr>
                                    <td>{{ note.valeur }}</td>
                                    <td>{{ note.etudiant?.nom }} {{ note.etudiant?.prenom }}</td>
                                    <td>{{ note.matiere?.nom }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </div>
            </div>
        } @else if (isTeacher()) {
            <div class="grid grid-cols-12 gap-8">
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Notes</p>
                                <p class="text-4xl font-bold mt-2">{{ totalNotes() }}</p>
                            </div>
                            <div class="p-4 bg-purple-100 rounded-full">
                                <i class="pi pi-check text-3xl text-purple-600"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Bulletins</p>
                                <p class="text-4xl font-bold mt-2">{{ totalBulletins() }}</p>
                            </div>
                            <div class="p-4 bg-blue-900/10 rounded-full">
                                <i class="pi pi-file text-3xl text-blue-900"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12">
                    <p-card header="Dernières notes saisies" class="h-full">
                        <p-table [value]="recentNotes()" [tableStyle]="{ 'min-width': '100%' }">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Valeur</th>
                                    <th>Étudiant</th>
                                    <th>Matière</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-note>
                                <tr>
                                    <td>{{ note.valeur }}</td>
                                    <td>{{ note.etudiant?.nom }} {{ note.etudiant?.prenom }}</td>
                                    <td>{{ note.matiere?.nom }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </div>
            </div>
        } @else if (isStudent()) {
            <div class="grid grid-cols-12 gap-8">
                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Moyenne Générale</p>
                                <p class="text-4xl font-bold mt-2">{{ moyenneGenerale() }}</p>
                            </div>
                            <div class="p-4 bg-blue-100 rounded-full">
                                <i class="pi pi-chart-line text-3xl text-blue-600"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12 md:col-span-6 lg:col-span-3">
                    <p-card class="h-full">
                        <div class="flex justify-between items-center">
                            <div>
                                <p class="text-lg font-semibold text-gray-500">Mention</p>
                                <p class="text-4xl font-bold mt-2">{{ mention() }}</p>
                            </div>
                            <div class="p-4 bg-blue-900/10 rounded-full">
                                <i class="pi pi-award text-3xl text-blue-900"></i>
                            </div>
                        </div>
                    </p-card>
                </div>

                <div class="col-span-12">
                    <p-card header="Mes Notes" class="h-full">
                        <p-table [value]="studentNotes()" [tableStyle]="{ 'min-width': '100%' }">
                            <ng-template pTemplate="header">
                                <tr>
                                    <th>Valeur</th>
                                    <th>Matière</th>
                                    <th>Date Saisie</th>
                                </tr>
                            </ng-template>
                            <ng-template pTemplate="body" let-note>
                                <tr>
                                    <td>{{ note.valeur }}</td>
                                    <td>{{ note.matiere?.nom }}</td>
                                    <td>{{ note.dateSaisie }}</td>
                                </tr>
                            </ng-template>
                        </p-table>
                    </p-card>
                </div>
            </div>
        }
    `
})
export class Dashboard implements OnInit {
    totalEtudiants = signal<number>(0);
    totalEnseignants = signal<number>(0);
    totalClasses = signal<number>(0);
    totalNotes = signal<number>(0);
    totalBulletins = signal<number>(0);
    recentEtudiants = signal<Etudiant[]>([]);
    recentNotes = signal<Note[]>([]);
    studentNotes = signal<Note[]>([]);
    moyenneGenerale = signal<string>('-');
    mention = signal<string>('-');

    constructor(
        private etudiantService: EtudiantService,
        private enseignantService: EnseignantService,
        private classeService: ClasseService,
        private noteService: NoteService,
        private bulletinService: BulletinService,
        private authService: AuthService
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
        if (this.isAdmin()) {
            this.etudiantService.getAllEtudiants().subscribe(data => {
                this.totalEtudiants.set(data.length);
                this.recentEtudiants.set(data.slice(-5).reverse());
            });

            this.enseignantService.getAllEnseignants().subscribe(data => {
                this.totalEnseignants.set(data.length);
            });

            this.classeService.getAllClasses().subscribe(data => {
                this.totalClasses.set(data.length);
            });

            this.noteService.getAllNotes().subscribe(data => {
                this.totalNotes.set(data.length);
                this.recentNotes.set(data.slice(-5).reverse());
            });
        } else if (this.isTeacher()) {
            this.noteService.getAllNotes().subscribe(data => {
                this.totalNotes.set(data.length);
                this.recentNotes.set(data.slice(-5).reverse());
            });

            this.bulletinService.getAllBulletins().subscribe(data => {
                this.totalBulletins.set(data.length);
            });
        } else if (this.isStudent()) {
            const currentUser = this.authService.getCurrentUser();
            if (currentUser && currentUser.idUtilisateur) {
                this.noteService.getNotesByEtudiant(currentUser.idUtilisateur).subscribe(data => {
                    this.studentNotes.set(data);
                });

                this.noteService.getMoyenneByEtudiant(currentUser.idUtilisateur).subscribe(moyenne => {
                    this.moyenneGenerale.set(moyenne.toFixed(2));
                    this.mention.set(this.getMention(moyenne));
                });
            }
        }
    }

    getMention(moyenne: number): string {
        if (moyenne >= 16) return 'Très Bien';
        if (moyenne >= 14) return 'Bien';
        if (moyenne >= 12) return 'Assez Bien';
        if (moyenne >= 10) return 'Passable';
        return 'Insuffisant';
    }
}

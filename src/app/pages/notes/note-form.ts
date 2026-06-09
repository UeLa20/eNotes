
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Note } from '../../models/note.model';
import { Etudiant } from '../../models/etudiant.model';
import { Matiere } from '../../models/matiere.model';
import { Classe } from '../../models/classe.model';
import { Enseignant } from '../../models/enseignant.model';
import { NoteService } from '../../services/note.service';
import { EtudiantService } from '../../services/etudiant.service';
import { MatiereService } from '../../services/matiere.service';
import { ClasseService } from '../../services/classe.service';
import { EnseignantService } from '../../services/enseignant.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-note-form',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        DatePickerModule,
        FormsModule,
        SelectModule,
        ToastModule,
        CardModule,
        RouterModule
    ],
    providers: [MessageService],
    template: `
        <div class="flex justify-center items-center min-h-[80vh]">
            <p-card class="w-full max-w-4xl shadow-2xl">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-slate-800">
                        {{ isEdit ? 'Modifier la Note' : 'Ajouter une Note' }}
                    </h2>
                </div>

                <form (ngSubmit)="saveNote()" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="flex flex-col gap-2">
                        <label for="classe" class="font-semibold text-slate-700">Classe *</label>
                        <p-select 
                            id="classe" 
                            [options]="classes()" 
                            optionLabel="nom" 
                            optionValue="idClasse"
                            [(ngModel)]="selectedClasseId" 
                            name="classe"
                            placeholder="Sélectionner une classe"
                            [filter]="true"
                            styleClass="w-full"
                            (onChange)="onClasseChange()"
                        ></p-select>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="valeur" class="font-semibold text-slate-700">Valeur de la Note (0-20) *</label>
                        <p-inputNumber 
                            id="valeur" 
                            [(ngModel)]="note.valeur" 
                            name="valeur"
                            mode="decimal"
                            [min]="0"
                            [max]="20"
                            placeholder="0 - 20"
                            styleClass="w-full"
                        ></p-inputNumber>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="dateSaisie" class="font-semibold text-slate-700">Date de Saisie *</label>
                        <p-datepicker 
                            id="dateSaisie" 
                            [(ngModel)]="dateSaisie"
                            name="dateSaisie"
                            dateFormat="yy-mm-dd"
                            styleClass="w-full"
                        ></p-datepicker>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="etudiant" class="font-semibold text-slate-700">Étudiant *</label>
                        <p-select 
                            id="etudiant" 
                            [options]="filteredEtudiants()" 
                            optionLabel="nom" 
                            optionValue="idUtilisateur"
                            [(ngModel)]="selectedEtudiantId" 
                            name="etudiant"
                            placeholder="Sélectionner un étudiant"
                            [filter]="true"
                            styleClass="w-full"
                            [disabled]="!selectedClasseId"
                        ></p-select>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="matiere" class="font-semibold text-slate-700">Matière *</label>
                        <p-select 
                            id="matiere" 
                            [options]="filteredMatieres()" 
                            optionLabel="nom" 
                            optionValue="idMatiere"
                            [(ngModel)]="selectedMatiereId" 
                            name="matiere"
                            placeholder="Sélectionner une matière"
                            [filter]="true"
                            styleClass="w-full"
                            [disabled]="!selectedClasseId"
                            (onChange)="onMatiereChange()"
                        ></p-select>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="enseignant" class="font-semibold text-slate-700">Enseignant *</label>
                        <p-select 
                            id="enseignant" 
                            [options]="enseignants()" 
                            optionLabel="nom" 
                            optionValue="idUtilisateur"
                            [(ngModel)]="selectedEnseignantId" 
                            name="enseignant"
                            placeholder="Sélectionner un enseignant"
                            [filter]="true"
                            styleClass="w-full"
                        ></p-select>
                    </div>

                    <div class="md:col-span-2 flex justify-between gap-4 mt-6">
                        <p-button 
                            label="Annuler" 
                            icon="pi pi-arrow-left" 
                            routerLink="/notes" 
                            severity="secondary"
                            styleClass="flex-1"
                        ></p-button>
                        <p-button 
                            label="Sauvegarder" 
                            icon="pi pi-check" 
                            type="submit"
                            severity="primary"
                            styleClass="flex-1"
                        ></p-button>
                    </div>
                </form>
            </p-card>
        </div>

        <p-toast position="top-right"></p-toast>
    `
})
export class NoteForm implements OnInit {
    note: Note = { valeur: 0 };
    selectedClasseId?: number;
    selectedEtudiantId?: number;
    selectedMatiereId?: number;
    selectedEnseignantId?: number;
    dateSaisie?: Date;
    isEdit: boolean = false;
    idNote?: number;

    etudiants = signal<Etudiant[]>([]);
    matieres = signal<Matiere[]>([]);
    filteredEtudiants = signal<Etudiant[]>([]);
    filteredMatieres = signal<Matiere[]>([]);
    classes = signal<Classe[]>([]);
    enseignants = signal<Enseignant[]>([]);

    constructor(
        private noteService: NoteService,
        private etudiantService: EtudiantService,
        private matiereService: MatiereService,
        private classeService: ClasseService,
        private enseignantService: EnseignantService,
        private messageService: MessageService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadClasses();
        this.loadEnseignants();

        this.idNote = +this.route.snapshot.paramMap.get('id')!;
        if (this.idNote) {
            this.isEdit = true;
            this.loadNote(this.idNote);
        } else {
            this.dateSaisie = new Date();
        }
    }

    loadNote(id: number) {
        this.noteService.getNoteById(id).subscribe(note => {
            this.note = { ...note };
            this.selectedEtudiantId = note.etudiant?.idUtilisateur;
            this.selectedMatiereId = note.matiere?.idMatiere;
            this.selectedEnseignantId = note.enseignant?.idUtilisateur;
            
            if (note.etudiant?.classe?.idClasse) {
                this.selectedClasseId = note.etudiant.classe.idClasse;
                this.loadEtudiantsAndMatieresForClasse(this.selectedClasseId);
            } else if (note.matiere?.classe?.idClasse) {
                this.selectedClasseId = note.matiere.classe.idClasse;
                this.loadEtudiantsAndMatieresForClasse(this.selectedClasseId);
            }
            
            this.dateSaisie = note.dateSaisie ? new Date(note.dateSaisie) : new Date();
        });
    }

    loadClasses() {
        this.classeService.getAllClasses().subscribe(data => {
            this.classes.set(data);
        });
    }

    loadEnseignants() {
        this.enseignantService.getAllEnseignants().subscribe(data => {
            this.enseignants.set(data);
        });
    }

    loadEtudiantsAndMatieresForClasse(classeId: number) {
        this.etudiantService.getEtudiantsByClasse(classeId).subscribe(data => {
            this.filteredEtudiants.set(data);
        });

        this.matiereService.getMatieresByClasse(classeId).subscribe(data => {
            this.filteredMatieres.set(data);
        });
    }

    onClasseChange() {
        this.selectedEtudiantId = undefined;
        this.selectedMatiereId = undefined;
        this.selectedEnseignantId = undefined;
        
        if (this.selectedClasseId) {
            this.loadEtudiantsAndMatieresForClasse(this.selectedClasseId);
        } else {
            this.filteredEtudiants.set([]);
            this.filteredMatieres.set([]);
        }
    }

    onMatiereChange() {
        if (this.selectedMatiereId) {
            const matiere = this.filteredMatieres().find(m => m.idMatiere === this.selectedMatiereId);
            if (matiere && matiere.enseignant) {
                this.selectedEnseignantId = matiere.enseignant.idUtilisateur;
            }
        }
    }

    saveNote() {
        if (!this.dateSaisie) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez sélectionner une date' });
            return;
        }

        if (!this.selectedClasseId || !this.selectedEtudiantId || !this.selectedMatiereId || !this.selectedEnseignantId) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }

        this.note.etudiant = this.filteredEtudiants().find(e => e.idUtilisateur === this.selectedEtudiantId);
        this.note.matiere = this.filteredMatieres().find(m => m.idMatiere === this.selectedMatiereId);
        this.note.enseignant = this.enseignants().find(e => e.idUtilisateur === this.selectedEnseignantId);
        this.note.dateSaisie = this.dateSaisie.toISOString().split('T')[0];

        if (this.isEdit && this.idNote) {
            this.noteService.updateNote(this.idNote, this.note).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Note mise à jour' });
                this.router.navigate(['/notes']);
            });
        } else {
            this.noteService.createNote(this.note).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Note créée' });
                this.router.navigate(['/notes']);
            });
        }
    }
}

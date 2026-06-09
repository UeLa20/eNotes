
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Matiere } from '../../models/matiere.model';
import { Enseignant } from '../../models/enseignant.model';
import { Classe } from '../../models/classe.model';
import { MatiereService } from '../../services/matiere.service';
import { EnseignantService } from '../../services/enseignant.service';
import { ClasseService } from '../../services/classe.service';

@Component({
    selector: 'app-matiere-form',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        TextareaModule,
        FormsModule,
        SelectModule,
        ToastModule,
        CardModule,
        RouterModule
    ],
    providers: [MessageService],
    template: `
        <div class="flex justify-center items-center min-h-[80vh]">
            <p-card class="w-full max-w-2xl shadow-2xl">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-slate-800">
                        {{ isEdit ? 'Modifier la Matière' : 'Ajouter une Matière' }}
                    </h2>
                </div>

                <form (ngSubmit)="saveMatiere()" class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <label for="nom" class="font-semibold text-slate-700">Nom *</label>
                        <input pInputText id="nom" [(ngModel)]="matiere.nom" name="nom" placeholder="Nom" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="description" class="font-semibold text-slate-700">Description</label>
                        <textarea pTextarea id="description" [(ngModel)]="matiere.description" name="description" placeholder="Description" [rows]="3" class="w-full"></textarea>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="enseignant" class="font-semibold text-slate-700">Enseignant</label>
                        <p-select 
                            id="enseignant" 
                            [options]="enseignantOptions" 
                            optionLabel="nom" 
                            optionValue="idUtilisateur"
                            [(ngModel)]="selectedEnseignantId" 
                            name="enseignant"
                            placeholder="Aucun enseignant"
                            styleClass="w-full"
                        ></p-select>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="classe" class="font-semibold text-slate-700">Classe</label>
                        <p-select 
                            id="classe" 
                            [options]="classeOptions" 
                            optionLabel="nom" 
                            optionValue="idClasse"
                            [(ngModel)]="selectedClasseId" 
                            name="classe"
                            placeholder="Aucune classe"
                            styleClass="w-full"
                        ></p-select>
                    </div>

                    <div class="flex justify-between gap-4 mt-6">
                        <p-button 
                            label="Annuler" 
                            icon="pi pi-arrow-left" 
                            routerLink="/matieres" 
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
export class MatiereForm implements OnInit {
    matiere: Matiere = { nom: '', description: '' };
    enseignants = signal<Enseignant[]>([]);
    classes = signal<Classe[]>([]);
    enseignantOptions: any[] = [];
    classeOptions: any[] = [];
    selectedEnseignantId: number = -1;
    selectedClasseId: number = -1;
    isEdit: boolean = false;
    idMatiere?: number;

    constructor(
        private matiereService: MatiereService,
        private enseignantService: EnseignantService,
        private classeService: ClasseService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadEnseignants();
        this.loadClasses();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.idMatiere = +id;
            this.loadMatiere(this.idMatiere);
        }
    }

    loadEnseignants() {
        this.enseignantService.getAllEnseignants().subscribe(data => {
            this.enseignants.set(data);
            this.enseignantOptions = [{ idUtilisateur: -1, nom: 'Aucun enseignant' }, ...data];
        });
    }

    loadClasses() {
        this.classeService.getAllClasses().subscribe(data => {
            this.classes.set(data);
            this.classeOptions = [{ idClasse: -1, nom: 'Aucune classe' }, ...data];
        });
    }

    loadMatiere(id: number) {
        this.matiereService.getMatiereById(id).subscribe(matiere => {
            this.matiere = { ...matiere };
            this.selectedEnseignantId = matiere.enseignant?.idUtilisateur || -1;
            this.selectedClasseId = matiere.classe?.idClasse || -1;
        });
    }

    saveMatiere() {
        if (!this.matiere.nom) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }

        this.matiere.enseignant = this.selectedEnseignantId === -1 ? undefined : this.enseignants().find(e => e.idUtilisateur === this.selectedEnseignantId);
        this.matiere.classe = this.selectedClasseId === -1 ? undefined : this.classes().find(c => c.idClasse === this.selectedClasseId);

        if (this.isEdit && this.idMatiere) {
            this.matiereService.updateMatiere(this.idMatiere, this.matiere).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Matière mise à jour' });
                this.router.navigate(['/matieres']);
            });
        } else {
            this.matiereService.createMatiere(this.matiere).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Matière créée' });
                this.router.navigate(['/matieres']);
            });
        }
    }
}


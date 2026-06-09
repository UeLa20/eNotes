
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Etudiant } from '../../models/etudiant.model';
import { Classe } from '../../models/classe.model';
import { EtudiantService } from '../../services/etudiant.service';
import { ClasseService } from '../../services/classe.service';

@Component({
    selector: 'app-etudiant-form',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
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
                        {{ isEdit ? 'Modifier l\\'Étudiant' : 'Ajouter un Étudiant' }}
                    </h2>
                </div>

                <form (ngSubmit)="saveEtudiant()" class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <label for="nom" class="font-semibold text-slate-700">Nom *</label>
                        <input pInputText id="nom" [(ngModel)]="etudiant.nom" name="nom" placeholder="Nom" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="prenom" class="font-semibold text-slate-700">Prénom *</label>
                        <input pInputText id="prenom" [(ngModel)]="etudiant.prenom" name="prenom" placeholder="Prénom" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="email" class="font-semibold text-slate-700">Email *</label>
                        <input pInputText id="email" [(ngModel)]="etudiant.email" name="email" placeholder="Email" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="motDePasse" class="font-semibold text-slate-700">Mot de passe</label>
                        <input pInputText type="password" id="motDePasse" [(ngModel)]="etudiant.motDePasse" name="motDePasse" placeholder="Mot de passe" class="w-full">
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
                            routerLink="/etudiants" 
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
export class EtudiantForm implements OnInit {
    etudiant: Etudiant = { nom: '', prenom: '', email: '', role: 'ETUDIANT' };
    classes = signal<Classe[]>([]);
    classeOptions: any[] = [];
    selectedClasseId: number = -1;
    isEdit: boolean = false;
    idUtilisateur?: number;

    constructor(
        private etudiantService: EtudiantService,
        private classeService: ClasseService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadClasses();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.idUtilisateur = +id;
            this.loadEtudiant(this.idUtilisateur);
        }
    }

    loadClasses() {
        this.classeService.getAllClasses().subscribe(data => {
            this.classes.set(data);
            this.classeOptions = [{ idClasse: -1, nom: 'Aucune classe' }, ...data];
        });
    }

    loadEtudiant(id: number) {
        this.etudiantService.getEtudiantById(id).subscribe(etudiant => {
            this.etudiant = { ...etudiant };
            this.selectedClasseId = etudiant.classe?.idClasse || -1;
        });
    }

    saveEtudiant() {
        console.log('=== Sauvegarde étudiant ===');
        console.log('selectedClasseId:', this.selectedClasseId);
        console.log('Étudiant avant modification:', this.etudiant);
        
        if (!this.etudiant.nom || !this.etudiant.prenom || !this.etudiant.email) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }

        this.etudiant.classe = this.selectedClasseId === -1 ? null : this.classes().find(c => c.idClasse === this.selectedClasseId) as Classe;
        console.log('Étudiant après modification:', this.etudiant);

        if (this.isEdit && this.idUtilisateur) {
            console.log('Modification étudiant avec ID:', this.idUtilisateur);
            this.etudiantService.updateEtudiant(this.idUtilisateur, this.etudiant).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Étudiant mis à jour' });
                    this.router.navigate(['/etudiants']);
                },
                error: (err) => {
                    console.error('Erreur modification étudiant:', err);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de modifier l\'étudiant' });
                }
            });
        } else {
            console.log('Création étudiant');
            this.etudiantService.createEtudiant(this.etudiant).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Étudiant créé' });
                    this.router.navigate(['/etudiants']);
                },
                error: (err) => {
                    console.error('Erreur création étudiant:', err);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de créer l\'étudiant' });
                }
            });
        }
    }
}


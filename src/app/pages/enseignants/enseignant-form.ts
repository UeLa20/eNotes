
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Enseignant } from '../../models/enseignant.model';
import { EnseignantService } from '../../services/enseignant.service';

@Component({
    selector: 'app-enseignant-form',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        FormsModule,
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
                        {{ isEdit ? 'Modifier l\\'Enseignant' : 'Ajouter un Enseignant' }}
                    </h2>
                </div>

                <form (ngSubmit)="saveEnseignant()" class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <label for="nom" class="font-semibold text-slate-700">Nom *</label>
                        <input pInputText id="nom" [(ngModel)]="enseignant.nom" name="nom" placeholder="Nom" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="prenom" class="font-semibold text-slate-700">Prénom *</label>
                        <input pInputText id="prenom" [(ngModel)]="enseignant.prenom" name="prenom" placeholder="Prénom" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="email" class="font-semibold text-slate-700">Email *</label>
                        <input pInputText id="email" [(ngModel)]="enseignant.email" name="email" placeholder="Email" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="motDePasse" class="font-semibold text-slate-700">Mot de passe</label>
                        <input pInputText type="password" id="motDePasse" [(ngModel)]="enseignant.motDePasse" name="motDePasse" placeholder="Mot de passe" class="w-full">
                    </div>

                    <div class="flex justify-between gap-4 mt-6">
                        <p-button 
                            label="Annuler" 
                            icon="pi pi-arrow-left" 
                            routerLink="/enseignants" 
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
export class EnseignantForm implements OnInit {
    enseignant: Enseignant = { nom: '', prenom: '', email: '', role: 'ENSEIGNANT' };
    isEdit: boolean = false;
    idUtilisateur?: number;

    constructor(
        private enseignantService: EnseignantService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.idUtilisateur = +id;
            this.loadEnseignant(this.idUtilisateur);
        }
    }

    loadEnseignant(id: number) {
        this.enseignantService.getEnseignantById(id).subscribe(enseignant => {
            this.enseignant = { ...enseignant };
        });
    }

    saveEnseignant() {
        if (!this.enseignant.nom || !this.enseignant.prenom || !this.enseignant.email) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }

        if (this.isEdit && this.idUtilisateur) {
            this.enseignantService.updateEnseignant(this.idUtilisateur, this.enseignant).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Enseignant mis à jour' });
                this.router.navigate(['/enseignants']);
            });
        } else {
            this.enseignantService.createEnseignant(this.enseignant).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Enseignant créé' });
                this.router.navigate(['/enseignants']);
            });
        }
    }
}


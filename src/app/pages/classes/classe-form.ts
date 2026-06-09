
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Classe } from '../../models/classe.model';
import { ClasseService } from '../../services/classe.service';

@Component({
    selector: 'app-classe-form',
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
                        {{ isEdit ? 'Modifier la Classe' : 'Ajouter une Classe' }}
                    </h2>
                </div>

                <form (ngSubmit)="saveClasse()" class="flex flex-col gap-6">
                    <div class="flex flex-col gap-2">
                        <label for="nom" class="font-semibold text-slate-700">Nom *</label>
                        <input pInputText id="nom" [(ngModel)]="classe.nom" name="nom" placeholder="Nom" class="w-full">
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="promotion" class="font-semibold text-slate-700">Promotion *</label>
                        <input pInputText id="promotion" [(ngModel)]="classe.promotion" name="promotion" placeholder="Promotion" class="w-full">
                    </div>

                    <div class="flex justify-between gap-4 mt-6">
                        <p-button 
                            label="Annuler" 
                            icon="pi pi-arrow-left" 
                            routerLink="/classes" 
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
export class ClasseForm implements OnInit {
    classe: Classe = { nom: '', promotion: '' };
    isEdit: boolean = false;
    idClasse?: number;

    constructor(
        private classeService: ClasseService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.idClasse = +id;
            this.loadClasse(this.idClasse);
        }
    }

    loadClasse(id: number) {
        this.classeService.getClasseById(id).subscribe(classe => {
            this.classe = { ...classe };
        });
    }

    saveClasse() {
        if (!this.classe.nom || !this.classe.promotion) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs obligatoires' });
            return;
        }

        if (this.isEdit && this.idClasse) {
            this.classeService.updateClasse(this.idClasse, this.classe).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Classe mise à jour' });
                this.router.navigate(['/classes']);
            });
        } else {
            this.classeService.createClasse(this.classe).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Classe créée' });
                this.router.navigate(['/classes']);
            });
        }
    }
}



import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Bulletin } from '../../models/bulletin.model';
import { Etudiant } from '../../models/etudiant.model';
import { BulletinService } from '../../services/bulletin.service';
import { EtudiantService } from '../../services/etudiant.service';
import { NoteService } from '../../services/note.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-bulletin-form',
    standalone: true,
    imports: [
        ButtonModule,
        InputTextModule,
        InputNumberModule,
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
                        {{ isEdit ? 'Modifier le Bulletin' : 'Ajouter un Bulletin' }}
                    </h2>
                </div>

                <form (ngSubmit)="saveBulletin()" class="flex flex-col gap-6">
                    @if (isAdmin()) {
                        <div class="flex flex-col gap-2">
                            <label for="etudiant" class="font-semibold text-slate-700">Étudiant *</label>
                            <p-select 
                                id="etudiant" 
                                [options]="etudiants()" 
                                optionLabel="nom" 
                                optionValue="idUtilisateur"
                                [(ngModel)]="selectedEtudiantId" 
                                name="etudiant"
                                placeholder="Sélectionner un étudiant"
                                styleClass="w-full"
                                (onChange)="onEtudiantChange()"
                            ></p-select>
                        </div>
                    }

                    <div class="flex flex-col gap-2">
                        <label for="moyenneGenerale" class="font-semibold text-slate-700">Moyenne Générale</label>
                        <p-inputNumber 
                            id="moyenneGenerale" 
                            [(ngModel)]="bulletin.moyenneGenerale" 
                            name="moyenneGenerale"
                            mode="decimal"
                            readonly
                            styleClass="w-full"
                        ></p-inputNumber>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="mention" class="font-semibold text-slate-700">Mention</label>
                        <input pInputText id="mention" [(ngModel)]="bulletin.mention" name="mention" readonly class="w-full">
                    </div>

                    <div class="flex justify-between gap-4 mt-6">
                        <p-button 
                            label="Annuler" 
                            icon="pi pi-arrow-left" 
                            routerLink="/bulletins" 
                            severity="secondary"
                            styleClass="flex-1"
                        ></p-button>
                        @if (isAdmin()) {
                            <p-button 
                                label="Sauvegarder" 
                                icon="pi pi-check" 
                                type="submit"
                                severity="primary"
                                styleClass="flex-1"
                            ></p-button>
                        }
                    </div>
                </form>
            </p-card>
        </div>

        <p-toast position="top-right"></p-toast>
    `
})
export class BulletinForm implements OnInit {
    bulletin: Bulletin = {};
    etudiants = signal<Etudiant[]>([]);
    selectedEtudiantId?: number;
    isEdit: boolean = false;
    idBulletin?: number;

    constructor(
        private bulletinService: BulletinService,
        private etudiantService: EtudiantService,
        private noteService: NoteService,
        private messageService: MessageService,
        private authService: AuthService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    isAdmin(): boolean {
        return this.authService.getUserRole() === 'ADMIN';
    }

    ngOnInit() {
        this.loadEtudiants();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEdit = true;
            this.idBulletin = +id;
            this.loadBulletin(this.idBulletin);
        }
    }

    loadEtudiants() {
        this.etudiantService.getAllEtudiants().subscribe(data => {
            this.etudiants.set(data);
        });
    }

    loadBulletin(id: number) {
        this.bulletinService.getBulletinById(id).subscribe(bulletin => {
            this.bulletin = { ...bulletin };
            this.selectedEtudiantId = bulletin.etudiant?.idUtilisateur;
        });
    }

    onEtudiantChange() {
        if (this.selectedEtudiantId) {
            this.noteService.getMoyenneByEtudiant(this.selectedEtudiantId).subscribe(moyenne => {
                this.bulletin.moyenneGenerale = parseFloat(moyenne.toFixed(2));
                this.bulletin.mention = this.getMention(moyenne);
            });
        }
    }

    getMention(moyenne: number): string {
        if (moyenne >= 16) return 'Très Bien';
        if (moyenne >= 14) return 'Bien';
        if (moyenne >= 12) return 'Assez Bien';
        if (moyenne >= 10) return 'Passable';
        return 'Insuffisant';
    }

    saveBulletin() {
        if (!this.selectedEtudiantId) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez sélectionner un étudiant' });
            return;
        }

        this.bulletin.etudiant = this.etudiants().find(e => e.idUtilisateur === this.selectedEtudiantId);

        if (this.isEdit && this.idBulletin) {
            this.bulletinService.updateBulletin(this.idBulletin, this.bulletin).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Bulletin mis à jour' });
                this.router.navigate(['/bulletins']);
            });
        } else {
            this.bulletinService.createBulletin(this.bulletin).subscribe(() => {
                this.messageService.add({ severity: 'info', summary: 'Succès', detail: 'Bulletin créé' });
                this.router.navigate(['/bulletins']);
            });
        }
    }
}


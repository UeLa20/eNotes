
import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];
    private authService = inject(AuthService);

    constructor() {
        effect(() => {
            this.updateMenu();
        });
    }

    ngOnInit() {
        this.updateMenu();
    }

    private updateMenu() {
        const role = this.authService.getUserRole();

        const baseMenu: MenuItem[] = [
            {
                label: 'Accueil',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            }
        ];

        const gestionItems: MenuItem[] = [];

        if (role === 'ADMIN') {
            gestionItems.push(
                { label: 'Classes', icon: 'pi pi-fw pi-building', routerLink: ['/classes'] },
                { label: 'Étudiants', icon: 'pi pi-fw pi-users', routerLink: ['/etudiants'] },
                { label: 'Enseignants', icon: 'pi pi-fw pi-user', routerLink: ['/enseignants'] },
                { label: 'Matières', icon: 'pi pi-fw pi-book', routerLink: ['/matieres'] }
            );
        }

        if (role === 'ADMIN' || role === 'ENSEIGNANT') {
            gestionItems.push(
                { label: 'Notes', icon: 'pi pi-fw pi-check', routerLink: ['/notes'] }
            );
        }

        if (role === 'ADMIN') {
            gestionItems.push(
                { label: 'Bulletins', icon: 'pi pi-fw pi-file', routerLink: ['/bulletins'] }
            );
        }

        if (role === 'ETUDIANT') {
            gestionItems.push(
                { label: 'Notes', icon: 'pi pi-fw pi-check', routerLink: ['/notes'] },
                { label: 'Bulletins', icon: 'pi pi-fw pi-file', routerLink: ['/bulletins'] }
            );
        }

        if (gestionItems.length > 0) {
            baseMenu.push({
                label: 'Gestion',
                items: gestionItems
            });
        }

        this.model = baseMenu;
    }
}

import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Classes } from './app/pages/classes/classes';
import { ClasseForm } from './app/pages/classes/classe-form';
import { Etudiants } from './app/pages/etudiants/etudiants';
import { EtudiantForm } from './app/pages/etudiants/etudiant-form';
import { Enseignants } from './app/pages/enseignants/enseignants';
import { EnseignantForm } from './app/pages/enseignants/enseignant-form';
import { Matieres } from './app/pages/matieres/matieres';
import { MatiereForm } from './app/pages/matieres/matiere-form';
import { Notes } from './app/pages/notes/notes';
import { NoteForm } from './app/pages/notes/note-form';
import { Bulletins } from './app/pages/bulletins/bulletins';
import { BulletinForm } from './app/pages/bulletins/bulletin-form';
import { Profile } from './app/pages/profile/profile';
import { authGuard } from './app/guards/auth.guard';
import { roleGuard } from './app/guards/role.guard';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            { path: '', component: Dashboard },
            { path: 'profile', component: Profile },
            { path: 'classes', component: Classes },
            { path: 'classes/new', component: ClasseForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'classes/:id/edit', component: ClasseForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'etudiants', component: Etudiants },
            { path: 'etudiants/new', component: EtudiantForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'etudiants/:id/edit', component: EtudiantForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'enseignants', component: Enseignants },
            { path: 'enseignants/new', component: EnseignantForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'enseignants/:id/edit', component: EnseignantForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'matieres', component: Matieres },
            { path: 'matieres/new', component: MatiereForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'matieres/:id/edit', component: MatiereForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'notes', component: Notes },
            { path: 'notes/new', component: NoteForm, canActivate: [roleGuard(['ENSEIGNANT'])] },
            { path: 'notes/:id/edit', component: NoteForm, canActivate: [roleGuard(['ENSEIGNANT'])] },
            { path: 'bulletins', component: Bulletins, canActivate: [roleGuard(['ADMIN', 'ETUDIANT'])] },
            { path: 'bulletins/new', component: BulletinForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'bulletins/:id/edit', component: BulletinForm, canActivate: [roleGuard(['ADMIN'])] },
            { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

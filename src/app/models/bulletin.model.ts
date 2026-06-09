
import { Etudiant } from './etudiant.model';
import { Note } from './note.model';

export interface Bulletin {
  idBulletin?: number;
  moyenneGenerale?: number;
  mention?: string;
  etudiant?: Etudiant;
  notes?: Note[];
}

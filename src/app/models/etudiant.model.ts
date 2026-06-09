
import { Utilisateur } from './utilisateur.model';
import { Classe } from './classe.model';
import { Note } from './note.model';
import { Bulletin } from './bulletin.model';

export interface Etudiant extends Utilisateur {
  classe?: Classe | null;
  notes?: Note[];
  bulletin?: Bulletin;
}

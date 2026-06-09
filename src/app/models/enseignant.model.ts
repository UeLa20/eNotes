
import { Utilisateur } from './utilisateur.model';
import { Matiere } from './matiere.model';
import { Note } from './note.model';

export interface Enseignant extends Utilisateur {
  matieres?: Matiere[];
  notesSaisies?: Note[];
}


import { Etudiant } from './etudiant.model';
import { Matiere } from './matiere.model';
import { Enseignant } from './enseignant.model';

export interface Note {
  idNote?: number;
  valeur: number;
  dateSaisie?: string;
  etudiant?: Etudiant;
  matiere?: Matiere;
  enseignant?: Enseignant;
}

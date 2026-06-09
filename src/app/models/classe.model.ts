
import { Etudiant } from './etudiant.model';
import { Matiere } from './matiere.model';

export interface Classe {
  idClasse?: number;
  nom: string;
  promotion?: string;
  etudiants?: Etudiant[];
  matieres?: Matiere[];
}

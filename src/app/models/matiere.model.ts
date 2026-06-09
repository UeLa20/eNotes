
import { Enseignant } from './enseignant.model';
import { Classe } from './classe.model';
import { Note } from './note.model';

export interface Matiere {
  idMatiere?: number;
  nom: string;
  description?: string;
  enseignant?: Enseignant;
  classe?: Classe;
  notes?: Note[];
}

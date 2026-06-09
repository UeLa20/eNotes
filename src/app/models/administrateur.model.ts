
import { Utilisateur } from './utilisateur.model';

export interface Administrateur extends Utilisateur {
  privileges?: string;
}

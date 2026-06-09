
# Guide Utilisateur - eNotes

Bienvenue dans le guide officiel d'eNotes, votre outil de gestion de notes scolaires !

---

## 1. Connexion à l'application

Pour accéder à eNotes :
1. Ouvrez votre navigateur et allez sur `http://localhost:4200`
2. Connectez-vous avec vos identifiants :
   - **Admin** : `admin@enotes.com` / `admin123`
   - **Enseignant** : `jean.dupont@enotes.com` / `enseignant123`
   - **Étudiant** : `luc.martin@enotes.com` / `etudiant123`

---

## 2. Rôles et droits d'accès

eNotes propose 3 rôles avec des fonctionnalités différentes :

| Rôle | Fonctionnalités |
|------|-----------------|
| **Administrateur** | Gérer classes, étudiants, enseignants, matières, notes et bulletins |
| **Enseignant** | Voir classes, étudiants, matières et gérer les notes |
| **Étudiant** | Voir ses notes et son bulletin de notes, le télécharger en PDF |

---

## 3. Gestion des Classes (Administrateur seulement)

Pour gérer les classes :
1. Cliquez sur « Classes » dans le menu de gauche
2. **Ajouter une classe** : Cliquez sur « Ajouter une classe » et remplissez le formulaire
3. **Modifier une classe** : Cliquez sur l'icône crayon à côté de la classe
4. **Supprimer une classe** :
   - Cliquez sur l'icône poubelle
   - D'abord, retirez tous les étudiants de cette classe (voir §4)
   - Confirmez la suppression

---

## 4. Gestion des Étudiants (Administrateur seulement)

Pour gérer les étudiants :
1. Cliquez sur « Étudiants » dans le menu de gauche
2. **Ajouter un étudiant** :
   - Cliquez sur « Ajouter un étudiant »
   - Remplissez les champs obligatoires (nom, prénom, email)
   - Sélectionnez une classe (optionnel)
3. **Modifier un étudiant** :
   - Cliquez sur l'icône crayon
   - Pour retirer un étudiant d'une classe, sélectionnez « Aucune classe »
4. **Supprimer un étudiant** : Cliquez sur l'icône poubelle et confirmez

---

## 5. Gestion des Enseignants (Administrateur seulement)

Pour gérer les enseignants :
1. Cliquez sur « Enseignants » dans le menu de gauche
2. **Ajouter un enseignant** : Cliquez sur « Ajouter un enseignant » et remplissez le formulaire
3. **Modifier un enseignant** : Cliquez sur l'icône crayon
4. **Supprimer un enseignant** : Cliquez sur l'icône poubelle et confirmez

---

## 6. Gestion des Matières (Administrateur seulement)

Pour gérer les matières :
1. Cliquez sur « Matières » dans le menu de gauche
2. **Ajouter une matière** :
   - Cliquez sur « Ajouter une matière »
   - Remplissez le nom et la description
   - Sélectionnez un enseignant et une classe (optionnels)
3. **Modifier une matière** :
   - Cliquez sur l'icône crayon
   - Pour retirer un enseignant/classe, sélectionnez « Aucun enseignant » / « Aucune classe »
4. **Supprimer une matière** : Cliquez sur l'icône poubelle et confirmez

---

## 7. Gestion des Notes

### Pour l'Administrateur et l'Enseignant :
1. Cliquez sur « Notes » dans le menu de gauche
2. **Ajouter une note** :
   - Cliquez sur « Ajouter une note »
   - Sélectionnez l'étudiant, la matière, l'enseignant
   - Remplissez la note et la date de saisie
3. **Modifier une note** : Cliquez sur l'icône crayon
4. **Supprimer une note** : Cliquez sur l'icône poubelle et confirmez

---

## 8. Gestion des Bulletins et téléchargement en PDF

### Pour l'Administrateur :
1. Cliquez sur « Bulletins » dans le menu de gauche
2. **Ajouter un bulletin** :
   - Cliquez sur « Ajouter un bulletin »
   - Sélectionnez l'étudiant
   - Remplissez la moyenne générale et la mention
3. **Modifier un bulletin** : Cliquez sur l'icône crayon
4. **Supprimer un bulletin** : Cliquez sur l'icône poubelle et confirmez

### Pour l'Administrateur, l'Enseignant et l'Étudiant :
Pour télécharger le bulletin en PDF :
1. Cliquez sur « Bulletins » dans le menu de gauche
2. Cliquez sur l'icône **flèche verte vers le bas** à côté du bulletin
3. Le PDF se télécharge automatiquement avec le nom `bulletin_NOM_PRENOM.pdf`

Le PDF contient :
- Le titre « Bulletin de Notes »
- Le nom et prénom de l'étudiant
- La classe
- La moyenne générale et la mention
- Un tableau avec :
  - La matière
  - L'enseignant
  - La note
  - La date de saisie

---

## 9. Conseils utiles

1. **Si la suppression d'une classe ne fonctionne pas** :
   - D'abord, retirez tous les étudiants de cette classe
   - Ensuite, essayez de supprimer la classe

2. **Si rien ne change après une modification** :
   - Rafraîchissez la page avec **Ctrl + Shift + R** (vide le cache)
   - Rechargez l'application

3. **Si le PDF ne contient pas les notes** :
   - Vérifiez que l'étudiant a bien des notes enregistrées dans l'application
   - Re-lancez le backend (IntelliJ IDEA) et le frontend (`npm start`)

---

## 10. Arrêter et relancer l'application

### Frontend :
- Pour arrêter : Ouvrez le terminal où `npm start` est lancé et appuyez sur **Ctrl + C**
- Pour relancer : Ouvrez un terminal dans le dossier `c:\Users\User one\Downloads\eNotes` et tapez `npm start`

### Backend :
- Pour arrêter : Dans IntelliJ IDEA, cliquez sur le bouton **stop rouge**
- Pour relancer : Dans IntelliJ IDEA, cliquez sur le bouton **play vert**

---

Merci d'utiliser eNotes ! 

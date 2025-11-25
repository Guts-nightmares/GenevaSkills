# Structure et Fonctionnement du Projet

## Vue d'ensemble

Ce projet est une application de gestion de tâches (todo list) avec :
- **Frontend** : React (interface utilisateur)
- **Backend** : PHP (API REST)
- **Base de données** : MySQL

---

## Technologies utilisées

### Frontend (dossier `react/`)
- **React** : Framework JavaScript pour créer l'interface
- **React Router** : Gère la navigation entre les pages (login, dashboard, catégories)
- **Vite** : Outil de build rapide pour React
- **Tailwind CSS** : Framework CSS pour le style

### Backend (dossier `api/`)
- **PHP** : Langage serveur pour l'API
- **PDO** : Connexion à la base de données MySQL
- **JWT (JSON Web Tokens)** : Pour l'authentification des utilisateurs

---

## Structure des dossiers

```
genevaSkills/
│
├── api/                          # Backend PHP
│   ├── auth.php                 # Connexion, inscription
│   ├── tasks.php                # Gestion des tâches (CRUD)
│   ├── categories.php           # Gestion des catégories (CRUD)
│   ├── config.php               # Configuration BDD et JWT
│   ├── db.php                   # Connexion à la base de données
│   └── utils.php                # Fonctions utiles (JWT, CORS, etc.)
│
├── react/                        # Frontend React
│   ├── src/
│   │   ├── components/          # Composants réutilisables
│   │   │   ├── auth/           # Login et Register
│   │   │   ├── layout/         # Header et Layout
│   │   │   ├── tasks/          # Liste et modal de tâches
│   │   │   ├── categories/     # Liste et modal de catégories
│   │   │   └── ui/             # Composants UI (boutons, inputs)
│   │   │
│   │   ├── pages/              # Pages principales
│   │   │   ├── Dashboard.jsx   # Page d'accueil avec les tâches
│   │   │   └── Categories.jsx  # Page de gestion des catégories
│   │   │
│   │   ├── App.jsx             # Routes et protection des pages
│   │   ├── main.jsx            # Point d'entrée React
│   │   └── index.css           # Styles CSS
│   │
│   ├── package.json            # Dépendances npm
│   └── vite.config.js          # Configuration Vite
│
├── database.sql                 # Script de création de la BDD
├── start-server.sh              # Script pour lancer le serveur PHP
└── README.md                    # Instructions de démarrage

```

---

## Comment ça marche ?

### 1. Démarrage de l'application

#### Serveur PHP (Backend)
```bash
./start-server.sh
# ou manuellement :
cd api && php -S localhost:8000
```
Le serveur PHP démarre sur `http://localhost:8000`

#### Serveur React (Frontend)
```bash
cd react
npm run dev
```
Le serveur React démarre sur `http://localhost:5173`

---

### 2. Flux d'authentification

#### Inscription
1. L'utilisateur remplit le formulaire (`RegisterForm.jsx`)
2. React envoie une requête POST à `http://localhost:8000/auth.php?action=register`
3. PHP vérifie les données, hash le mot de passe
4. PHP crée l'utilisateur dans la BDD
5. PHP génère un token JWT
6. React reçoit le token et l'utilisateur, les stocke dans `localStorage`
7. L'utilisateur est redirigé vers le Dashboard

#### Connexion
1. L'utilisateur remplit le formulaire (`LoginForm.jsx`)
2. React envoie une requête POST à `http://localhost:8000/auth.php?action=login`
3. PHP vérifie le username et le mot de passe
4. PHP génère un token JWT
5. React stocke le token dans `localStorage`
6. L'utilisateur est redirigé vers le Dashboard

---

### 3. Protection des pages

#### Comment ça fonctionne ?
- Dans `App.jsx`, il y a un composant `ProtectedRoute`
- Ce composant vérifie si un token existe dans `localStorage`
- Si oui : l'utilisateur peut accéder à la page
- Si non : l'utilisateur est redirigé vers `/login`

```javascript
// Exemple simplifié
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}
```

---

### 4. Communication Frontend ↔ Backend

#### Exemple : Charger les tâches

**Frontend (Dashboard.jsx)**
```javascript
// 1. React fait une requête GET
const response = await fetch('http://localhost:8000/tasks.php', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})

// 2. React reçoit les données JSON
const tasks = await response.json()

// 3. React affiche les tâches
setTasks(tasks)
```

**Backend (tasks.php)**
```php
// 1. PHP reçoit la requête
// 2. PHP vérifie le token JWT dans le header Authorization
// 3. PHP récupère les tâches de l'utilisateur dans la BDD
$stmt = $db->prepare("SELECT * FROM tasks WHERE user_id = ?");
$stmt->execute([$userId]);
$tasks = $stmt->fetchAll();

// 4. PHP renvoie les données en JSON
echo json_encode($tasks);
```

---

### 5. Gestion des tâches (CRUD)

#### Create (Créer)
- Utilisateur clique sur "Nouvelle tâche"
- Modal s'ouvre (`TaskModal.jsx`)
- Utilisateur remplit le formulaire
- React envoie POST à `tasks.php`
- PHP insère dans la BDD
- React recharge la liste des tâches

#### Read (Lire)
- React envoie GET à `tasks.php`
- PHP renvoie toutes les tâches de l'utilisateur
- React affiche la liste

#### Update (Modifier)
- Utilisateur clique sur éditer
- Modal s'ouvre avec les données de la tâche
- Utilisateur modifie
- React envoie PUT à `tasks.php`
- PHP met à jour dans la BDD

#### Delete (Supprimer)
- Utilisateur clique sur supprimer
- Confirmation
- React envoie DELETE à `tasks.php`
- PHP supprime de la BDD

---

### 6. Base de données

#### Tables principales

**users**
- `id` : Identifiant unique
- `username` : Nom d'utilisateur
- `email` : Email
- `password` : Mot de passe hashé
- `role_id` : Rôle (admin ou user)

**tasks**
- `id` : Identifiant unique
- `user_id` : Propriétaire de la tâche
- `category_id` : Catégorie (optionnel)
- `title` : Titre de la tâche
- `description` : Description
- `deadline` : Date limite
- `status` : "todo" ou "done"
- `created_at` : Date de création

**categories**
- `id` : Identifiant unique
- `user_id` : Propriétaire
- `name` : Nom de la catégorie
- `color` : Couleur en hexadécimal (#FF0000)

---

## Sécurité

### JWT (JSON Web Token)
Un JWT est créé à la connexion et contient :
- `userId` : ID de l'utilisateur
- `username` : Nom d'utilisateur
- `exp` : Date d'expiration (1 heure)

Le token est signé avec un secret (`JWT_SECRET` dans `config.php`)

### Protection des routes API
Chaque requête vers l'API (sauf login/register) doit avoir :
```
Authorization: Bearer <token>
```

PHP vérifie le token avant de traiter la requête.

### CORS
Les headers CORS permettent au frontend (port 5173) de communiquer avec le backend (port 8000).

---

## Workflow complet - Exemple

### Utilisateur crée une tâche

1. **Frontend** : Utilisateur clique sur "Nouvelle tâche"
2. **Frontend** : Modal s'ouvre (`TaskModal.jsx`)
3. **Frontend** : Utilisateur remplit : titre "Faire les courses"
4. **Frontend** : Clique sur "Créer"
5. **Frontend** : Fonction `handleSaveTask()` dans `Dashboard.jsx` est appelée
6. **Frontend** : Envoie requête POST à `http://localhost:8000/tasks.php`
   ```javascript
   fetch('http://localhost:8000/tasks.php', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': 'Bearer eyJ0eXAi...'
     },
     body: JSON.stringify({
       title: 'Faire les courses',
       description: '',
       category_id: null
     })
   })
   ```
7. **Backend** : `tasks.php` reçoit la requête
8. **Backend** : Fonction `can('create_task')` vérifie le token JWT
9. **Backend** : Token valide, extrait `userId = 5`
10. **Backend** : Insère dans la BDD
    ```sql
    INSERT INTO tasks (user_id, title, description)
    VALUES (5, 'Faire les courses', '')
    ```
11. **Backend** : Récupère la tâche créée avec son ID
12. **Backend** : Renvoie la tâche en JSON
    ```json
    {
      "id": 42,
      "user_id": 5,
      "title": "Faire les courses",
      "status": "todo",
      ...
    }
    ```
13. **Frontend** : Reçoit la réponse
14. **Frontend** : Ferme le modal
15. **Frontend** : Recharge la liste des tâches
16. **Frontend** : Affiche la nouvelle tâche

---

## Points importants

### localStorage
Le navigateur stocke :
- `token` : Le JWT pour l'authentification
- `user` : Les infos de l'utilisateur (username, email, etc.)

Ces données persistent même si on ferme le navigateur.

### HashRouter
React utilise `HashRouter` qui ajoute `#` dans l'URL :
- `http://localhost:5173/#/` → Dashboard
- `http://localhost:5173/#/login` → Page de connexion
- `http://localhost:5173/#/categories` → Catégories

### Requêtes asynchrones
React utilise `async/await` pour faire des requêtes :
```javascript
async function loadTasks() {
  const response = await fetch(...)  // Attend la réponse
  const data = await response.json() // Attend le parsing JSON
  setTasks(data)                     // Met à jour l'état
}
```

---

## Résumé ultra-simple

1. **React** affiche l'interface
2. L'utilisateur clique/remplit des formulaires
3. **React** envoie des requêtes HTTP à **PHP**
4. **PHP** vérifie le token JWT
5. **PHP** lit/écrit dans la **base de données MySQL**
6. **PHP** renvoie du JSON
7. **React** affiche les données

C'est une architecture client-serveur classique !

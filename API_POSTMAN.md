# Documentation API - Postman

## URL de base
- **Local**: `http://localhost:8000`
- **Production**: `https://ton-domaine.com/api`

---

## 📌 AUTHENTIFICATION

### 1. Inscription
**POST** `/auth.php?action=register`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "motdepasse123"
}
```

**Réponse succès (201):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Réponse erreur (409):**
```json
{
  "error": "Username ou email deja pris"
}
```

---

### 2. Connexion
**POST** `/auth.php?action=login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "username": "john_doe",
  "password": "motdepasse123"
}
```

**Réponse succès (200):**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

**Réponse erreur (401):**
```json
{
  "error": "Identifiants incorrects"
}
```

---

### 3. Récupérer mes infos
**GET** `/auth.php?action=me`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Réponse succès (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "role": "user"
}
```

---

### 4. Déconnexion
**GET** `/auth.php?action=logout`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Réponse succès (200):**
```json
{
  "message": "Deconnecte"
}
```

---

## 📋 TÂCHES

### 5. Récupérer toutes mes tâches
**GET** `/tasks.php`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Paramètres optionnels (query):**
- `status`: filtre par statut (`todo` ou `done`)
- `category_id`: filtre par catégorie (ID)

**Exemples:**
- `/tasks.php` → Toutes mes tâches
- `/tasks.php?status=todo` → Seulement les tâches à faire
- `/tasks.php?category_id=5` → Seulement les tâches de la catégorie 5

**Réponse succès (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "category_id": 3,
    "title": "Faire les courses",
    "description": "Acheter du pain et du lait",
    "status": "todo",
    "deadline": "2025-12-01",
    "created_at": "2025-11-25 10:30:00",
    "category_name": "Personnel",
    "category_color": "#3B82F6"
  },
  {
    "id": 2,
    "user_id": 1,
    "category_id": 5,
    "title": "Finir le projet React",
    "description": "Terminer la page d'accueil",
    "status": "done",
    "deadline": "2025-11-30",
    "created_at": "2025-11-20 14:00:00",
    "category_name": "Travail",
    "category_color": "#EF4444"
  }
]
```

---

### 6. Créer une tâche
**POST** `/tasks.php`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Body (JSON):**
```json
{
  "title": "Faire les devoirs",
  "description": "Mathématiques chapitre 5",
  "category_id": 3,
  "deadline": "2025-12-05"
}
```

**Champs:**
- `title` (obligatoire): titre de la tâche
- `description` (optionnel): description
- `category_id` (optionnel): ID de la catégorie
- `deadline` (optionnel): date limite au format YYYY-MM-DD

**Réponse succès (201):**
```json
{
  "id": 10,
  "user_id": 1,
  "category_id": 3,
  "title": "Faire les devoirs",
  "description": "Mathématiques chapitre 5",
  "status": "todo",
  "deadline": "2025-12-05",
  "created_at": "2025-11-25 15:20:00",
  "category_name": "École",
  "category_color": "#10B981"
}
```

**Réponse erreur (400):**
```json
{
  "error": "Titre requis"
}
```

---

### 7. Modifier une tâche
**PUT** `/tasks.php`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Body (JSON):**
```json
{
  "id": 10,
  "title": "Faire les devoirs de maths",
  "description": "Mathématiques chapitre 5 et 6",
  "category_id": 3,
  "deadline": "2025-12-06",
  "status": "done"
}
```

**Champs:**
- `id` (obligatoire): ID de la tâche à modifier
- `title` (obligatoire): nouveau titre
- `description` (optionnel): nouvelle description
- `category_id` (optionnel): nouvelle catégorie
- `deadline` (optionnel): nouvelle date limite
- `status` (optionnel): `todo` ou `done`

**Réponse succès (200):**
```json
{
  "id": 10,
  "user_id": 1,
  "category_id": 3,
  "title": "Faire les devoirs de maths",
  "description": "Mathématiques chapitre 5 et 6",
  "status": "done",
  "deadline": "2025-12-06",
  "created_at": "2025-11-25 15:20:00",
  "category_name": "École",
  "category_color": "#10B981"
}
```

---

### 8. Supprimer une tâche
**DELETE** `/tasks.php?id={task_id}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Exemple:**
```
DELETE /tasks.php?id=10
```

**Réponse succès (200):**
```json
{
  "message": "Tache supprimee"
}
```

**Réponse erreur (400):**
```json
{
  "error": "ID requis"
}
```

---

## 🏷️ CATÉGORIES

### 9. Récupérer toutes mes catégories
**GET** `/categories.php`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Réponse succès (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "name": "École",
    "color": "#10B981",
    "created_at": "2025-11-20 10:00:00",
    "task_count": 5
  },
  {
    "id": 2,
    "user_id": 1,
    "name": "Personnel",
    "color": "#3B82F6",
    "created_at": "2025-11-20 10:05:00",
    "task_count": 3
  },
  {
    "id": 3,
    "user_id": 1,
    "name": "Sport",
    "color": "#F59E0B",
    "created_at": "2025-11-20 10:10:00",
    "task_count": 2
  }
]
```

**Note:** Les catégories sont triées par ordre alphabétique (A → Z)

---

### 10. Créer une catégorie
**POST** `/categories.php`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Body (JSON):**
```json
{
  "name": "Travail",
  "color": "#EF4444"
}
```

**Champs:**
- `name` (obligatoire): nom de la catégorie
- `color` (optionnel): couleur en hexadécimal (défaut: #3B82F6)

**Réponse succès (201):**
```json
{
  "id": 15,
  "user_id": 1,
  "name": "Travail",
  "color": "#EF4444",
  "created_at": "2025-11-25 16:00:00"
}
```

**Réponse erreur (400):**
```json
{
  "error": "Nom requis"
}
```

---

### 11. Modifier une catégorie
**PUT** `/categories.php`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Body (JSON):**
```json
{
  "id": 15,
  "name": "Boulot",
  "color": "#DC2626"
}
```

**Champs:**
- `id` (obligatoire): ID de la catégorie à modifier
- `name` (obligatoire): nouveau nom
- `color` (obligatoire): nouvelle couleur

**Réponse succès (200):**
```json
{
  "id": 15,
  "user_id": 1,
  "name": "Boulot",
  "color": "#DC2626",
  "created_at": "2025-11-25 16:00:00"
}
```

---

### 12. Supprimer une catégorie
**DELETE** `/categories.php?id={category_id}`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {ton_token}
```

**Exemple:**
```
DELETE /categories.php?id=15
```

**Réponse succès (200):**
```json
{
  "message": "Categorie supprimee"
}
```

---

## 🔐 SÉCURITÉ

### Format du Token JWT
Tous les tokens sont au format JWT et doivent être envoyés dans le header Authorization:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

### Erreurs d'authentification
Si ton token est invalide ou expiré:
```json
{
  "error": "Token invalide ou expire"
}
```
→ Code HTTP: 401

---

## 📝 CODES HTTP

- **200**: OK - Requête réussie
- **201**: Created - Ressource créée avec succès
- **400**: Bad Request - Paramètres invalides
- **401**: Unauthorized - Non authentifié ou token invalide
- **404**: Not Found - Ressource non trouvée
- **409**: Conflict - Conflit (ex: username déjà pris)
- **500**: Internal Server Error - Erreur serveur

---

## 🧪 TESTER AVEC POSTMAN

### Étape 1: Inscription
1. Créer une requête POST vers `/auth.php?action=register`
2. Envoyer username, email et password
3. Copier le `token` de la réponse

### Étape 2: Utiliser le token
1. Dans Postman, aller dans l'onglet "Authorization"
2. Sélectionner "Bearer Token"
3. Coller ton token
4. Ou ajouter manuellement dans Headers:
   - Key: `Authorization`
   - Value: `Bearer {ton_token}`

### Étape 3: Créer des catégories
1. POST vers `/categories.php`
2. Envoyer un nom et une couleur
3. Noter l'ID de la catégorie créée

### Étape 4: Créer des tâches
1. POST vers `/tasks.php`
2. Envoyer un titre et l'ID de la catégorie
3. Récupérer toutes les tâches avec GET `/tasks.php`

---

## 💡 ASTUCES

### Variables d'environnement Postman
Crée une variable `base_url`:
- Local: `http://localhost:8000`
- Prod: `https://ton-domaine.com/api`

Puis utilise `{{base_url}}/tasks.php` dans tes requêtes.

### Enregistrer le token automatiquement
Dans l'onglet "Tests" de la requête de login, ajoute:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.token);
```

Ensuite dans Authorization → Bearer Token, utilise: `{{token}}`

---

## 🐛 ERREURS COURANTES

### 1. CORS Error
→ Vérifier que `setCorsHeaders()` est appelé dans l'API

### 2. Token invalide
→ Refaire un login pour obtenir un nouveau token

### 3. 404 Not Found
→ Vérifier l'URL et que le serveur PHP tourne

### 4. Failed to fetch
→ Vérifier que le serveur PHP est démarré avec `./start-server.sh`

---

Voilà! Tu as toutes les routes pour tester ton API avec Postman 🚀

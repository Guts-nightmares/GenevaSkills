# Dépannage des problèmes courants

## Problème : Page blanche après connexion

### Symptômes
- Vous vous connectez/inscrivez avec succès
- Vous êtes redirigé vers une page blanche
- Le header ne s'affiche pas

### Solutions possibles

#### 1. Vérifier la console du navigateur
Ouvrez les outils de développement (F12) et regardez l'onglet Console pour voir s'il y a des erreurs.

#### 2. Vérifier que le serveur PHP est bien lancé
```bash
curl http://localhost:8000/auth.php?action=me
```

Si vous obtenez une erreur de connexion, le serveur PHP n'est pas démarré. Lancez-le avec :
```bash
./start-server.sh
```

#### 3. Vérifier le token dans localStorage
Ouvrez la console du navigateur et tapez :
```javascript
console.log(localStorage.getItem('token'))
console.log(localStorage.getItem('user'))
```

Si ces valeurs sont null, la connexion a échoué.

#### 4. Vider le cache du navigateur
Essayez de vider le cache et les cookies, puis reconnectez-vous.

#### 5. Vérifier les erreurs réseau
Dans les outils de développement, allez dans l'onglet "Network" (Réseau) et regardez si les requêtes vers l'API réussissent.

## Problème : Impossible de créer une tâche

### Symptômes
- Le bouton "Nouvelle tâche" ne fait rien
- Le modal ne s'ouvre pas
- Vous êtes redirigé vers une page vide

### Solutions

#### 1. Vérifier que des catégories existent
Avant de créer une tâche, créez au moins une catégorie dans le menu "Catégories".

#### 2. Tester l'API directement
```bash
# Récupérer votre token depuis localStorage
TOKEN="votre_token_ici"

# Tester la création d'une tâche
curl -X POST http://localhost:8000/tasks.php \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Description test"}'
```

#### 3. Vérifier les logs PHP
Si le serveur PHP affiche des erreurs, lisez-les attentivement.

## Problème : Erreur 401 Unauthorized

### Symptômes
- Vous êtes constamment redirigé vers la page de connexion
- Les requêtes API retournent 401

### Solutions

#### 1. Vérifier l'expiration du token
Les tokens JWT expirent après 1 heure. Reconnectez-vous.

#### 2. Vérifier le JWT_SECRET
Assurez-vous que le JWT_SECRET dans `api/config.php` n'a pas changé depuis votre connexion.

## Contacter le support

Si aucune de ces solutions ne fonctionne, ouvrez un ticket avec :
- Les messages d'erreur dans la console du navigateur
- Les erreurs PHP affichées dans le terminal
- Les étapes exactes pour reproduire le problème

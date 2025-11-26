<?php
/**
 * auth.php - API d'authentification
 *
 * Gère la connexion, l'inscription, la déconnexion et
 * la récupération des informations utilisateur
 */

// Charge la connexion à la base de données
require_once __DIR__ . '/db.php';

// Charge les fonctions utilitaires
require_once __DIR__ . '/utils.php';

// Configure les headers CORS pour autoriser les requêtes
setCorsHeaders();

// Récupère l'action demandée dans l'URL
$action = $_GET['action'] ?? '';

// Redirige vers la bonne fonction selon l'action
switch ($action) {
    case 'login':
        login();  // Connexion d'un utilisateur
        break;
    case 'register':
        register();  // Inscription d'un nouvel utilisateur
        break;
    case 'logout':
        logout();  // Déconnexion
        break;
    case 'me':
        getMe();  // Récupération des infos de l'utilisateur connecté
        break;
    default:
        respondError('Action invalide', 400);  // Action non reconnue
}

/**
 * Fonction de connexion
 * Vérifie les identifiants et génère un token JWT
 */
function login() {
    try {
        // Récupère les données JSON envoyées
        $data = getJsonInput();

        // Nettoie le nom d'utilisateur (sécurité)
        $username = cleanString($data['username'] ?? '');

        // Récupère le mot de passe
        $password = $data['password'] ?? '';

        // Vérifie que tous les champs sont remplis
        if (!$username || !$password) {
            respondError('Username et password requis', 400);
        }

        // Se connecte à la base de données
        $db = getDB();

        // Prépare la requête pour chercher l'utilisateur
        $stmt = $db->prepare("
            SELECT u.*, r.name as role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.username = ? AND u.active = 1
        ");

        // Exécute la requête avec le nom d'utilisateur
        $stmt->execute([$username]);

        // Récupère l'utilisateur trouvé
        $user = $stmt->fetch();

        // Vérifie si l'utilisateur existe et si le mot de passe est correct
        if (!$user || !password_verify($password, $user['password'])) {
            respondError('Identifiants incorrects', 401);
        }

        // Génère un token JWT pour la session
        $token = generateJWT($user['id'], $user['username']);

        // Renvoie le token et les infos utilisateur
        respondSuccess([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role_name']
            ]
        ]);
    } catch(Exception $e) {
        // En cas d'erreur, renvoie le message d'erreur
        respondError('Erreur serveur: ' . $e->getMessage(), 500);
    }
}

/**
 * Fonction d'inscription
 * Crée un nouveau compte utilisateur
 */
function register() {
    try {
        // Récupère les données JSON envoyées
        $data = getJsonInput();

        // Nettoie les données reçues (sécurité)
        $username = cleanString($data['username'] ?? '');
        $email = cleanString($data['email'] ?? '');
        $password = $data['password'] ?? '';

        // Vérifie que tous les champs sont remplis
        if (!$username || !$email || !$password) {
            respondError('Tous les champs requis', 400);
        }

        // Vérifie la longueur minimale du mot de passe
        if (strlen($password) < 6) {
            respondError('Password min 6 caracteres', 400);
        }

        // Se connecte à la base de données
        $db = getDB();

        // Vérifie si le nom d'utilisateur ou l'email existe déjà
        $stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);

        // Si un utilisateur existe déjà, renvoie une erreur
        if ($stmt->fetch()) {
            respondError('Username ou email deja pris', 409);
        }

        // Hache le mot de passe pour la sécurité
        $hash = password_hash($password, PASSWORD_DEFAULT);

        // Prépare la requête d'insertion (role_id 2 = utilisateur normal)
        $stmt = $db->prepare("INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, 2)");

        // Exécute l'insertion
        if ($stmt->execute([$username, $email, $hash])) {
            // Récupère l'ID du nouvel utilisateur
            $userId = $db->lastInsertId();

            // Génère un token JWT pour connecter automatiquement
            $token = generateJWT($userId, $username);

            // Renvoie le token et les infos utilisateur
            respondSuccess([
                'token' => $token,
                'user' => [
                    'id' => $userId,
                    'username' => $username,
                    'email' => $email,
                    'role' => 'user'
                ]
            ], 201);
        } else {
            // En cas d'erreur d'insertion
            respondError('Erreur inscription', 500);
        }
    } catch(Exception $e) {
        // En cas d'erreur, renvoie le message d'erreur
        respondError('Erreur serveur: ' . $e->getMessage(), 500);
    }
}

/**
 * Fonction de déconnexion
 * Renvoie simplement un message de confirmation
 */
function logout() {
    // Renvoie un message de déconnexion
    respondSuccess(['message' => 'Deconnecte']);
}

/**
 * Fonction pour récupérer les infos de l'utilisateur connecté
 * Nécessite un token JWT valide
 */
function getMe() {
    // Vérifie l'authentification et récupère les infos du token
    $user = auth();

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête pour récupérer les infos complètes
    $stmt = $db->prepare("
        SELECT u.*, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
    ");

    // Exécute avec l'ID de l'utilisateur du token
    $stmt->execute([$user['userId']]);

    // Récupère les données
    $userData = $stmt->fetch();

    // Si l'utilisateur n'existe pas
    if (!$userData) {
        respondError('User non trouve', 404);
    }

    // Renvoie les informations de l'utilisateur
    respondSuccess([
        'id' => $userData['id'],
        'username' => $userData['username'],
        'email' => $userData['email'],
        'role' => $userData['role_name']
    ]);
}

// ----- Fonctions d'aide -----

/**
 * Renvoie une erreur en JSON
 * @param string $message - Message d'erreur
 * @param int $code - Code HTTP (400 par défaut)
 */
function respondError($message, $code = 400) {
    // Définit le code de statut HTTP
    http_response_code($code);

    // Définit le type de contenu
    header('Content-Type: application/json');

    // Renvoie l'erreur en JSON
    echo json_encode(['error' => $message]);

    // Arrête l'exécution
    exit;
}

/**
 * Renvoie un succès en JSON
 * @param array $data - Données à renvoyer
 * @param int $code - Code HTTP (200 par défaut)
 */
function respondSuccess($data, $code = 200) {
    // Définit le code de statut HTTP
    http_response_code($code);

    // Définit le type de contenu
    header('Content-Type: application/json');

    // Renvoie les données en JSON
    echo json_encode($data);

    // Arrête l'exécution
    exit;
}

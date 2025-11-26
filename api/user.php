<?php
/**
 * user.php - API pour gérer le profil utilisateur
 *
 * Permet de modifier le nom, l'email et le mot de passe
 */

// Charge la connexion à la base de données
require_once __DIR__ . '/db.php';

// Charge les fonctions utilitaires
require_once __DIR__ . '/utils.php';

// Configure les headers CORS
setCorsHeaders();

// Récupère la méthode HTTP
$method = $_SERVER['REQUEST_METHOD'];

// Redirige selon la méthode
switch ($method) {
    case 'PUT':
        updateUser();  // Modification du profil
        break;
    case 'DELETE':
        deleteUser();  // Suppression du compte
        break;
    default:
        respondError('Methode non supportee', 405);
}

/**
 * Fonction pour modifier l'utilisateur
 * Peut modifier le nom, l'email et/ou le mot de passe en même temps
 */
function updateUser() {
    try {
        // Vérifie l'authentification
        $user = auth();

        // Récupère les données envoyées
        $data = getJsonInput();

        // Se connecte à la base de données
        $db = getDB();

        // Je commence par gérer le changement de mot de passe si demandé
        if (isset($data['current_password']) && isset($data['new_password'])) {
            // Je récupère le mot de passe actuel de l'utilisateur
            $stmt = $db->prepare("SELECT password FROM users WHERE id = ?");
            $stmt->execute([$user['userId']]);
            $userData = $stmt->fetch();

            // Je vérifie que le mot de passe actuel est correct
            if (!password_verify($data['current_password'], $userData['password'])) {
                respondError('Mot de passe actuel incorrect', 401);
            }

            // Je vérifie que le nouveau mot de passe fait au moins 6 caractères
            if (strlen($data['new_password']) < 6) {
                respondError('Le nouveau mot de passe doit faire au moins 6 caracteres', 400);
            }

            // Je hache le nouveau mot de passe
            $newHash = password_hash($data['new_password'], PASSWORD_DEFAULT);

            // Je mets à jour le mot de passe dans la base
            $stmt = $db->prepare("UPDATE users SET password = ? WHERE id = ?");
            $stmt->execute([$newHash, $user['userId']]);
        }

        // Ensuite je gère le changement du nom d'utilisateur et/ou email
        if (isset($data['username']) && isset($data['email'])) {
            // Je nettoie les données
            $username = cleanString($data['username']);
            $email = cleanString($data['email']);

            // Je vérifie que les champs ne sont pas vides
            if (!$username || !$email) {
                respondError('Username et email requis', 400);
            }

            // Je vérifie que le nom d'utilisateur ou l'email ne sont pas déjà pris par un autre utilisateur
            $stmt = $db->prepare("SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?");
            $stmt->execute([$username, $email, $user['userId']]);

            if ($stmt->fetch()) {
                respondError('Username ou email deja pris', 409);
            }

            // Je mets à jour le nom et l'email
            $stmt = $db->prepare("UPDATE users SET username = ?, email = ? WHERE id = ?");
            $stmt->execute([$username, $email, $user['userId']]);
        }

        // Je récupère les nouvelles données de l'utilisateur
        $stmt = $db->prepare("
            SELECT u.id, u.username, u.email, r.name as role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.id = ?
        ");
        $stmt->execute([$user['userId']]);
        $updatedUser = $stmt->fetch();

        respondSuccess([
            'message' => 'Profil mis a jour',
            'user' => [
                'id' => $updatedUser['id'],
                'username' => $updatedUser['username'],
                'email' => $updatedUser['email'],
                'role' => $updatedUser['role_name']
            ]
        ]);
    } catch(Exception $e) {
        respondError('Erreur serveur: ' . $e->getMessage(), 500);
    }
}

/**
 * Fonction pour supprimer le compte utilisateur
 * Supprime l'utilisateur et toutes ses données (tâches, catégories)
 */
function deleteUser() {
    try {
        // Vérifie l'authentification
        $user = auth();

        // Se connecte à la base de données
        $db = getDB();

        // Je supprime d'abord toutes les tâches de l'utilisateur
        $stmt = $db->prepare("DELETE FROM tasks WHERE user_id = ?");
        $stmt->execute([$user['userId']]);

        // Je supprime toutes les catégories de l'utilisateur
        $stmt = $db->prepare("DELETE FROM categories WHERE user_id = ?");
        $stmt->execute([$user['userId']]);

        // Enfin je supprime l'utilisateur
        $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$user['userId']]);

        respondSuccess(['message' => 'Compte supprime']);
    } catch(Exception $e) {
        respondError('Erreur serveur: ' . $e->getMessage(), 500);
    }
}

/**
 * Renvoie une erreur en JSON
 */
function respondError($message, $code = 400) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

/**
 * Renvoie un succès en JSON
 */
function respondSuccess($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

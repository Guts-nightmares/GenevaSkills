<?php
/**
 * tasks.php - API de gestion des tâches
 *
 * Permet de créer, lire, modifier et supprimer des tâches
 * Chaque utilisateur ne peut gérer que ses propres tâches
 */

// Active l'affichage des erreurs pour le débogage
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Définit le type de contenu en JSON
header('Content-Type: application/json');

// Charge la connexion à la base de données
require_once __DIR__ . '/db.php';

// Charge les fonctions utilitaires
require_once __DIR__ . '/utils.php';

// Configure les headers CORS
setCorsHeaders();

// Récupère la méthode HTTP de la requête
$method = $_SERVER['REQUEST_METHOD'];

// Redirige vers la bonne fonction selon la méthode
switch ($method) {
    case 'GET':
        getTasks();  // Récupère la liste des tâches
        break;
    case 'POST':
        createTask();  // Crée une nouvelle tâche
        break;
    case 'PUT':
        updateTask();  // Modifie une tâche existante
        break;
    case 'DELETE':
        deleteTask();  // Supprime une tâche
        break;
    default:
        error('Methode invalide');  // Méthode non supportée
}

/**
 * Récupère toutes les tâches de l'utilisateur connecté
 * Supporte les filtres par statut et par catégorie
 */
function getTasks() {
    // Vérifie les permissions et récupère l'utilisateur
    $user = can('view_tasks');


    // Récupère les paramètres de filtre optionnels
    $status = $_GET['status'] ?? null;
    $categoryId = $_GET['category_id'] ?? null;

    // Se connecte à la base de données
    $db = getDB();

    // Construit la requête SQL de base
    $sql = "
        SELECT t.*, c.name as category_name, c.color as category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
    ";

    // Prépare le tableau des paramètres
    $params = [$user['userId']];

    // Ajoute le filtre par statut si présent
    if ($status) {
        $sql .= " AND t.status = ?";
        $params[] = $status;
    }

    // Ajoute le filtre par catégorie si présent
    if ($categoryId) {
        $sql .= " AND t.category_id = ?";
        $params[] = $categoryId;
    }

    // Trie par date de création décroissante
    $sql .= " ORDER BY t.created_at DESC";

    // Prépare et exécute la requête
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    // Renvoie toutes les tâches trouvées
    success($stmt->fetchAll());
}

/**
 * Crée une nouvelle tâche pour l'utilisateur connecté
 */
function createTask() {
    // Vérifie les permissions
    $user = can('create_task');

    // Récupère les données JSON envoyées
    $data = getJson();

    // Nettoie les données reçues (sécurité)
    $title = clean($data['title'] ?? '');
    $description = clean($data['description'] ?? '');
    $deadline = $data['deadline'] ?? null;
    $categoryId = $data['category_id'] ?? null;

    // Vérifie que le titre est présent
    if (!$title) {
        error('Titre requis');
    }

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête d'insertion
    $stmt = $db->prepare("
        INSERT INTO tasks (user_id, category_id, title, description, deadline)
        VALUES (?, ?, ?, ?, ?)
    ");

    // Exécute l'insertion
    if ($stmt->execute([$user['userId'], $categoryId, $title, $description, $deadline])) {
        // Récupère l'ID de la nouvelle tâche
        $taskId = $db->lastInsertId();

        // Charge la tâche complète avec ses relations
        $stmt = $db->prepare("
            SELECT t.*, c.name as category_name, c.color as category_color
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?
        ");
        $stmt->execute([$taskId]);

        // Renvoie la tâche créée avec code 201 (Created)
        success($stmt->fetch(), 201);
    }

    // En cas d'erreur d'insertion
    error('Erreur creation');
}

/**
 * Modifie une tâche existante
 * L'utilisateur ne peut modifier que ses propres tâches
 */
function updateTask() {
    // Vérifie les permissions
    $user = can('edit_task');

    // Récupère les données JSON envoyées
    $data = getJson();

    // Récupère les données à modifier
    $id = $data['id'] ?? 0;
    $title = clean($data['title'] ?? '');
    $description = clean($data['description'] ?? '');
    $deadline = $data['deadline'] ?? null;
    $categoryId = $data['category_id'] ?? null;
    $status = $data['status'] ?? 'todo';

    // Vérifie que l'ID et le titre sont présents
    if (!$id || !$title) {
        error('ID et titre requis');
    }

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête de mise à jour
    $stmt = $db->prepare("
        UPDATE tasks
        SET title = ?, description = ?, deadline = ?, category_id = ?, status = ?
        WHERE id = ? AND user_id = ?
    ");

    // Exécute la mise à jour (le user_id empêche de modifier une tâche d'un autre utilisateur)
    if ($stmt->execute([$title, $description, $deadline, $categoryId, $status, $id, $user['userId']])) {
        // Charge la tâche mise à jour avec ses relations
        $stmt = $db->prepare("
            SELECT t.*, c.name as category_name, c.color as category_color
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?
        ");
        $stmt->execute([$id]);

        // Renvoie la tâche mise à jour
        success($stmt->fetch());
    }

    // En cas d'erreur de modification
    error('Erreur modification');
}

/**
 * Supprime une tâche
 * L'utilisateur ne peut supprimer que ses propres tâches
 */
function deleteTask() {
    // Vérifie les permissions
    $user = can('delete_task');

    // Récupère l'ID de la tâche à supprimer
    $id = $_GET['id'] ?? 0;

    // Vérifie que l'ID est présent
    if (!$id) {
        error('ID requis');
    }

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête de suppression
    $stmt = $db->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");

    // Exécute la suppression (le user_id empêche de supprimer une tâche d'un autre utilisateur)
    if ($stmt->execute([$id, $user['userId']])) {
        // Renvoie un message de confirmation
        success(['message' => 'Tache supprimee']);
    }

    // En cas d'erreur de suppression
    error('Erreur suppression');
}

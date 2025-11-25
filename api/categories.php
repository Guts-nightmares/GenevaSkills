<?php
/**
 * categories.php - API de gestion des catégories
 *
 * Permet de créer, lire, modifier et supprimer des catégories
 * Les catégories servent à organiser les tâches par thème
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
        getCategories();  // Récupère la liste des catégories
        break;
    case 'POST':
        createCategory();  // Crée une nouvelle catégorie
        break;
    case 'PUT':
        updateCategory();  // Modifie une catégorie existante
        break;
    case 'DELETE':
        deleteCategory();  // Supprime une catégorie
        break;
    default:
        error('Methode invalide');  // Méthode non supportée
}

/**
 * Récupère toutes les catégories de l'utilisateur connecté
 * Inclut le nombre de tâches dans chaque catégorie
 */
function getCategories() {
    // Vérifie les permissions
    $user = can('view_categories');

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête pour récupérer les catégories avec le compte des tâches
    // COLLATE utf8mb4_general_ci = tri alphabétique sans tenir compte des majuscules/minuscules
    $stmt = $db->prepare("
        SELECT c.*, COUNT(t.id) as task_count
        FROM categories c
        LEFT JOIN tasks t ON c.id = t.category_id
        WHERE c.user_id = ?
        GROUP BY c.id
        ORDER BY c.name COLLATE utf8mb4_general_ci ASC
    ");

    // Exécute avec l'ID de l'utilisateur
    $stmt->execute([$user['userId']]);

    // Renvoie toutes les catégories
    success($stmt->fetchAll());
}

/**
 * Crée une nouvelle catégorie
 */
function createCategory() {
    // Vérifie les permissions
    $user = can('create_category');

    // Récupère les données JSON envoyées
    $data = getJson();

    // Nettoie les données reçues (sécurité)
    $name = clean($data['name'] ?? '');
    $color = clean($data['color'] ?? '#3B82F6');  // Bleu par défaut

    // Vérifie que le nom est présent
    if (!$name) {
        error('Nom requis');
    }

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête d'insertion
    $stmt = $db->prepare("INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)");

    // Exécute l'insertion
    if ($stmt->execute([$user['userId'], $name, $color])) {
        // Récupère l'ID de la nouvelle catégorie
        $categoryId = $db->lastInsertId();

        // Charge la catégorie complète
        $stmt = $db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$categoryId]);

        // Renvoie la catégorie créée avec code 201 (Created)
        success($stmt->fetch(), 201);
    }

    // En cas d'erreur d'insertion
    error('Erreur creation');
}

/**
 * Modifie une catégorie existante
 * L'utilisateur ne peut modifier que ses propres catégories
 */
function updateCategory() {
    // Vérifie les permissions
    $user = can('edit_category');

    // Récupère les données JSON envoyées
    $data = getJson();

    // Récupère les données à modifier
    $id = $data['id'] ?? 0;
    $name = clean($data['name'] ?? '');
    $color = clean($data['color'] ?? '');

    // Vérifie que l'ID et le nom sont présents
    if (!$id || !$name) {
        error('ID et nom requis');
    }

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête de mise à jour
    $stmt = $db->prepare("
        UPDATE categories
        SET name = ?, color = ?
        WHERE id = ? AND user_id = ?
    ");

    // Exécute la mise à jour (le user_id empêche de modifier une catégorie d'un autre utilisateur)
    if ($stmt->execute([$name, $color, $id, $user['userId']])) {
        // Charge la catégorie mise à jour
        $stmt = $db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);

        // Renvoie la catégorie mise à jour
        success($stmt->fetch());
    }

    // En cas d'erreur de modification
    error('Erreur modification');
}

/**
 * Supprime une catégorie
 * L'utilisateur ne peut supprimer que ses propres catégories
 */
function deleteCategory() {
    // Vérifie les permissions
    $user = can('delete_category');

    // Récupère l'ID de la catégorie à supprimer
    $id = $_GET['id'] ?? 0;

    // Vérifie que l'ID est présent
    if (!$id) {
        error('ID requis');
    }

    // Se connecte à la base de données
    $db = getDB();

    // Prépare la requête de suppression
    $stmt = $db->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");

    // Exécute la suppression (le user_id empêche de supprimer une catégorie d'un autre utilisateur)
    if ($stmt->execute([$id, $user['userId']])) {
        // Renvoie un message de confirmation
        success(['message' => 'Categorie supprimee']);
    }

    // En cas d'erreur de suppression
    error('Erreur suppression');
}

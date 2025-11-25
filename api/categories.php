<?php
// API categories simplifie
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/utils.php';

setCorsHeaders();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        getCategories();
        break;
    case 'POST':
        createCategory();
        break;
    case 'PUT':
        updateCategory();
        break;
    case 'DELETE':
        deleteCategory();
        break;
    default:
        error('Methode invalide');
}

function getCategories() {
    $user = can('view_categories');

    $db = getDB();
    $stmt = $db->prepare("
        SELECT c.*, COUNT(t.id) as task_count
        FROM categories c
        LEFT JOIN tasks t ON c.id = t.category_id
        WHERE c.user_id = ?
        GROUP BY c.id
        ORDER BY c.name
    ");
    $stmt->execute([$user['userId']]);

    success($stmt->fetchAll());
}

function createCategory() {
    $user = can('create_category');
    $data = getJson();

    $name = clean($data['name'] ?? '');
    $color = clean($data['color'] ?? '#3B82F6');

    if (!$name) {
        error('Nom requis');
    }

    $db = getDB();
    $stmt = $db->prepare("INSERT INTO categories (user_id, name, color) VALUES (?, ?, ?)");

    if ($stmt->execute([$user['userId'], $name, $color])) {
        $categoryId = $db->lastInsertId();

        $stmt = $db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$categoryId]);

        success($stmt->fetch(), 201);
    }

    error('Erreur creation');
}

function updateCategory() {
    $user = can('edit_category');
    $data = getJson();

    $id = $data['id'] ?? 0;
    $name = clean($data['name'] ?? '');
    $color = clean($data['color'] ?? '');

    if (!$id || !$name) {
        error('ID et nom requis');
    }

    $db = getDB();
    $stmt = $db->prepare("
        UPDATE categories
        SET name = ?, color = ?
        WHERE id = ? AND user_id = ?
    ");

    if ($stmt->execute([$name, $color, $id, $user['userId']])) {
        $stmt = $db->prepare("SELECT * FROM categories WHERE id = ?");
        $stmt->execute([$id]);

        success($stmt->fetch());
    }

    error('Erreur modification');
}

function deleteCategory() {
    $user = can('delete_category');
    $id = $_GET['id'] ?? 0;

    if (!$id) {
        error('ID requis');
    }

    $db = getDB();
    $stmt = $db->prepare("DELETE FROM categories WHERE id = ? AND user_id = ?");

    if ($stmt->execute([$id, $user['userId']])) {
        success(['message' => 'Categorie supprimee']);
    }

    error('Erreur suppression');
}

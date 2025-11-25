<?php
// API tasks simplifie
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
        getTasks();
        break;
    case 'POST':
        createTask();
        break;
    case 'PUT':
        updateTask();
        break;
    case 'DELETE':
        deleteTask();
        break;
    default:
        error('Methode invalide');
}

function getTasks() {
    $user = can('view_tasks');

    $status = $_GET['status'] ?? null;
    $categoryId = $_GET['category_id'] ?? null;

    $db = getDB();
    $sql = "
        SELECT t.*, c.name as category_name, c.color as category_color
        FROM tasks t
        LEFT JOIN categories c ON t.category_id = c.id
        WHERE t.user_id = ?
    ";
    $params = [$user['userId']];

    if ($status) {
        $sql .= " AND t.status = ?";
        $params[] = $status;
    }

    if ($categoryId) {
        $sql .= " AND t.category_id = ?";
        $params[] = $categoryId;
    }

    $sql .= " ORDER BY t.created_at DESC";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    success($stmt->fetchAll());
}

function createTask() {
    $user = can('create_task');
    $data = getJson();

    $title = clean($data['title'] ?? '');
    $description = clean($data['description'] ?? '');
    $deadline = $data['deadline'] ?? null;
    $categoryId = $data['category_id'] ?? null;

    if (!$title) {
        error('Titre requis');
    }

    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO tasks (user_id, category_id, title, description, deadline)
        VALUES (?, ?, ?, ?, ?)
    ");

    if ($stmt->execute([$user['userId'], $categoryId, $title, $description, $deadline])) {
        $taskId = $db->lastInsertId();

        $stmt = $db->prepare("
            SELECT t.*, c.name as category_name, c.color as category_color
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?
        ");
        $stmt->execute([$taskId]);

        success($stmt->fetch(), 201);
    }

    error('Erreur creation');
}

function updateTask() {
    $user = can('edit_task');
    $data = getJson();

    $id = $data['id'] ?? 0;
    $title = clean($data['title'] ?? '');
    $description = clean($data['description'] ?? '');
    $deadline = $data['deadline'] ?? null;
    $categoryId = $data['category_id'] ?? null;
    $status = $data['status'] ?? 'todo';

    if (!$id || !$title) {
        error('ID et titre requis');
    }

    $db = getDB();
    $stmt = $db->prepare("
        UPDATE tasks
        SET title = ?, description = ?, deadline = ?, category_id = ?, status = ?
        WHERE id = ? AND user_id = ?
    ");

    if ($stmt->execute([$title, $description, $deadline, $categoryId, $status, $id, $user['userId']])) {
        $stmt = $db->prepare("
            SELECT t.*, c.name as category_name, c.color as category_color
            FROM tasks t
            LEFT JOIN categories c ON t.category_id = c.id
            WHERE t.id = ?
        ");
        $stmt->execute([$id]);

        success($stmt->fetch());
    }

    error('Erreur modification');
}

function deleteTask() {
    $user = can('delete_task');
    $id = $_GET['id'] ?? 0;

    if (!$id) {
        error('ID requis');
    }

    $db = getDB();
    $stmt = $db->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");

    if ($stmt->execute([$id, $user['userId']])) {
        success(['message' => 'Tache supprimee']);
    }

    error('Erreur suppression');
}

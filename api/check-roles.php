<?php
// Verifie les roles dans la base de donnees

error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

try {
    $db = getDB();

    // Je regarde quels roles existent
    $stmt = $db->query("SELECT * FROM roles");
    $roles = $stmt->fetchAll();

    echo json_encode([
        'success' => true,
        'roles' => $roles
    ], JSON_PRETTY_PRINT);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

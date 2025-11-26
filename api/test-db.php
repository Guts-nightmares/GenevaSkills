<?php
// Test de connexion a la base de donnees

// J'active l'affichage des erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

try {
    // Je charge la config
    require_once __DIR__ . '/config.php';

    echo json_encode([
        'step' => 'Config chargee',
        'db_host' => DB_HOST,
        'db_name' => DB_NAME,
        'db_user' => DB_USER
    ]);

    // J'essaie de me connecter
    require_once __DIR__ . '/db.php';
    $db = getDB();

    echo json_encode([
        'success' => true,
        'message' => 'Connexion a la BDD reussie !',
        'db_host' => DB_HOST,
        'db_name' => DB_NAME
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}

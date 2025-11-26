<?php
// Fichier de test pour verifier que tout marche

// J'active l'affichage des erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

echo json_encode([
    'success' => true,
    'message' => 'Le serveur PHP marche bien !',
    'php_version' => phpversion()
]);

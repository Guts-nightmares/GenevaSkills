<?php
// Test du tri des catégories
// Lance ce fichier pour voir si le tri fonctionne

require_once __DIR__ . '/api/db.php';
require_once __DIR__ . '/api/config.php';

echo "🔍 Test du tri des catégories\n";
echo "================================\n\n";

try {
    $db = getDB();

    // Requête SANS le tri spécifique
    echo "❌ SANS COLLATE (tri par défaut MySQL):\n";
    $stmt = $db->prepare("
        SELECT c.name, c.color
        FROM categories c
        ORDER BY c.name
        LIMIT 10
    ");
    $stmt->execute();
    $categories = $stmt->fetchAll();

    foreach ($categories as $index => $cat) {
        echo ($index + 1) . ". " . $cat['name'] . "\n";
    }

    echo "\n";

    // Requête AVEC le tri utf8mb4_general_ci
    echo "✅ AVEC COLLATE utf8mb4_general_ci:\n";
    $stmt = $db->prepare("
        SELECT c.name, c.color
        FROM categories c
        ORDER BY c.name COLLATE utf8mb4_general_ci ASC
        LIMIT 10
    ");
    $stmt->execute();
    $categories = $stmt->fetchAll();

    foreach ($categories as $index => $cat) {
        echo ($index + 1) . ". " . $cat['name'] . "\n";
    }

    echo "\n================================\n";
    echo "✅ Test terminé!\n";
    echo "Si les deux listes sont différentes, le COLLATE fonctionne.\n";
    echo "La deuxième liste devrait être en ordre alphabétique A→Z.\n";

} catch (Exception $e) {
    echo "❌ Erreur: " . $e->getMessage() . "\n";
}

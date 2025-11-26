<?php
// Connexion à la base de données avec PDO
// On utilise le pattern Singleton pour avoir qu'une seule connexion réutilisable

if (file_exists(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
} else {
    die(json_encode([
        'success' => false,
        'message' => 'Fichier de configuration manquant. Veuillez créer config.php depuis config.example.php'
    ]));
}

class Database {
    private static $instance = null;
    private $connection;

    // Le constructeur est privé pour empêcher de créer plusieurs connexions
    private function __construct() {
        try {
            // utf8mb4 = support complet des caractères Unicode et tri correct
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4;port=3306";

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false
            ];

            $this->connection = new PDO($dsn, DB_USER, DB_PASS, $options);

            // Force le charset utf8mb4 pour être sûr
            $this->connection->exec("SET NAMES utf8mb4 COLLATE utf8mb4_general_ci");

        } catch (PDOException $e) {
            if (DEBUG_MODE) {
                die(json_encode([
                    'success' => false,
                    'message' => 'Erreur de connexion à la base de données: ' . $e->getMessage()
                ]));
            } else {
                die(json_encode([
                    'success' => false,
                    'message' => 'Erreur de connexion à la base de données' 
                ]));
            }
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getConnection() {
        return $this->connection;
    }

    private function __clone() {}

    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}

function getDB() {
    return Database::getInstance()->getConnection();
}

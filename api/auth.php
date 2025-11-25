<?php
// API auth simple
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/utils.php';

setCorsHeaders();

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        login();
        break;
    case 'register':
        register();
        break;
    case 'logout':
        logout();
        break;
    case 'me':
        getMe();
        break;
    default:
        respondError('Action invalide', 400);
}

function login() {
    try {
        $data = getJsonInput();
        $username = cleanString($data['username'] ?? '');
        $password = $data['password'] ?? '';

        if (!$username || !$password) {
            respondError('Username et password requis', 400);
        }

        $db = getDB();
        $stmt = $db->prepare("
            SELECT u.*, r.name as role_name
            FROM users u
            LEFT JOIN roles r ON u.role_id = r.id
            WHERE u.username = ? AND u.active = 1
        ");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            respondError('Identifiants incorrects', 401);
        }

        $token = generateJWT($user['id'], $user['username']);

        respondSuccess([
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email'],
                'role' => $user['role_name']
            ]
        ]);
    } catch(Exception $e) {
        respondError('Erreur serveur: ' . $e->getMessage(), 500);
    }
}

function register() {
    $data = getJsonInput();
    $username = cleanString($data['username'] ?? '');
    $email = cleanString($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$username || !$email || !$password) {
        respondError('Tous les champs requis', 400);
    }

    if (strlen($password) < 6) {
        respondError('Password min 6 caracteres', 400);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);

    if ($stmt->fetch()) {
        respondError('Username ou email deja pris', 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT INTO users (username, email, password, role_id) VALUES (?, ?, ?, 2)");

    if ($stmt->execute([$username, $email, $hash])) {
        $userId = $db->lastInsertId();
        $token = generateJWT($userId, $username);

        respondSuccess([
            'token' => $token,
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'role' => 'user'
            ]
        ], 201);
    } else {
        respondError('Erreur inscription', 500);
    }
}

function logout() {
    respondSuccess(['message' => 'Deconnecte']);
}

function getMe() {
    $user = auth();

    $db = getDB();
    $stmt = $db->prepare("
        SELECT u.*, r.name as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.id = ?
    ");
    $stmt->execute([$user['userId']]);
    $userData = $stmt->fetch();

    if (!$userData) {
        respondError('User non trouve', 404);
    }

    respondSuccess([
        'id' => $userData['id'],
        'username' => $userData['username'],
        'email' => $userData['email'],
        'role' => $userData['role_name']
    ]);
}

// ----- Helpers -----

function respondError($message, $code = 400) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

function respondSuccess($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

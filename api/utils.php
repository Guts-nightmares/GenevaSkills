<?php
// Fonctions utiles pour gérer l'API
require_once __DIR__ . '/config.php';

// Configure les headers pour permettre les requêtes depuis le frontend
function setCorsHeaders() {
    header('Access-Control-Allow-Origin: *');

    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 3600');
    header('Content-Type: application/json; charset=UTF-8');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Headers: *');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        http_response_code(200);
        exit();
    }
}

// Envoie une réponse JSON au frontend
function sendResponse($success, $data = null, $message = '', $statusCode = 200) {
    http_response_code($statusCode);

    $response = ['success' => $success];

    if ($message) {
        $response['message'] = $message;
    }

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response);
    exit();
}

// Récupère les données JSON envoyées par le frontend
function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function isValidLength($str, $min, $max) {
    $len = strlen($str);
    return $len >= $min && $len <= $max;
}

// Nettoie les données pour éviter les failles XSS
function cleanString($str) {
    return htmlspecialchars(strip_tags(trim($str)), ENT_QUOTES, 'UTF-8');
}

// Crée un token JWT pour garder l'utilisateur connecté
function generateJWT($userId, $username) {
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'userId' => $userId,
        'username' => $username,
        'exp' => time() + JWT_EXPIRATION
    ]);

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);

    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = base64UrlEncode($signature);

    return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
}

// Vérifie si le token JWT est valide et pas expiré
function verifyJWT($jwt) {
    $tokenParts = explode('.', $jwt);

    if (count($tokenParts) !== 3) {
        return false;
    }

    $header = base64_decode($tokenParts[0]);
    $payload = base64_decode($tokenParts[1]);
    $signatureProvided = $tokenParts[2];

    $base64UrlHeader = base64UrlEncode($header);
    $base64UrlPayload = base64UrlEncode($payload);
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET, true);
    $base64UrlSignature = base64UrlEncode($signature);

    if ($base64UrlSignature !== $signatureProvided) {
        return false;
    }

    $payloadData = json_decode($payload, true);
    if (!isset($payloadData['exp']) || $payloadData['exp'] < time()) {
        return false;
    }

    return $payloadData;
}

function base64UrlEncode($str) {
    return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
}

function getBearerToken() {
    $headers = getAuthorizationHeader();

    if (!empty($headers)) {
        if (preg_match('/Bearer\s+(.*)$/i', $headers, $matches)) {
            return $matches[1];
        }
    }

    return null;
}

function getAuthorizationHeader() {
    $headers = null;

    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER["Authorization"]);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(
            array_map('ucwords', array_keys($requestHeaders)),
            array_values($requestHeaders)
        );

        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }

    return $headers;
}

function authenticate() {
    $token = getBearerToken();

    if (!$token) {
        return false;
    }

    return verifyJWT($token);
}

// Bloque l'accès si l'utilisateur n'est pas connecté
function requireAuth() {
    $user = authenticate();

    if (!$user) {
        sendResponse(false, null, 'Authentification requise', 401);
    }

    return $user;
}

function isValidDate($date) {
    if (!$date) return true;

    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

function isValidColor($color) {
    return preg_match('/^#[0-9A-Fa-f]{6}$/', $color);
}

// Aliases et fonctions raccourcies pour simplifier le code
function auth() {
    return requireAuth();
}

function can($permission) {
    // Pour l'instant, on vérifie juste l'authentification
    // On pourrait ajouter un système de permissions plus tard
    return requireAuth();
}

function clean($str) {
    return cleanString($str);
}

function getJson() {
    return getJsonInput();
}

function success($data = null, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function error($message, $code = 400) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['error' => $message]);
    exit;
}

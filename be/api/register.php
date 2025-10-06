<?php
// File: be/api/register.php
require __DIR__ . '/../vendor/autoload.php';

use Config\Db;
use App\Controllers\AuthController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $auth = new AuthController($pdo);

    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input)) {
        $input = $_POST;
    }

    $name = $input['name'] ?? null;
    $email = $input['email'] ?? null;
    $password = $input['password'] ?? null;
    $phone = $input['phone'] ?? null;

    $result = $auth->register($name, $email, $password, $phone);

    if (!$result['error']) {
        // gọi sendVerification luôn
        // [$code, $payload] = $auth->sendVerification(['email' => $email]);
        http_response_code($code);
        echo json_encode(array_merge($result, $payload), JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(400);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error',
        'detail' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

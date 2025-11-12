<?php
// File: be/api/forget.php (server gửi mã 6 số)
require __DIR__ . '/../vendor/autoload.php';

use Config\Db;
use App\Controllers\AuthController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Nếu là OPTIONS thì kết thúc sớm (cho CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $db = new Db();
    $pdo = $db->connect();
    $auth = new AuthController($pdo);

    $input = json_decode(file_get_contents('php://input'), true);
    $email = trim($input['email'] ?? '');

    $result = $auth->requestPasswordReset($email);

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Lỗi máy chủ: ' . $e->getMessage()
    ]);
}

<?php
// File: be/api/reset_password.php (đặt lại mật khẩu)
require __DIR__ . '/../vendor/autoload.php';

use Config\Db;
use App\Controllers\AuthController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

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
    $code = trim($input['code'] ?? '');
    $newPassword = trim($input['new_password'] ?? '');

    $result = $auth->resetPassword($email, $code, $newPassword);

    echo json_encode($result);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Lỗi máy chủ: ' . $e->getMessage()
    ]);
}

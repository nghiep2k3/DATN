<?php
// File: be/api/login.php
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
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Không hỗ trợ phương thức này.']);
    exit;
}

try {
    $pdo = (new Db())->connect();

    // Nhận dữ liệu JSON hoặc form
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input)) {
        $input = $_POST; // fallback nếu gửi form
    }

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'Vui lòng nhập email và mật khẩu.']);
        exit;
    }

    $auth = new AuthController($pdo);
    $result = $auth->login($email, $password);

    http_response_code($result['error'] ? 400 : 200);
    echo json_encode($result, JSON_UNESCAPED_UNICODE);


} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error',
        'detail' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

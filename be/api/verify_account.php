<?php
require __DIR__ . '/../vendor/autoload.php';

use Config\Db;

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
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();

    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input)) {
        $input = $_POST;
    }

    $email = $input['email'] ?? null;
    $code  = $input['code'] ?? null;

    if (!$email || !$code) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu email hoặc mã xác minh']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Không tìm thấy người dùng']);
        exit;
    }

    if ((int)$user['verified_account'] === 1) {
        echo json_encode(['error' => false, 'message' => 'Tài khoản đã xác thực trước đó']);
        exit;
    }

    if (strtotime($user['verification_expires_at']) < time()) {
        http_response_code(410);
        echo json_encode(['error' => true, 'message' => 'Mã xác minh đã hết hạn']);
        exit;
    }

    if (!password_verify($code, $user['verification_code'])) {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => 'Mã xác minh không đúng']);
        exit;
    }

    $upd = $pdo->prepare("UPDATE users SET verified_account = 1, verification_code = NULL, verification_expires_at = NULL WHERE id = :id");
    $upd->execute(['id' => $user['id']]);

    echo json_encode(['error' => false, 'message' => 'Xác minh tài khoản thành công']);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error',
        'detail' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}

<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Config\Db;
use App\Controllers\AuthController;

Dotenv::createImmutable(dirname(__DIR__, 2) . '/config')->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $controller = new AuthController($pdo);

    // Đọc dữ liệu từ POST hoặc JSON
    $input = [];
    if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true) ?: [];
    } else {
        $input = $_POST;
    }

    $name = trim($input['name'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = trim($input['password'] ?? '');
    $phone = isset($input['phone']) ? trim($input['phone']) : null;
    $role = isset($input['role']) ? trim($input['role']) : 'user';

    // Validate dữ liệu bắt buộc
    if ($name === '') {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu tên'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($email === '') {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu email'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($password === '') {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu mật khẩu'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Gọi hàm tạo user (admin tạo không cần xác minh)
    $result = $controller->createUserByAdmin($name, $email, $password, $phone, $role);

    if ($result['error']) {
        http_response_code(400);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(201);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

?>


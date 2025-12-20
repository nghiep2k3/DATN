<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Config\Db;
use App\Controllers\AuthController;

Dotenv::createImmutable(dirname(__DIR__, 2) . '/config')->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-HTTP-Method-Override');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST hoặc PUT'], JSON_UNESCAPED_UNICODE);
    exit;
}

// Cho phép override PUT qua POST
if ($method === 'POST') {
    $override = $_POST['_method'] ?? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? null;
    if ($override && strtoupper($override) === 'PUT') {
        $method = 'PUT';
    }
}

try {
    $pdo = (new Db())->connect();
    $controller = new AuthController($pdo);

    $id = null;
    $name = null;
    $email = null;
    $phone = null;
    $role = null;
    $password = null;

    // Đọc dữ liệu từ JSON hoặc POST
    if ($method === 'PUT' && stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?: [];
        
        $id = isset($payload['id']) ? (int) $payload['id'] : null;
        $name = isset($payload['name']) ? trim((string) $payload['name']) : null;
        $email = isset($payload['email']) ? trim((string) $payload['email']) : null;
        $phone = isset($payload['phone']) ? trim((string) $payload['phone']) : null;
        $role = isset($payload['role']) ? trim((string) $payload['role']) : null;
        $password = isset($payload['password']) ? trim((string) $payload['password']) : null;
    } else {
        // POST multipart/form-data
        $id = isset($_POST['id']) ? (int) $_POST['id'] : (isset($_GET['id']) ? (int) $_GET['id'] : null);
        $name = isset($_POST['name']) ? trim((string) $_POST['name']) : null;
        $email = isset($_POST['email']) ? trim((string) $_POST['email']) : null;
        $phone = isset($_POST['phone']) ? trim((string) $_POST['phone']) : null;
        $role = isset($_POST['role']) ? trim((string) $_POST['role']) : null;
        $password = isset($_POST['password']) ? trim((string) $_POST['password']) : null;
    }

    if (!$id || $id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu hoặc sai id'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Gọi hàm cập nhật
    $result = $controller->updateUser($id, $name, $email, $phone, $role, $password);

    if ($result['error']) {
        http_response_code(400);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(200);
        echo json_encode($result, JSON_UNESCAPED_UNICODE);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

?>


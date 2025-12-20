<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\AuthController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép GET'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $controller = new AuthController($pdo);

    if (isset($_GET['id'])) {
        // Lấy user theo ID
        $id = (int) $_GET['id'];
        $user = $controller->getUserById($id);
        if ($user) {
            http_response_code(200);
            echo json_encode(['error' => false, 'data' => $user->toPublicArray()], JSON_UNESCAPED_UNICODE);
        } else {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Không tìm thấy user'], JSON_UNESCAPED_UNICODE);
        }
    } else {
        // Lấy tất cả users
        $users = $controller->getAllUsers();
        $usersArray = array_map(fn($u) => $u->toPublicArray(), $users);
        http_response_code(200);
        echo json_encode(['error' => false, 'data' => $usersArray], JSON_UNESCAPED_UNICODE);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

?>


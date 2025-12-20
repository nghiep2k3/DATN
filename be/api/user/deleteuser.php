<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\AuthController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép DELETE'], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $controller = new AuthController($pdo);

    if (!isset($_GET['id'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu id'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $id = (int) $_GET['id'];
    $result = $controller->deleteUser($id);

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


<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\ProductController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép GET']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $controller = new ProductController($pdo);

    if (isset($_GET['id'])) {
        // Nếu có id → trả chi tiết
        [$code, $payload] = $controller->show((int)$_GET['id']);
    } else {
        // Không có id → trả danh sách
        [$code, $payload] = $controller->list($_GET);
    }

    http_response_code($code);
    echo json_encode($payload);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error',
        'detail'  => $e->getMessage()
    ]);
}

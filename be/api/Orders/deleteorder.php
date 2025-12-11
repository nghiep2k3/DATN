<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\OrdersController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép DELETE']);
    exit;
}

try {
    // Lấy ID từ query string
    if (!isset($_GET['id'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu ID đơn hàng']);
        exit;
    }

    $id = (int) $_GET['id'];
    $pdo = (new Db())->connect();
    $ctl = new OrdersController($pdo);

    // Kiểm tra đơn hàng có tồn tại
    if (!$ctl->exists($id)) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Đơn hàng không tồn tại']);
        exit;
    }

    // Xóa đơn hàng
    $result = $ctl->delete($id);

    if (!$result['error']) {
        http_response_code(200);
        echo json_encode([
            'error' => false,
            'message' => $result['message']
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => $result['message']]);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>

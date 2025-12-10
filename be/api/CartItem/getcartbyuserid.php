<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CartItemController;

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
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép GET']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $ctl = new CartItemController($pdo);

    // Lấy user_id từ query string
    if (!isset($_GET['user_id'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu user_id']);
        exit;
    }

    $user_id = (int) $_GET['user_id'];

    // Lấy giỏ hàng theo user_id
    $result = $ctl->getCart($user_id, null);

    if (!$result['error'] && !empty($result['data'])) {
        http_response_code(200);
        echo json_encode([
            'error' => false,
            'data' => $result['data']
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Không tìm thấy giỏ hàng cho user này']);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>

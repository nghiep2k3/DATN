<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CartItemController;

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

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
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $ctl = new CartItemController($pdo);

    // Lấy JSON từ body
    $body = json_decode(file_get_contents('php://input'), true);

    if (!isset($body['cart_ids']) || !is_array($body['cart_ids'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu hoặc sai cart_ids']);
        exit;
    }

    $cartIds = $body['cart_ids'];

    if (empty($cartIds)) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Danh sách cart_ids rỗng']);
        exit;
    }

    // Xóa nhiều cart item
    $result = $ctl->deleteCartItemsByIds($cartIds);

    // Nếu controller trả lỗi
    if ($result['error']) {
        http_response_code(400);
        echo json_encode($result);
        exit;
    }

    // Thành công
    http_response_code(200);
    echo json_encode([
        'error' => false,
        'message' => $result['message'],
        'deleted_ids' => $cartIds
    ]);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Lỗi máy chủ',
        'detail' => $e->getMessage()
    ]);
}
?>
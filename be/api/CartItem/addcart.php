<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Config\Db;
use App\Controllers\CartItemController;

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
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $ctl = new CartItemController($pdo);

    // Chỉ hỗ trợ raw JSON
    $input = file_get_contents('php://input');
    $data = json_decode($input, true) ?? [];

    // Trim khoảng trắng trong keys
    $cleanData = [];
    foreach ($data as $key => $value) {
        $cleanData[trim($key)] = $value;
    }

    // Lấy dữ liệu
    $user_id = isset($cleanData['user_id']) ? (int)$cleanData['user_id'] : null;
    $product_id = isset($cleanData['product_id']) ? (int)$cleanData['product_id'] : null;
    $quantity = isset($cleanData['quantity']) ? (int)$cleanData['quantity'] : null;
    $phone = trim($cleanData['phone'] ?? '');
    $price = trim($cleanData['price'] ?? null) ?: null;

    // Validation
    if ($product_id === null || $product_id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu hoặc không hợp lệ product_id']);
        exit;
    }

    if ($quantity === null || $quantity <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu hoặc không hợp lệ quantity']);
        exit;
    }

    if ($phone === '') {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu phone']);
        exit;
    }

    // Thêm cart item
    $result = $ctl->create($user_id, $product_id, $quantity, $phone, $price);

    if ($result['error']) {
        http_response_code(400);
        echo json_encode($result);
    } else {
        http_response_code(201);
        echo json_encode([
            'error' => false,
            'message' => $result['message'],
            'data' => [
                'user_id' => $user_id,
                'product_id' => $product_id,
                'quantity' => $quantity,
                'phone' => $phone,
                'price' => $price
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>

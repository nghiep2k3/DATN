<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CartItemController;

// Load biến môi trường từ .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');

// Kết nối DB
$db = (new Db())->connect();
$controller = new CartItemController($db);

// Lấy dữ liệu từ body (JSON hoặc form-data)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

// Với mỗi field → nếu không có thì cho NULL
$user_id      = $input['user_id']      ?? null;
$product_id   = $input['product_id']   ?? null;
$quantity     = $input['quantity']     ?? null;
$number_phone = $input['number_phone'] ?? null;

// Gọi controller (cho phép null)
$result = $controller->create(
    $user_id ? (int)$user_id : null,
    $product_id ? (int)$product_id : null,
    $quantity ? (int)$quantity : null,
    $number_phone
);

if ($result['error']) {
    http_response_code(500);
} else {
    http_response_code(201);
}
echo json_encode($result);

<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CartItemController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');

$db = (new Db())->connect();
$controller = new CartItemController($db);

// Nhận user_id hoặc number_phone từ query
$user_id = $_GET['user_id'] ?? null;
$number_phone = $_GET['number_phone'] ?? null;

if (!$user_id && !$number_phone) {
    http_response_code(400);
    echo json_encode([
        "error" => true,
        "message" => "Cần truyền user_id hoặc number_phone"
    ]);
    exit;
}

$result = $controller->getCart(
    $user_id ? (int)$user_id : null,
    $number_phone ? trim($number_phone) : null
);

if ($result['error']) {
    http_response_code(500);
} else {
    http_response_code(200);
}
echo json_encode($result);

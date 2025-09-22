<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CartItemController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');

$db = (new Db())->connect();
$controller = new CartItemController($db);

// Nhận dữ liệu JSON hoặc form-data
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_POST;
}

$id = $input['id'] ?? null;
$quantity = $input['quantity'] ?? null;
$number_phone = $input['number_phone'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => true, "message" => "Thiếu id"]);
    exit;
}

$result = $controller->update(
    (int)$id,
    $quantity ? (int)$quantity : null,
    $number_phone ?? null
);

http_response_code($result['error'] ? 500 : 200);
echo json_encode($result);

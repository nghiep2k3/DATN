<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CartItemController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');

$db = (new Db())->connect();
$controller = new CartItemController($db);

// Nhận id từ query hoặc body
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    $input = $_REQUEST; // hỗ trợ cả GET, POST
}

$id = $input['id'] ?? null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => true, "message" => "Thiếu id"]);
    exit;
}

$result = $controller->delete((int)$id);

http_response_code($result['error'] ? 500 : 200);
echo json_encode($result);

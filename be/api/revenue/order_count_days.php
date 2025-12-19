<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\OrdersController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $controller = new OrdersController($pdo);

    // Lấy date từ query string (tùy chọn), format: YYYY-MM-DD
    // Nếu không có thì lấy ngày hôm nay
    $date = isset($_GET['date']) ? $_GET['date'] : null;

    // Gọi hàm lấy số đơn hàng theo ngày
    $result = $controller->getOrderCountByDate($date);

    // Trả về JSON
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Lỗi máy chủ: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}


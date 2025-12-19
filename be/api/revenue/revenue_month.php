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

    // Lấy year và month từ query string (tùy chọn)
    // Format: ?year=2025&month=12
    // Nếu không có thì lấy năm/tháng hiện tại
    $year = isset($_GET['year']) ? (int) $_GET['year'] : null;
    $month = isset($_GET['month']) ? (int) $_GET['month'] : null;

    // Gọi hàm tính doanh thu theo tháng
    $result = $controller->getRevenueByMonth($year, $month);

    // Trả về JSON
    echo json_encode($result, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Lỗi máy chủ: " . $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}


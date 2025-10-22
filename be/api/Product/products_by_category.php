<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\ProductController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');


// Kết nối database
$pdo = (new Db())->connect();
$controller = new ProductController($pdo);

// Lấy category_id từ query string (?category_id=...)
$categoryId = isset($_GET['category_id']) ? (int)$_GET['category_id'] : 0;

// Kiểm tra tham số hợp lệ
if ($categoryId <= 0) {
    echo json_encode([
        "error" => true,
        "message" => "Thiếu hoặc sai category_id"
    ]);
    exit;
}

// Gọi hàm trong controller
$result = $controller->getByCategoryId($categoryId);

// Trả về JSON
echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

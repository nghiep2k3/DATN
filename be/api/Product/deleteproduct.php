<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\ProductController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");

$pdo = (new Db())->connect();
$controller = new ProductController($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (!isset($_GET['id'])) {
        http_response_code(400);
        echo json_encode([
            "error" => true,
            "message" => "Thiếu ID sản phẩm"
        ]);
        exit;
    }

    $id = (int)$_GET['id'];
    $result = $controller->delete($id);
    echo json_encode($result);
    exit;
}

http_response_code(405);
echo json_encode([
    "error" => true,
    "message" => "Method không được hỗ trợ"
]);

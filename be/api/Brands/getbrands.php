<?php
require __DIR__ . '/../../vendor/autoload.php';
use Config\Db;
use App\Controllers\BrandsController;
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép GET']);
    exit;
}
try {
    $pdo = (new Db())->connect();
    $ctl = new BrandsController($pdo);
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        $brand = $ctl->getBrandById($id);
        if ($brand) {
            http_response_code(200);
            echo json_encode(['data' => $brand->toArray()]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Không tìm thấy thương hiệu']);
        }
    } else {
        $brands = $ctl->getAllBrands();
        $brandsArray = array_map(fn($b) => $b->toArray(), $brands);
        http_response_code(200);
        echo json_encode(['data' => $brandsArray]);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}

?>
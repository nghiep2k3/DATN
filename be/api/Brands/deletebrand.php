<?php
require __DIR__ . '/../../vendor/autoload.php';
use Config\Db;
use App\Controllers\BrandsController;
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép DELETE']);
    exit;
}
try {
    $pdo = (new Db())->connect();
    $ctl = new BrandsController($pdo);
    if (!isset($_GET['id'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu id']);
        exit;
    }
    $id = (int) $_GET['id'];
    $deleted = $ctl->deleteBrand($id);
    if ($deleted) {
        http_response_code(200);
        echo json_encode(['error' => false, 'message' => 'Xoá thương hiệu thành công']);
    } else {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Không tìm thấy thương hiệu']);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}

?>
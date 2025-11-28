<?php
// be/api/rfq/deleterequest.php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\RFQController;

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Preflight (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Bắt buộc dùng DELETE
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode([
        "error" => true,
        "message" => "Chỉ hỗ trợ DELETE"
    ]);
    exit;
}

// Lấy ID từ URL
$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(422);
    echo json_encode([
        "error" => true,
        "message" => "Thiếu hoặc sai ID yêu cầu báo giá"
    ]);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $controller = new RFQController($pdo);

    $deleted = $controller->deleteRFQ($id);

    if (!$deleted) {
        http_response_code(404);
        echo json_encode([
            "error" => true,
            "message" => "Không tìm thấy hoặc không thể xoá yêu cầu"
        ]);
        exit;
    }

    echo json_encode([
        "error" => false,
        "message" => "Xoá yêu cầu báo giá thành công",
        "deleted_id" => $id
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Lỗi máy chủ",
        "detail" => $e->getMessage()
    ]);
}

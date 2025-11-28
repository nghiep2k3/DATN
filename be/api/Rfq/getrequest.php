<?php
// be/api/rfq/getrequest.php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\RFQController;

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

try {
    $pdo = (new Db())->connect();
    $controller = new RFQController($pdo);

    // Nếu có ID → trả về chi tiết
    if (isset($_GET['id']) && trim($_GET['id']) !== '') {
        $id = (int)$_GET['id'];

        if ($id <= 0) {
            echo json_encode([
                "error" => false,
                "data" => null   // sai ID → trả về rỗng
            ]);
            exit;
        }

        $rfq = $controller->getRFQById($id);

        echo json_encode([
            "error" => false,
            "data" => $rfq ? $rfq->toArray() : null  // không tồn tại → null
        ]);
        exit;
    }

    // Nếu không có ID → trả về toàn bộ danh sách
    $list = $controller->getAllRFQ();

    echo json_encode([
        "error" => false,
        "data" => array_map(fn($item) => $item->toArray(), $list)
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Lỗi máy chủ",
        "detail" => $e->getMessage()
    ]);
}

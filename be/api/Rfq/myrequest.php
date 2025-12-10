<?php
// be/api/Rfq/myrequest.php
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

    // Lấy user_id từ query parameter
    if (!isset($_GET['user_id']) || trim($_GET['user_id']) === '') {
        http_response_code(400);
        echo json_encode([
            "error" => true,
            "message" => "user_id là bắt buộc"
        ]);
        exit;
    }

    $userId = (int) $_GET['user_id'];
    
    if ($userId <= 0) {
        echo json_encode([
            "error" => false,
            "data" => []
        ]);
        exit;
    }

    $rfqs = $controller->getRFQByUserId($userId);

    echo json_encode([
        "error" => false,
        "data" => array_map(fn($item) => $item->toArray(), $rfqs)
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Lỗi máy chủ",
        "detail" => $e->getMessage()
    ]);
}
?>

<?php
require __DIR__ . '/../../vendor/autoload.php';
file_put_contents("log_delete.txt", print_r($_SERVER, true));

use Config\Db;
use App\Controllers\CategoriesController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

// ====================
// FIX CORS ĐÚNG 100%
// ====================
// header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
// header("Access-Control-Expose-Headers: Content-Type, Authorization");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    // Cho FE biết được phép gửi DELETE
    http_response_code(204);
    exit;
}
// =====================

// CHỈ CHO PHÉP DELETE
if ($_SERVER["REQUEST_METHOD"] !== "DELETE") {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Method not allowed. Chỉ cho phép DELETE.']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $ctl = new CategoriesController($pdo);

    // Lấy ID từ query string
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu id hoặc id không hợp lệ']);
        exit;
    }

    // XÓA DANH MỤC
    [$code, $payload] = $ctl->delete($id);

    http_response_code($code);
    echo json_encode($payload);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error',
        'detail' => $e->getMessage()
    ]);
}

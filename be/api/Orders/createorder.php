<?php
require __DIR__ . '/../../vendor/autoload.php';
file_put_contents("log_delete.txt", print_r($_SERVER, true));

use Config\Db;
use App\Controllers\OrdersController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $ctl = new OrdersController($pdo);

    // Lấy dữ liệu từ body raw JSON
    $input = file_get_contents("php://input");

    $rawData = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        file_put_contents("json_error_log.txt", $input . "\n", FILE_APPEND);
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'JSON không hợp lệ']);
        exit;
    }


    // Trim keys
    $data = [];
    foreach ($rawData as $key => $value) {
        $data[trim($key)] = $value;
    }

    // Validate required fields
    if (empty($data['full_name']) || empty($data['phone']) || empty($data['shipping_address'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu thông tin bắt buộc: full_name, phone, shipping_address']);
        exit;
    }

    // Tạo đơn hàng
    $result = $ctl->create(
        isset($data['user_id']) ? (int) $data['user_id'] : null,
        $data['full_name'],
        $data['phone'],
        $data['email'] ?? null,
        $data['status'] ?? "Đang lấy hàng",
        isset($data['total_price']) ? (float) $data['total_price'] : null,
        isset($data['product_list'])
        ? json_encode($data['product_list'], JSON_UNESCAPED_UNICODE)
        : null,
        $data['shipping_address'],
        $data['note'] ?? null,
        $data['payment_method'] ?? "Thanh toán QR code",
        $data['contentCk'] ?? null
    );


    if (!$result['error']) {
        http_response_code(201);
        echo json_encode([
            'error' => false,
            'message' => $result['message'],
            'id' => $result['id']
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => $result['message']]);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>
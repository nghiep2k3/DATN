<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\OrdersController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-HTTP-Method-Override');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Hỗ trợ PUT override
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && (($_GET['_method'] ?? null) === 'PUT')) {
    $method = 'PUT';
}
if ($method === 'POST' && (($_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? null) === 'PUT')) {
    $method = 'PUT';
}

if ($method !== 'PUT' && $method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép PUT hoặc POST']);
    exit;
}

// ===== MAIN PROCESS =====
try {

    // Validate ID
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu ID đơn hàng']);
        exit;
    }

    $id = (int) $_GET['id'];

    $pdo = (new Db())->connect();
    $ctl = new OrdersController($pdo);

    // Kiểm tra tồn tại
    if (!$ctl->exists($id)) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Đơn hàng không tồn tại']);
        exit;
    }

    // Lấy raw JSON
    $input = file_get_contents("php://input");
    $rawData = json_decode($input, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        file_put_contents("json_error_update.txt", $input . "\n", FILE_APPEND);
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'JSON không hợp lệ']);
        exit;
    }

    // Trim key – value
    $data = [];
    foreach ($rawData as $key => $value) {
        $data[trim($key)] = $value;
    }

    // Xử lý product_list để tránh lỗi type
    $productList = null;
    if (isset($data['product_list'])) {
        if (is_array($data['product_list'])) {
            $productList = json_encode($data['product_list'], JSON_UNESCAPED_UNICODE);
        } else {
            $productList = $data['product_list']; // string
        }
    }

    // ===== Gọi controller update =====
    $result = $ctl->update(
        $id,
        $data['full_name'] ?? null,
        $data['phone'] ?? null,
        $data['email'] ?? null,
        $data['status'] ?? null,
        isset($data['total_price']) ? (float) $data['total_price'] : null,
        $productList,
        $data['shipping_address'] ?? null,
        $data['note'] ?? null,
        $data['payment_method'] ?? null,
        $data['contentCk'] ?? null
    );

    if (!$result['error']) {
        http_response_code(200);
        echo json_encode([
            'error' => false,
            'message' => $result['message'],
            'data' => ['id' => $id]
        ]);
    } else {
        http_response_code(400);
        echo json_encode(['error' => true, 'message' => $result['message']]);
    }

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Lỗi máy chủ',
        'detail' => $e->getMessage()
    ]);
}
?>
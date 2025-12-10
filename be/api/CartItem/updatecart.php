<?php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Config\Db;
use App\Controllers\CartItemController;

Dotenv::createImmutable(dirname(__DIR__, 2) . '/config')->safeLoad();

/* ---------- CORS & headers ---------- */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-HTTP-Method-Override');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

/* ---------- Chỉ cho phép POST hoặc PUT ---------- */
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST hoặc PUT']);
    exit;
}

// Cho phép override PUT qua POST nếu client gửi _method=PUT hoặc header X-HTTP-Method-Override
if ($method === 'POST') {
    $override = $_POST['_method'] ?? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? null;
    if ($override && strtoupper($override) === 'PUT') {
        $method = 'PUT';
    }
}

try {
    $pdo = (new Db())->connect();
    $ctl = new CartItemController($pdo);

    // Lấy id từ query string
    if (!isset($_GET['id'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu id']);
        exit;
    }

    $id = (int) $_GET['id'];

    // Kiểm tra cart item có tồn tại không
    $cartItem = $ctl->getById($id);
    if (!$cartItem) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Không tìm thấy giỏ hàng']);
        exit;
    }

    // Chỉ hỗ trợ raw JSON
    $input = file_get_contents('php://input');
    $rawData = json_decode($input, true) ?? [];

    // Trim khoảng trắng trong keys
    $data = [];
    foreach ($rawData as $key => $value) {
        $data[trim($key)] = $value;
    }

    // Lấy dữ liệu cập nhật từ POST/PUT
    $quantity = isset($data['quantity']) ? (int)$data['quantity'] : null;
    $phone = isset($data['phone']) ? trim($data['phone']) : null;
    $price = isset($data['price']) ? trim($data['price']) : null;

    // Validation
    if ($quantity !== null && $quantity <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Quantity phải lớn hơn 0']);
        exit;
    }

    if ($phone !== null && $phone === '') {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Phone không được để trống']);
        exit;
    }

    // Cập nhật cart item
    $result = $ctl->update($id, $quantity, $phone, $price);

    if ($result['error']) {
        http_response_code(400);
        echo json_encode($result);
    } else {
        http_response_code(200);
        echo json_encode([
            'error' => false,
            'message' => $result['message'],
            'data' => [
                'id' => $id,
                'quantity' => $quantity,
                'phone' => $phone,
                'price' => $price
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>

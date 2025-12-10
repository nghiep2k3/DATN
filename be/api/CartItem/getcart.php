<?php
require __DIR__ . '/../../vendor/autoload.php';
use Config\Db;
use App\Controllers\CartItemController;

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
    $ctl = new CartItemController($pdo);

    // Nếu có tham số id
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        
        // Kiểm tra id có tồn tại không
        $cartItem = $ctl->getById($id);
        if ($cartItem) {
            http_response_code(200);
            echo json_encode([
                'error' => false,
                'data' => [
                    'id' => $cartItem->id,
                    'user_id' => $cartItem->user_id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'phone' => $cartItem->phone,
                    'price' => $cartItem->price
                ]
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Không tìm thấy giỏ hàng']);
        }
    }
    // Nếu có tham số user_id
    else if (isset($_GET['user_id'])) {
        $user_id = (int) $_GET['user_id'];
        $result = $ctl->getCart($user_id, null);
        
        if (!$result['error'] && !empty($result['data'])) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Không tìm thấy giỏ hàng cho người dùng này']);
        }
    }
    // Nếu có tham số phone
    else if (isset($_GET['phone'])) {
        $phone = $_GET['phone'];
        $result = $ctl->getCart(null, $phone);
        
        if (!$result['error'] && !empty($result['data'])) {
            http_response_code(200);
            echo json_encode($result);
        } else {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Không tìm thấy giỏ hàng cho số điện thoại này']);
        }
    }
    // Nếu không có tham số nào, trả về tất cả
    else {
        $cartItems = $ctl->getAll();
        if (!empty($cartItems)) {
            $cartArray = array_map(fn($item) => [
                'id' => $item->id,
                'user_id' => $item->user_id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'phone' => $item->phone,
                'price' => $item->price
            ], $cartItems);
            
            http_response_code(200);
            echo json_encode([
                'error' => false,
                'data' => $cartArray
            ]);
        } else {
            http_response_code(200);
            echo json_encode([
                'error' => false,
                'data' => [],
                'message' => 'Không có giỏ hàng nào'
            ]);
        }
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>

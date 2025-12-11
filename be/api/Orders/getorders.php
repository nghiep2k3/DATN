<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\OrdersController;

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
    $ctl = new OrdersController($pdo);

    // Lấy theo ID
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        $order = $ctl->getById($id);
        
        if ($order) {
            http_response_code(200);
            echo json_encode([
                'error' => false,
                'data' => $order->toArray()
            ]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Không tìm thấy đơn hàng']);
        }
    }
    // Lấy theo user_id
    else if (isset($_GET['user_id'])) {
        $user_id = (int) $_GET['user_id'];
        $orders = $ctl->getByUserId($user_id);
        
        if (!empty($orders)) {
            http_response_code(200);
            $orderArray = array_map(fn($o) => $o->toArray(), $orders);
            echo json_encode([
                'error' => false,
                'data' => $orderArray
            ]);
        } else {
            http_response_code(200);
            echo json_encode(['error' => false, 'data' => [], 'message' => 'Không tìm thấy đơn hàng']);
        }
    }
    // Lấy theo phone
    else if (isset($_GET['phone'])) {
        $phone = $_GET['phone'];
        $orders = $ctl->getByPhone($phone);
        
        if (!empty($orders)) {
            http_response_code(200);
            $orderArray = array_map(fn($o) => $o->toArray(), $orders);
            echo json_encode([
                'error' => false,
                'data' => $orderArray
            ]);
        } else {
            http_response_code(200);
            echo json_encode(['error' => false, 'data' => [], 'message' => 'Không tìm thấy đơn hàng']);
        }
    }
    // Lấy theo trạng thái
    else if (isset($_GET['status'])) {
        $status = $_GET['status'];
        $orders = $ctl->getByStatus($status);
        
        if (!empty($orders)) {
            http_response_code(200);
            $orderArray = array_map(fn($o) => $o->toArray(), $orders);
            echo json_encode([
                'error' => false,
                'data' => $orderArray
            ]);
        } else {
            http_response_code(200);
            echo json_encode(['error' => false, 'data' => [], 'message' => 'Không tìm thấy đơn hàng']);
        }
    }
    // Lấy tất cả
    else {
        $orders = $ctl->getAll();
        
        if (!empty($orders)) {
            http_response_code(200);
            $orderArray = array_map(fn($o) => $o->toArray(), $orders);
            echo json_encode([
                'error' => false,
                'data' => $orderArray
            ]);
        } else {
            http_response_code(200);
            echo json_encode(['error' => false, 'data' => [], 'message' => 'Không có đơn hàng nào']);
        }
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>

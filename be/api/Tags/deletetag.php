<?php
// be/api/Tags/deletetag.php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
// Nếu dự án của bạn dùng App\Core\DB thì đổi dòng dưới:
use Config\Db;

use App\Controllers\TagsController;

Dotenv::createImmutable(dirname(__DIR__, 2) . '/config')->safeLoad();

/* ---------- CORS & headers ---------- */
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
    // Lấy id từ query (?id=) hoặc JSON body
    $id = null;

    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
    } else {
        $ctype = $_SERVER['CONTENT_TYPE'] ?? '';
        if (stripos($ctype, 'application/json') !== false) {
            $raw = file_get_contents('php://input');
            $payload = json_decode($raw, true) ?: [];
            if (isset($payload['id'])) {
                $id = (int) $payload['id'];
            }
        }
    }

    if (!$id || $id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu hoặc sai id']);
        exit;
    }

    // 👉 Nếu class kết nối là App\Core\DB: $pdo = (new \App\Core\DB())->connect();
    $pdo = (new Db())->connect();
    $ctl = new TagsController($pdo);

    // Kiểm tra tồn tại trước khi xoá
    $existing = $ctl->getTagById($id);
    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Không tìm thấy tag']);
        exit;
    }

    $ok = $ctl->deleteTag($id);
    if (!$ok) {
        // Có thể do ràng buộc FK (tag đang được dùng trong product_tags)
        http_response_code(409);
        echo json_encode(['error' => true, 'message' => 'Không thể xoá tag (có thể đang được sử dụng bởi sản phẩm).']);
        exit;
    }

    http_response_code(200);
    echo json_encode(
        ['error' => false, 'message' => 'Đã xoá tag', 'data' => ['id' => $id]],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    exit;

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error'   => true,
        'message' => 'Lỗi máy chủ',
        'detail'  => $e->getMessage(),
    ]);
    exit;
}

<?php
// be/api/Tags/updatetag.php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
// Nếu dự án bạn dùng App\Core\DB thì đổi dòng dưới:
use Config\Db;

use App\Controllers\TagsController;

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

/* ---------- Chỉ cho phép POST (form) hoặc PUT (JSON) ---------- */
$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'PUT') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST hoặc PUT']);
    exit;
}

// Cho phép override qua _method=PUT hoặc header X-HTTP-Method-Override
if ($method === 'POST') {
    $override = $_POST['_method'] ?? $_SERVER['HTTP_X_HTTP_METHOD_OVERRIDE'] ?? null;
    if ($override && strtoupper($override) === 'PUT') {
        $method = 'PUT';
    }
}

try {
    // 👉 Nếu class kết nối là App\Core\DB: $pdo = (new \App\Core\DB())->connect();
    $pdo = (new Db())->connect();
    $ctl = new TagsController($pdo);

    $id = null;
    $name = null;

    if ($method === 'PUT' && stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
        // PUT + JSON
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?: [];
        $id   = isset($payload['id']) ? (int)$payload['id'] : null;

        // name là tuỳ chọn; nếu không truyền -> giữ nguyên
        if (array_key_exists('name', $payload)) {
            $tmp = trim((string)$payload['name']);
            $name = ($tmp === '') ? null : $tmp; // chống set rỗng
        }
    } else {
        // POST form-data / x-www-form-urlencoded
        $id = isset($_POST['id']) ? (int)$_POST['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : null);

        if (isset($_POST['name'])) {
            $tmp = trim((string)$_POST['name']);
            $name = ($tmp === '') ? null : $tmp; // chống set rỗng
        }
    }

    if (!$id || $id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu hoặc sai id']);
        exit;
    }

    // Cập nhật; nếu name === null -> giữ nguyên
    $tag = $ctl->updateTag($id, $name);

    if (!$tag) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Không tìm thấy tag']);
        exit;
    }

    http_response_code(200);
    echo json_encode(
        ['error' => false, 'message' => 'Cập nhật thành công', 'data' => $tag->toArray()],
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

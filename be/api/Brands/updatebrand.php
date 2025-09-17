<?php
// be/api/Brands/updatebrand.php
declare(strict_types=1);

require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
// Nếu dự án dùng App\Core\DB thì đổi dòng dưới:
use Config\Db;

use App\Controllers\BrandsController;

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

/* ---------- Chỉ cho phép POST (multipart) hoặc PUT ---------- */
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
    // 👉 Nếu class kết nối là App\Core\DB: $pdo = (new \App\Core\DB())->connect();
    $pdo = (new Db())->connect();
    $ctl = new BrandsController($pdo);

    $id = null;
    $name = null;
    $description = null;
    $urlImageText = null; // khi truyền URL chuỗi
    $file = null;         // khi upload file

    if ($method === 'PUT' && stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== false) {
        // Trường hợp PUT + JSON (không upload file)
        $raw = file_get_contents('php://input');
        $payload = json_decode($raw, true) ?: [];

        $id = isset($payload['id']) ? (int)$payload['id'] : null;
        $name = isset($payload['name']) ? trim((string)$payload['name']) : null;
        $description = isset($payload['description']) ? trim((string)$payload['description']) : null;
        // chấp nhận cả urlImage và url_image
        $urlImageText = isset($payload['urlImage']) ? trim((string)$payload['urlImage']) :
                        (isset($payload['url_image']) ? trim((string)$payload['url_image']) : null);

    } else {
        // Trường hợp POST multipart/form-data (khuyến nghị khi có file)
        $id = isset($_POST['id']) ? (int)$_POST['id'] : (isset($_GET['id']) ? (int)$_GET['id'] : null);
        $name = isset($_POST['name']) ? trim((string)$_POST['name']) : null;
        $description = isset($_POST['description']) ? trim((string)$_POST['description']) : null;

        // File có thể ở key url_image hoặc image
        if (!empty($_FILES['url_image']['name'])) {
            $file = $_FILES['url_image'];
        } elseif (!empty($_FILES['image']['name'])) {
            $file = $_FILES['image'];
        }

        // Nếu không upload file nhưng có truyền URL chuỗi
        if (isset($_POST['urlImage'])) {
            $urlImageText = trim((string)$_POST['urlImage']);
        } elseif (isset($_POST['url_image']) && !is_array($_POST['url_image'])) {
            // cẩn thận: tránh đè khi url_image là file
            $urlImageText = trim((string)$_POST['url_image']);
        }
    }

    if (!$id || $id <= 0) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu hoặc sai id']);
        exit;
    }

    // Không bắt buộc truyền tất cả; cái nào không truyền sẽ giữ nguyên (controller đã xử lý)
    $brand = $ctl->updateBrand($id, $name, $description, $file, $urlImageText);

    if (!$brand) {
        http_response_code(404);
        echo json_encode(['error' => true, 'message' => 'Không tìm thấy thương hiệu']);
        exit;
    }

    http_response_code(200);
    echo json_encode(
        ['error' => false, 'message' => 'Cập nhật thành công', 'data' => $brand->toArray()],
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

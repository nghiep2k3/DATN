<?php
require __DIR__ . '/../../vendor/autoload.php';



use Config\Db;
use App\Controllers\CategoriesController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();

    // Nếu là JSON thì đọc body; nếu là form-data thì dùng $_POST
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input) || !empty($_POST)) {
        $input = $_POST;
    }

    // ---- UPLOAD ẢNH (nếu có) ----
    // Trên Postman đặt key field là "image" (type: File)
    if (!empty($_FILES['url_image']) && is_uploaded_file($_FILES['url_image']['tmp_name'])) {
        $file = $_FILES['url_image'];

        // Kiểm tra lỗi upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            http_response_code(400);
            echo json_encode(['error' => true, 'message' => 'Upload ảnh thất bại (error code '.$file['error'].')']);
            exit;
        }

        // Kiểm tra MIME/type & phần mở rộng
        $allowedExt  = ['jpg','jpeg','png','webp','svg'];
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime  = $finfo->file($file['tmp_name']);
        $extByMime = [
            'image/jpeg' => 'jpg',
            'image/png'  => 'png',
            'image/webp' => 'webp',
            'image/svg+xml' => 'svg'
        ];
        $ext = $extByMime[$mime] ?? strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExt, true)) {
            http_response_code(415);
            echo json_encode(['error' => true, 'message' => 'Định dạng ảnh không hợp lệ (chỉ jpg, jpeg, png, webp)']);
            exit;
        }

        // Tạo thư mục be/upload nếu chưa có
        $baseDir   = dirname(__DIR__, 2);        // tới thư mục be/
        $uploadDir = $baseDir . '/upload';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0775, true);
        }

        // Tạo tên file an toàn
        $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $destPath = $uploadDir . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $destPath)) {
            http_response_code(500);
            echo json_encode(['error' => true, 'message' => 'Không thể lưu file lên server']);
            exit;
        }

        // Đường dẫn tương đối để lưu DB (tùy bạn dùng)
        // VD: 'upload/20250918_114259_ab12cd34ef56.jpg'
        $input['url_image'] = 'upload/' . $filename;
    }

    [$code, $payload] = (new CategoriesController($pdo))->create($input);
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

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
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST (form-data)']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $ctl = new CategoriesController($pdo);

    // lấy dữ liệu từ form-data
    $input = $_POST;

    // ID bắt buộc
    if (empty($input['id'])) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu id category']);
        exit;
    }
    $id = (int)$input['id'];

    // ---- xử lý upload ảnh (tùy chọn) ----
    if (!empty($_FILES['url_image']) && is_uploaded_file($_FILES['url_image']['tmp_name'])) {
        $file = $_FILES['url_image'];
        if ($file['error'] === UPLOAD_ERR_OK) {
            $allowed = ['jpg','jpeg','png','webp', 'svg'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (in_array($ext, $allowed)) {
                $uploadDir = dirname(__DIR__, 2) . '/upload';
                if (!is_dir($uploadDir)) mkdir($uploadDir, 0775, true);
                $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
                $dest = $uploadDir . '/' . $filename;
                move_uploaded_file($file['tmp_name'], $dest);

                // gán đường dẫn tương đối
                $input['url_image'] = 'upload/' . $filename;
            }
        }
    }

    [$code, $payload] = $ctl->update($id, $input);
    http_response_code($code);
    echo json_encode($payload);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Server error', 'detail' => $e->getMessage()]);
}

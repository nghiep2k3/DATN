<?php
// be/api/rfq/updaterequest.php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\RFQController;

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "error" => true,
        "message" => "Chỉ chấp nhận POST"
    ]);
    exit;
}

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;
if ($id <= 0) {
    http_response_code(422);
    echo json_encode([
        "error" => true,
        "message" => "Thiếu hoặc sai ID yêu cầu báo giá"
    ]);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $controller = new RFQController($pdo);

    // Lấy RFQ hiện tại
    $existing = $controller->getRFQById($id);
    if (!$existing) {
        echo json_encode([
            "error" => true,
            "message" => "Không tồn tại yêu cầu này"
        ]);
        exit;
    }

    // Map data update
    $data = [
        'full_name' => $_POST['full_name'] ?? null,
        'phone' => $_POST['phone'] ?? null,
        'email' => $_POST['email'] ?? null,

        'product_name' => $_POST['product_name'] ?? null,
        'quantity' => $_POST['quantity'] ?? null,
        'product_list' => $_POST['product_list'] ?? null,

        'notes' => $_POST['notes'] ?? null,
        'budget_range' => $_POST['budget_range'] ?? null,

        'status' => $_POST['status'] ?? null,

        'attachment_url' => null  // xử lý sau
    ];

    // UPLOAD FILE nếu có file mới
    if (!empty($_FILES['attachment']['name'])) {
        $uploadDir = __DIR__ . '/../../upload/';
        if (!is_dir($uploadDir))
            mkdir($uploadDir, 0777, true);

        if ($_FILES['attachment']['error'] === UPLOAD_ERR_OK) {

            $filename = $_FILES['attachment']['name'];
            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $allowed = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'xlsx', 'xls', 'doc', 'docx'];

            if (in_array($ext, $allowed)) {
                $newName = time() . '_' . uniqid() . '.' . $ext;
                $filePath = $uploadDir . $newName;

                if (move_uploaded_file($_FILES['attachment']['tmp_name'], $filePath)) {
                    $data['attachment_url'] = 'upload/' . $newName;
                }
            }
        }
    } else {
        // Không có file mới → giữ file cũ
        $data['attachment_url'] = $existing->attachment_url;
    }

    // Cập nhật DB
    $updated = $controller->updateRFQ($id, $data);

    echo json_encode([
        "error" => false,
        "message" => "Cập nhật yêu cầu báo giá thành công",
        "data" => $updated->toArray()
    ]);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "error" => true,
        "message" => "Lỗi máy chủ",
        "detail" => $e->getMessage()
    ]);
}

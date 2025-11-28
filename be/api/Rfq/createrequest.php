<?php
// be/api/rfq/createrequest.php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\RFQController;

// Load .env
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");

$pdo = (new Db())->connect();
$controller = new RFQController($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Lấy dữ liệu từ POST, chỉ còn các field hợp lệ
    $data = [
        'user_id'        => $_POST['user_id'] ?? null,
        'full_name'      => $_POST['full_name'] ?? null,
        'phone'          => $_POST['phone'] ?? null,
        'email'          => $_POST['email'] ?? null,

        'product_name'   => $_POST['product_name'] ?? null,
        'quantity'       => $_POST['quantity'] ?? null,
        'product_list'   => $_POST['product_list'] ?? null,

        'notes'          => $_POST['notes'] ?? null,
        'budget_range'   => $_POST['budget_range'] ?? null,

        'attachment_url' => null,
    ];

    // Validate bắt buộc
    if (
        empty($data['full_name']) ||
        empty($data['phone']) ||
        empty($data['email'])
    ) {
        http_response_code(400);
        echo json_encode([
            "error" => true,
            "message" => "Thiếu dữ liệu bắt buộc: full_name, phone, email"
        ]);
        exit;
    }

    // ========== UPLOAD FILE ==========

    if (!empty($_FILES['attachment']['name'])) {

        $uploadDir = __DIR__ . '/../../upload/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

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
    }

    // Insert DB qua Controller
    try {
        $result = $controller->createRFQ($data);

        echo json_encode([
            "error" => false,
            "message" => "Tạo yêu cầu báo giá thành công",
            "data" => $result->toArray()
        ]);
        exit;

    } catch (Throwable $e) {
        http_response_code(500);
        echo json_encode([
            "error" => true,
            "message" => "Lỗi máy chủ",
            "detail" => $e->getMessage()
        ]);
        exit;
    }
}

// Nếu không phải POST
http_response_code(405);
echo json_encode([
    "error" => true,
    "message" => "Method không được hỗ trợ, chỉ chấp nhận POST"
]);

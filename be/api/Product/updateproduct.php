<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\ProductController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");

$pdo = (new Db())->connect();
$controller = new ProductController($pdo);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = $_POST['id'] ?? null;
    if (!$id) {
        http_response_code(400);
        echo json_encode(["error" => true, "message" => "Thiếu ID sản phẩm"]);
        exit;
    }

    $data = [
        'name'          => $_POST['name'] ?? null,
        'sku'           => $_POST['sku'] ?? null,
        'description'   => $_POST['description'] ?? null,
        'price'         => $_POST['price'] ?? null,
        'stock_quantity'=> $_POST['stock_quantity'] ?? 0,
        'brand_id'      => $_POST['brand_id'] ?? null,
        'category_id'   => $_POST['category_id'] ?? null,
        'image_url'     => null,
        'images'        => []
    ];

    // Lấy danh sách ảnh cũ (nếu có)
    $existingImages = [];
    if (isset($_POST['existing_images']) && !empty($_POST['existing_images'])) {
        $existingImagesJson = json_decode($_POST['existing_images'], true);
        if (is_array($existingImagesJson)) {
            $existingImages = $existingImagesJson;
        }
    }

    // Xử lý upload ảnh mới (nếu có)
    $uploadedFiles = [];
    if (!empty($_FILES['image']['name'][0])) {
        $uploadDir = __DIR__ . '/../../upload/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        foreach ($_FILES['image']['name'] as $i => $filename) {
            if ($_FILES['image']['error'][$i] !== UPLOAD_ERR_OK) continue;
            if ($_FILES['image']['size'][$i] > 5 * 1024 * 1024) continue;

            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            if (!in_array($ext, $allowed)) continue;

            $fileName = time() . '_' . uniqid() . '.' . $ext;
            $filePath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['image']['tmp_name'][$i], $filePath)) {
                $uploadedFiles[] = '/upload/' . $fileName;
            }
        }
    }

    // Merge ảnh cũ và ảnh mới
    if (!empty($uploadedFiles)) {
        // Có ảnh mới: merge với ảnh cũ (nếu có)
        $data['images'] = array_merge($existingImages, $uploadedFiles);
        $data['image_url'] = $data['images'][0];
    } else if (!empty($existingImages)) {
        // Không có ảnh mới, chỉ giữ lại ảnh cũ
        $data['images'] = $existingImages;
        $data['image_url'] = $existingImages[0];
    }

    // Xử lý upload document files
    $documentLinks = [];
    
    // Lấy document cũ từ POST (nếu có) - đây là danh sách document còn lại sau khi user có thể xóa một số
    if (isset($_POST['document_url']) && !empty($_POST['document_url'])) {
        $docJson = json_decode($_POST['document_url'], true);
        if (is_array($docJson)) {
            $documentLinks = $docJson;
        }
    }
    
    // Xử lý upload document files mới và merge với document cũ
    if (!empty($_FILES['document']['name'][0])) {
        $uploadDir = __DIR__ . '/../../upload/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        foreach ($_FILES['document']['name'] as $i => $filename) {
            if ($_FILES['document']['error'][$i] !== UPLOAD_ERR_OK)
                continue;
            if ($_FILES['document']['size'][$i] > 10 * 1024 * 1024)
                continue; // >10MB bỏ qua

            $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
            $allowed = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'];
            if (!in_array($ext, $allowed))
                continue;

            $fileName = time() . '_' . uniqid() . '.' . $ext;
            $filePath = $uploadDir . $fileName;

            if (move_uploaded_file($_FILES['document']['tmp_name'][$i], $filePath)) {
                $documentLinks[] = ['link' => '/upload/' . $fileName];
            }
        }
    }

    // Luôn set document_url (kể cả khi rỗng để xóa tất cả document)
    // Frontend sẽ gửi document_url với danh sách document còn lại (sau khi user có thể xóa)
    // Backend sẽ merge với document mới upload (nếu có)
    $data['document_url'] = !empty($documentLinks) 
        ? json_encode($documentLinks, JSON_UNESCAPED_UNICODE) 
        : null;

    $result = $controller->update((int)$id, $data);
    echo json_encode($result);
    exit;
}

http_response_code(405);
echo json_encode(["error" => true, "message" => "Method không được hỗ trợ"]);

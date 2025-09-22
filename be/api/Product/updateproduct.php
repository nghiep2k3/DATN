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

    // xử lý upload ảnh mới (nếu có)
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

    if (!empty($uploadedFiles)) {
        $data['image_url'] = $uploadedFiles[0];
        $data['images'] = $uploadedFiles;
    }

    $result = $controller->update((int)$id, $data);
    echo json_encode($result);
    exit;
}

http_response_code(405);
echo json_encode(["error" => true, "message" => "Method không được hỗ trợ"]);

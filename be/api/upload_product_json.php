<?php
// File: be/api/upload_product_json.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Nhận dữ liệu JSON từ frontend
$data = file_get_contents("php://input");
if (!$data) {
    echo json_encode(["error" => true, "message" => "Không nhận được dữ liệu"]);
    exit;
}

// Đường dẫn lưu file JSON vào thư mục be/search/
$dir = __DIR__ . '/../search';
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}
$filePath = $dir . '/product.json';

if (file_put_contents($filePath, $data)) {
    echo json_encode(["error" => false, "message" => "Đã lưu file product.json thành công"]);
} else {
    echo json_encode(["error" => true, "message" => "Không thể ghi file product.json"]);
}

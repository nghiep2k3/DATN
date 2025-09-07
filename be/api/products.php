<?php
// api/products.php

// đảm bảo autoload + db + .env luôn được nạp
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../config/db.php';

Dotenv\Dotenv::createImmutable(__DIR__ . '/../config')->safeLoad();

use App\Controllers\ProductController;
use Config\db;

// Kết nối DB
$pdo = (new db())->connect();
$controller = new ProductController($pdo);

// Nếu có id → chi tiết; ngược lại → danh sách
if (isset($_GET['id'])) {
    $controller->show((int)$_GET['id']);
} else {
    $controller->getData();
}

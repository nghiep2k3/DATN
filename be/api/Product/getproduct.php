<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Config\Db;
use App\Controllers\ProductController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header("Content-Type: application/json; charset=UTF-8");

$pdo = (new Db())->connect();
$controller = new ProductController($pdo);

// Nếu có ?id= thì lấy chi tiết, ngược lại lấy tất cả
if (isset($_GET['id'])) {
    $result = $controller->getById((int)$_GET['id']);
    echo json_encode($result);
    exit;
}

$result = $controller->getAll();
echo json_encode($result);

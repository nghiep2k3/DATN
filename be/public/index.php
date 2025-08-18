<?php

use App\Core\db;

require dirname(__DIR__).'/vendor/autoload.php';

require __DIR__ . '/../config/db.php';


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
$dotenv->safeLoad();

// Gọi DB như cũ
echo "Đang khởi tạo kết nối cơ sở dữ liệu...<br>";
$db = new db();
$conn = $db->connect();

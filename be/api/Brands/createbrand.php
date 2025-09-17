<?php
require dirname(__DIR__, 2) . '/vendor/autoload.php';

use Dotenv\Dotenv;
use Config\Db; // hoặc App\Core\DB tuỳ dự án
use App\Controllers\BrandsController;

Dotenv::createImmutable(dirname(__DIR__, 2) . '/config')->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>true,'message'=>'Chỉ cho phép POST']); exit; }

try {
    $pdo = (new Db())->connect();
    $ctl = new BrandsController($pdo);

    $name = trim($_POST['name'] ?? '');
    if ($name === '') { http_response_code(422); echo json_encode(['error'=>true,'message'=>'Thiếu name']); exit; }

    $desc = trim($_POST['description'] ?? null) ?: null;
    $file = $_FILES['url_image'] ?? ($_FILES['image'] ?? null);

    $brand = $ctl->createBrand($name, $desc, $file);

    http_response_code(201);
    echo json_encode(['error'=>false,'data'=>$brand->toArray()], JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error'=>true,'message'=>'Lỗi máy chủ','detail'=>$e->getMessage()]);
}

<?php
// be/api/Tags/createtag.php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\TagsController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép GET']);
    exit;
}
try {
    $pdo = (new Db())->connect();
    $ctl = new TagsController($pdo);
    $input = json_decode(file_get_contents('php://input'), true);
    if (!isset($input['name']) || empty(trim($input['name']))) {
        http_response_code(422);
        echo json_encode(['error' => true, 'message' => 'Thiếu tên thẻ']);
        exit;
    }
    $name = trim($input['name']);
    $newTag = $ctl->createTag($name);
    http_response_code(201);
    echo json_encode(['data' => $newTag->toArray()]);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}
?>
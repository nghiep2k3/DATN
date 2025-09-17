<?php
// be/api/Tags/gettags.php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\TagsController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép GET']);
    exit;
}
try {
    $pdo = (new Db())->connect();
    $ctl = new TagsController($pdo);
    if (isset($_GET['id'])) {
        $id = (int) $_GET['id'];
        $tag = $ctl->getTagById($id);
        if ($tag) {
            http_response_code(200);
            echo json_encode(['data' => $tag->toArray()]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => true, 'message' => 'Không tìm thấy thẻ']);
        }
    } else {
        $tags = $ctl->getAllTags();
        $tagsArray = array_map(fn($t) => $t->toArray(), $tags);
        http_response_code(200);
        echo json_encode(['data' => $tagsArray]);
    }
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => 'Lỗi máy chủ', 'detail' => $e->getMessage()]);
}


?>
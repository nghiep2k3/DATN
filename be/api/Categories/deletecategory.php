<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CategoriesController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') { http_response_code(204); exit; }
if (!in_array($method, ['DELETE','POST'], true)) {
    http_response_code(405);
    echo json_encode(['error'=>true,'message'=>'Chỉ cho phép DELETE hoặc POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $ctl = new CategoriesController($pdo);

    $id = 0;
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
    } else {
        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);
        if (!is_array($input)) { $input = $_POST; }
        $id = (int)($input['id'] ?? 0);
    }

    if ($id <= 0) { http_response_code(422); echo json_encode(['error'=>true,'message'=>'Thiếu id']); exit; }

    [$code,$payload] = $ctl->delete($id);
    http_response_code($code);
    echo json_encode($payload);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error'=>true,'message'=>'Server error','detail'=>$e->getMessage()]);
}

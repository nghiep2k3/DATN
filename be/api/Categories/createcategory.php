<?php
require __DIR__ . '/../../vendor/autoload.php';

use Config\Db;
use App\Controllers\CategoriesController;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../../config');
$dotenv->safeLoad();

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

try {
    $pdo = (new Db())->connect();

    // Nhận JSON hoặc form
    $raw = file_get_contents('php://input');
    $input = json_decode($raw, true);
    if (!is_array($input)) { $input = $_POST; }

    [$code, $payload] = (new CategoriesController($pdo))->create($input);
    http_response_code($code);
    echo json_encode($payload);

} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => true,
        'message' => 'Server error',
        'detail' => $e->getMessage()
    ]);
}

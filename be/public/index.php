<?php
// Front controller

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../config/db.php';

// Load .env
Dotenv\Dotenv::createImmutable(__DIR__ . '/../config')->safeLoad();

// CORS preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Lấy URI gốc và chuẩn hoá base path (ví dụ /datn/be/public)
$rawUri = strtok($_SERVER['REQUEST_URI'] ?? '/', '?') ?: '/';
$base   = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? ''), '/\\'); // /datn/be/public
// Cắt base khỏi URI để lấy route thuần như /api/products
$path   = '/' . ltrim(preg_replace('#^' . preg_quote($base, '#') . '#', '', $rawUri), '/');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Routes
if ($method === 'GET' && preg_match('#^/api/products/?$#', $path)) {
    require __DIR__ . '/../api/products.php';
    exit;
}

if ($method === 'GET' && preg_match('#^/api/products/(\d+)$#', $path, $m)) {
    $_GET['id'] = (int)$m[1];
    require __DIR__ . '/../api/products.php';
    exit;
}

// 404
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error'=>true,'message'=>'Not Found'], JSON_UNESCAPED_UNICODE);

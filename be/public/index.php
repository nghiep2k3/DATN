<?php
// File: be/public/index.php
require dirname(__DIR__) . '/vendor/autoload.php';

use App\Core\Db;
use App\Router\Router;
use App\Controllers\AuthController;

$dotenv = Dotenv\Dotenv::createImmutable(dirname(__DIR__) . '/config');
$dotenv->safeLoad();

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$pdo = (new Db())->connect();
$router = new Router();

// Đăng nhập
$router->post('/api/login', function() use ($pdo) {
    (new AuthController($pdo))->login();
});

// Chạy router
$router->dispatch($_SERVER['REQUEST_METHOD'], $_SERVER['REQUEST_URI']);

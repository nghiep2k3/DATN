<?php
require __DIR__ . '/../vendor/autoload.php';


use App\Core\Db;
use App\Models\User;

// Load biến môi trường
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../config');
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
    echo json_encode(['error' => true, 'message' => 'Chỉ cho phép POST']);
    exit;
}

// Lấy dữ liệu input
$input = json_decode(file_get_contents('php://input'), true) ?? $_POST ?? [];
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';


if ($email === '' || $password === '') {
    http_response_code(422);
    echo json_encode(['error' => true, 'message' => 'Email và mật khẩu là bắt buộc']);
    exit;
}

try {
    $pdo = (new Db())->connect();
    $userModel = new User($pdo);
    $user = $userModel->findByEmail($email);

    if (!$user || !password_verify($password, $user['password'])) {
        echo "111" . $email . "<br>";
echo "111" . $password . "<br>";
echo password_hash("123456", PASSWORD_BCRYPT);
        http_response_code(401);
        echo json_encode(['error' => true, 'message' => 'Sai email hoặc mật khẩu']);
        exit;
    }

    echo json_encode([
        'error' => false,
        'message' => 'Đăng nhập thành công',
        'user' => [
            'id'    => (int)$user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'phone' => $user['phone'],
            'role'  => $user['role'],
        ]
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}

<?php
// File: be/app/Controllers/AuthController.php
namespace App\Controllers;

use App\Models\User;
use PDO;

class AuthController {
    private PDO $pdo;
    public function __construct(PDO $pdo) { $this->pdo = $pdo; }

    public function login(): void {
        header('Content-Type: application/json; charset=utf-8');

        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST ?? [];
        $email = trim($input['email'] ?? '');
        $password = (string)($input['password'] ?? '');

        if ($email === '' || $password === '') {
            http_response_code(422);
            echo json_encode(['error' => true, 'message' => 'Email và mật khẩu là bắt buộc.']);
            return;
        }

        $userModel = new User($this->pdo);
        $user = $userModel->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            http_response_code(401);
            echo json_encode(['error' => true, 'message' => 'Sai email hoặc mật khẩu.']);
            return;
        }

        // Không JWT, chỉ trả thông tin user
        echo json_encode([
            'error' => false,
            'message' => 'Đăng nhập thành công.',
            'user' => [
                'id' => (int)$user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'phone' => $user['phone'],
                'role' => $user['role']
            ]
        ]);
    }
}

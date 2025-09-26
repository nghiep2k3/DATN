<?php
// File: be/app/Controllers/AuthController.php
// Xử lý đăng nhập, đăng xuất, quản lý phiên... câu lệnh SQL ở đây
namespace App\Controllers;

use App\Models\User;
use Config\Mailer;
use PDO;

class AuthController
{
    private PDO $pdo;
    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    /** Kiểm tra email đã tồn tại */
    private function emailExists(string $email): bool
    {
        $stm = $this->pdo->prepare("SELECT 1 FROM users WHERE email = :email LIMIT 1");
        $stm->execute(['email' => $email]);
        return (bool) $stm->fetchColumn();
    }

    /** Tìm user theo email (SQL ở Controller) */
    private function findUserByEmail(string $email): ?User
    {
        // Dùng đúng tên bảng users theo schema (MySQL trên Windows không phân biệt hoa thường, nhưng nên khớp) 
        $sql = "SELECT id, name, email, password, phone, role,
                   veryfied_account, verification_code, verification_expires_at, created_at
            FROM users
            WHERE email = :email
            LIMIT 1";
        $stm = $this->pdo->prepare($sql);
        $stm->execute(['email' => $email]);
        $row = $stm->fetch(PDO::FETCH_ASSOC);
        return $row ? User::fromArray($row) : null;
    }

    /** Tìm user theo email (SQL ở Model) */
    private function findByEmail(string $email): ?User
    {
        $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stm = $this->pdo->prepare($sql);
        $stm->execute(['email' => $email]);
        $row = $stm->fetch(PDO::FETCH_ASSOC);
        return $row ? User::fromArray($row) : null;
    }

    /** Gửi mã xác minh 6 số tới email */
    public function sendVerification(array $input): array
    {
        $email = trim($input['email'] ?? '');
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [422, ['error' => true, 'message' => 'Email không hợp lệ.']];
        }

        $user = $this->findByEmail($email);
        if (!$user) {
            return [404, ['error' => true, 'message' => 'Không tìm thấy người dùng.']];
        }

        if ((int) $user->veryfied_account === 1) {
            return [200, ['error' => false, 'message' => 'Tài khoản đã xác thực trước đó.']];
        }

        // Tạo mã 6 số + hash + hạn
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $hash = password_hash($code, PASSWORD_BCRYPT);
        $ttlMinutes = (int) ($_ENV['VERIFY_CODE_TTL'] ?? 10);
        $expiresAt = date('Y-m-d H:i:s', time() + $ttlMinutes * 60);

        // Lưu DB
        $upd = $this->pdo->prepare(
            "UPDATE users SET verification_code = :code, verification_expires_at = :exp WHERE id = :id"
        );
        $upd->execute(['code' => $hash, 'exp' => $expiresAt, 'id' => $user->id]);

        // Gửi mail
        $subject = 'Mã xác minh tài khoản';
        $html = "<p>Xin chào {$user->name}!</p>
                 <p>Mã xác minh của bạn là: <b style='font-size:18px'>{$code}</b></p>
                 <p>Mã có hiệu lực trong {$ttlMinutes} phút.</p>";
        // $ok = Mailer::send($user->email, $user->name ?? '', $subject, $html);
        list($ok, $errorInfo) = Mailer::send($user->email, $user->name ?? '', $subject, $html);

        if (!$ok) {
            return [500, ['error' => true, 'message' => 'Gửi email thất bại', 'detail' => $errorInfo]];
        }
        return [200, ['error' => false, 'message' => 'Đã gửi mã xác minh tới email.']];
    }

    /** Xác minh tài khoản từ mã 6 số */
    public function verifyAccount(array $input): array
    {
        $email = trim($input['email'] ?? '');
        $code = trim($input['code'] ?? '');

        if ($email === '' || $code === '') {
            return [422, ['error' => true, 'message' => 'Thiếu email hoặc mã xác minh.']];
        }

        $user = $this->findByEmail($email);
        if (!$user) {
            return [404, ['error' => true, 'message' => 'Không tìm thấy người dùng.']];
        }

        if ((int) $user->veryfied_account === 1) {
            return [200, ['error' => false, 'message' => 'Tài khoản đã xác thực.']];
        }

        if (empty($user->verification_code) || empty($user->verification_expires_at)) {
            return [400, ['error' => true, 'message' => 'Chưa yêu cầu gửi mã hoặc mã không hợp lệ.']];
        }

        if (strtotime($user->verification_expires_at) < time()) {
            return [410, ['error' => true, 'message' => 'Mã đã hết hạn. Hãy yêu cầu gửi lại.']];
        }

        // So sánh mã
        if (!password_verify($code, $user->verification_code)) {
            return [401, ['error' => true, 'message' => 'Mã xác minh không đúng.']];
        }

        // Đánh dấu đã xác thực + xoá mã
        $done = $this->pdo->prepare(
            "UPDATE users 
             SET veryfied_account = 1, verification_code = NULL, verification_expires_at = NULL 
             WHERE id = :id"
        );
        $done->execute(['id' => $user->id]);

        return [200, ['error' => false, 'message' => 'Xác thực tài khoản thành công.']];
    }

    /** Hỗ trợ kiểm mật khẩu (ưu tiên hash; fallback plaintext cho dữ liệu cũ) */
    private function verifyPassword(string $plain, string $stored): bool
    {
        // Nếu $stored trông giống bcrypt/argon..., dùng password_verify
        $isHashLike = str_starts_with($stored, '$2y$') || str_starts_with($stored, '$argon2');
        if ($isHashLike) {
            return password_verify($plain, $stored);
        }
        // Dữ liệu cũ còn plaintext trong DB
        return hash_equals($stored, $plain);
    }

    /** Xử lý đăng nhập */
    public function login(array $input): array
    {
        $email = trim($input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');

        if ($email === '' || $password === '') {
            return [422, ['error' => true, 'message' => 'Email và mật khẩu là bắt buộc.']];
        }

        $user = $this->findUserByEmail($email);
        if (!$user || !$this->verifyPassword($password, $user->password)) {
            return [401, ['error' => true, 'message' => 'Sai email hoặc mật khẩu.']];
        }

        return [
            200,
            [
                'error' => false,
                'message' => 'Đăng nhập thành công.',
                'user' => $user->toPublicArray(),
            ]
        ];
    }

    /* ---------- REGISTER (đã gộp) ---------- */
    public function register(array $input): array
    {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $password = (string) ($input['password'] ?? '');
        $confirm = (string) ($input['confirm_password'] ?? $password);
        $phone = trim($input['phone'] ?? '');
        $role = $input['role'] ?? 'user';

        // Validate cơ bản
        if ($name === '' || $email === '' || $password === '') {
            return [422, ['error' => true, 'message' => 'Tên, email và mật khẩu là bắt buộc.']];
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [422, ['error' => true, 'message' => 'Email không hợp lệ.']];
        }
        if (strlen($password) < 6) {
            return [422, ['error' => true, 'message' => 'Mật khẩu tối thiểu 6 ký tự.']];
        }
        if ($password !== $confirm) {
            return [422, ['error' => true, 'message' => 'Xác nhận mật khẩu không khớp.']];
        }

        // Check trùng email (ở app-level). Có thể bỏ đoạn này nếu bạn đã UNIQUE(email) và dùng try/catch ở dưới.
        $exists = $this->pdo->prepare("SELECT 1 FROM users WHERE email = :email LIMIT 1");
        $exists->execute(['email' => $email]);
        if ($exists->fetchColumn()) {
            return [409, ['error' => true, 'message' => 'Email đã tồn tại.']];
        }

        // Insert trực tiếp + hash mật khẩu
        $sql = "INSERT INTO users (name, email, password, phone, role, created_at)
                VALUES (:name, :email, :password, :phone, :role, NOW())";
        $stm = $this->pdo->prepare($sql);
        $stm->execute([
            'name' => $name,
            'email' => $email,
            'password' => password_hash($password, PASSWORD_BCRYPT),
            'phone' => $phone ?: null,
            'role' => $role ?: 'user',
        ]);

        // Lấy lại user vừa tạo (hoặc bạn có thể trả ngay id + dữ liệu input)
        $id = (int) $this->pdo->lastInsertId();
        $stm = $this->pdo->prepare("SELECT * FROM users WHERE id = :id");
        $stm->execute(['id' => $id]);
        $row = $stm->fetch(PDO::FETCH_ASSOC);
        $user = User::fromArray($row);

        return [
            201,
            [
                'error' => false,
                'message' => 'Đăng ký thành công.',
                'user' => $user->toPublicArray(),
            ]
        ];
    }
}

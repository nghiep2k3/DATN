<?php
// File: be/app/Controllers/AuthController.php
// Xử lý đăng nhập, đăng xuất, quản lý phiên... câu lệnh SQL ở đây
namespace App\Controllers;

use App\Models\User;
use Config\Mailer;
use PDO;
use PDOException;

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
            return [422, ['error' => true, 'message' => 'Email không hợp lệ']];
        }

        // tìm user
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return [404, ['error' => true, 'message' => 'Không tìm thấy người dùng']];
        }

        $user = new User($row);

        if ((int) $user->veryfied_account === 1) {
            return [200, ['error' => false, 'message' => 'Tài khoản đã xác thực trước đó']];
        }

        // Tạo mã 6 số
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $hash = password_hash($code, PASSWORD_BCRYPT);

        // TTL phút
        $ttlMinutes = (int) ($_ENV['VERIFY_CODE_TTL'] ?? 10);
        $expiresAt = date('Y-m-d H:i:s', time() + $ttlMinutes * 60);

        // cập nhật DB
        $upd = $this->pdo->prepare("
        UPDATE users 
        SET verification_code = :code, verification_expires_at = :exp 
        WHERE id = :id
    ");
        $upd->execute([
            'code' => $hash,
            'exp' => $expiresAt,
            'id' => $user->id
        ]);

        // gửi mail
        $subject = 'Mã xác minh tài khoản';
        $html = "
        <p>Xin chào {$user->name}!</p>
        <p>Mã xác minh của bạn là: <b style='font-size:18px'>{$code}</b></p>
        <p>Mã có hiệu lực trong {$ttlMinutes} phút.</p>
    ";
        [$ok, $errorInfo] = Mailer::send($user->email, $user->name ?? '', $subject, $html);

        if (!$ok) {
            return [500, ['error' => true, 'message' => 'Gửi email thất bại', 'detail' => $errorInfo]];
        }

        return [200, ['error' => false, 'message' => 'Đã gửi mã xác minh tới email']];
    }



    /** Xác minh account */
    public function verifyAccount(string $email, string $code): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return ["error" => true, "message" => "Không tìm thấy user"];
        }

        if ((int) $user['veryfied_account'] === 1) {
            return ["error" => false, "message" => "Tài khoản đã được xác minh"];
        }

        if ($user['verification_code'] !== $code) {
            return ["error" => true, "message" => "Mã xác minh không đúng"];
        }

        if (strtotime($user['verification_expires_at']) < time()) {
            return ["error" => true, "message" => "Mã xác minh đã hết hạn"];
        }

        $this->pdo->prepare("UPDATE users SET veryfied_account = 1, verification_code = NULL, verification_expires_at = NULL WHERE id = :id")
            ->execute(['id' => $user['id']]);

        return ["error" => false, "message" => "Xác minh tài khoản thành công"];
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
    /** Đăng nhập */
    public function login(string $email, string $password): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return ["error" => true, "message" => "Sai email hoặc mật khẩu"];
        }

        if (!password_verify($password, $row['password'])) {
            return ["error" => true, "message" => "Sai email hoặc mật khẩu"];
        }

        if ((int) $row['veryfied_account'] === 0) {
            return ["error" => true, "message" => "Tài khoản chưa được xác minh"];
        }

        $user = User::fromArray($row);
        return ["error" => false, "message" => "Đăng nhập thành công", "user" => $user->toPublicArray()];
    }

    /* ---------- REGISTER (đã gộp) ---------- */
    /** Đăng ký user mới (chưa kích hoạt) */
    public function register(string $name, string $email, string $password, ?string $phone = null): array
    {
        try {
            // check email tồn tại chưa
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            if ($stmt->fetch()) {
                return ["error" => true, "message" => "Email đã tồn tại"];
            }

            $hash = password_hash($password, PASSWORD_BCRYPT);
            $code = bin2hex(random_bytes(3)); // 6 ký tự ngẫu nhiên
            $expiresAt = date("Y-m-d H:i:s", strtotime("+15 minutes"));

            $stmt = $this->pdo->prepare("
                INSERT INTO users (name, email, password, phone, role, veryfied_account, verification_code, verification_expires_at, created_at) 
                VALUES (:name, :email, :password, :phone, 'user', 0, :code, :expires, NOW())
            ");
            $stmt->execute([
                'name' => $name,
                'email' => $email,
                'password' => $hash,
                'phone' => $phone,
                'code' => $code,
                'expires' => $expiresAt
            ]);

            // có thể gửi mail ở đây qua Mailer::send(...)
            return [
                "error" => false,
                "message" => "Đăng ký thành công. Vui lòng kiểm tra email để xác minh.",
                "verification_code" => $code
            ];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }
}

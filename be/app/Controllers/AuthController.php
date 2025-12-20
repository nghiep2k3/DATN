<?php
// File: be/app/Controllers/AuthController.php

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
                   verified_account, verification_code, verification_expires_at, created_at
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

        $user = User::fromArray($row);


        if ((int) $user->verified_account === 1) {
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

        if ((int) $user['verified_account'] === 1) {
            return ["error" => false, "message" => "Tài khoản đã được xác minh"];
        }

        if ($user['verification_code'] !== $code) {
            return ["error" => true, "message" => "Mã xác minh không đúng"];
        }

        if (strtotime($user['verification_expires_at']) < time()) {
            return ["error" => true, "message" => "Mã xác minh đã hết hạn"];
        }

        $this->pdo->prepare("UPDATE users SET verified_account = 1, verification_code = NULL, verification_expires_at = NULL WHERE id = :id")
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

        if ((int) $row['verified_account'] === 0) {
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
            // Kiểm tra email tồn tại
            $stmt = $this->pdo->prepare("SELECT id FROM users WHERE email = :email");
            $stmt->execute(['email' => $email]);
            if ($stmt->fetch()) {
                return ["error" => true, "message" => "Email đã tồn tại"];
            }

            // Mã hoá mật khẩu
            $hash = password_hash($password, PASSWORD_BCRYPT);

            // Tạo user mới (chưa xác minh)
            $stmt = $this->pdo->prepare("
            INSERT INTO users (name, email, password, phone, role, verified_account, created_at)
            VALUES (:name, :email, :password, :phone, 'user', 0, NOW())
        ");
            $stmt->execute([
                'name' => $name,
                'email' => $email,
                'password' => $hash,
                'phone' => $phone,
            ]);

            // Sau khi insert, gọi sendVerification để gửi mã xác minh
            [$code, $payload] = $this->sendVerification(['email' => $email]);

            // Nếu gửi mail lỗi
            if ($code !== 200) {
                return ["error" => true, "message" => "Tạo tài khoản thành công nhưng gửi email thất bại", "detail" => $payload];
            }

            // Thành công
            return [
                "error" => false,
                "message" => "Đăng ký thành công. Vui lòng kiểm tra email để xác minh tài khoản.",
                "email" => $email
            ];

        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    /* =======================================================
   ========== QUÊN MẬT KHẨU / ĐẶT LẠI MẬT KHẨU ===========
   ======================================================= */

    /** 1️⃣ Gửi mã khôi phục mật khẩu tới email */
    public function requestPasswordReset(string $email): array
    {
        if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return ["error" => true, "message" => "Email không hợp lệ"];
        }

        // Tìm user theo email
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return ["error" => true, "message" => "Không tìm thấy tài khoản với email này"];
        }

        // Tạo mã 6 số
        $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        $hash = password_hash($code, PASSWORD_BCRYPT);
        $ttlMinutes = 10;
        $expiresAt = date('Y-m-d H:i:s', time() + $ttlMinutes * 60);

        // Cập nhật DB
        $upd = $this->pdo->prepare("
            UPDATE users 
            SET verification_code = :code, verification_expires_at = :exp 
            WHERE id = :id
        ");
        $upd->execute([
            'code' => $hash,
            'exp' => $expiresAt,
            'id' => $user['id']
        ]);

        // Gửi email
        $subject = "Khôi phục mật khẩu - Tecotec Store";
        $html = "
            <p>Xin chào <b>{$user['name']}</b>,</p>
            <p>Bạn vừa yêu cầu khôi phục mật khẩu.</p>
            <p>Mã khôi phục của bạn là: <b style='font-size:18px;color:#ff6600'>{$code}</b></p>
            <p>Mã có hiệu lực trong {$ttlMinutes} phút.</p>
            <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        ";

        [$ok, $errorInfo] = Mailer::send($user['email'], $user['name'], $subject, $html);
        if (!$ok) {
            return ["error" => true, "message" => "Gửi email thất bại", "detail" => $errorInfo];
        }

        return ["error" => false, "message" => "Đã gửi mã khôi phục mật khẩu tới email"];
    }

    /** 2️⃣ Đặt lại mật khẩu bằng mã đã gửi */
    public function resetPassword(string $email, string $code, string $newPassword): array
    {
        if ($email === '' || $code === '' || $newPassword === '') {
            return ["error" => true, "message" => "Thiếu thông tin email, mã hoặc mật khẩu mới"];
        }

        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return ["error" => true, "message" => "Không tìm thấy tài khoản"];
        }

        if (empty($user['verification_code']) || strtotime($user['verification_expires_at']) < time()) {
            return ["error" => true, "message" => "Mã xác minh đã hết hạn, vui lòng yêu cầu mã mới"];
        }

        if (!password_verify($code, $user['verification_code'])) {
            return ["error" => true, "message" => "Mã xác minh không chính xác"];
        }

        // Hash mật khẩu mới
        $hashed = password_hash($newPassword, PASSWORD_BCRYPT);

        // Cập nhật lại mật khẩu và xoá mã
        $upd = $this->pdo->prepare("
            UPDATE users 
            SET password = :pass, 
                verification_code = NULL, 
                verification_expires_at = NULL,
                verified_account = 1
            WHERE id = :id
        ");
        $upd->execute([
            'pass' => $hashed,
            'id' => $user['id']
        ]);

        return ["error" => false, "message" => "Đặt lại mật khẩu thành công"];
    }

    /* =======================================================
   ========== CRUD USERS (Admin) ===========
   ======================================================= */

    /** Lấy tất cả users */
    public function getAllUsers(): array
    {
        $stmt = $this->pdo->query("SELECT * FROM users ORDER BY created_at DESC");
        $users = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $users[] = User::fromArray($row);
        }
        return $users;
    }

    /** Lấy user theo ID */
    public function getUserById(int $id): ?User
    {
        $stmt = $this->pdo->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? User::fromArray($row) : null;
    }

    /** Admin tạo user mới (không cần xác minh) */
    public function createUserByAdmin(string $name, string $email, string $password, ?string $phone = null, ?string $role = 'user'): array
    {
        try {
            // Kiểm tra email đã tồn tại
            if ($this->emailExists($email)) {
                return ["error" => true, "message" => "Email đã tồn tại"];
            }

            // Validate email
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return ["error" => true, "message" => "Email không hợp lệ"];
            }

            // Hash mật khẩu
            $hash = password_hash($password, PASSWORD_BCRYPT);

            // Tạo user mới (đã xác minh sẵn vì admin tạo)
            $stmt = $this->pdo->prepare("
                INSERT INTO users (name, email, password, phone, role, verified_account, created_at)
                VALUES (:name, :email, :password, :phone, :role, 1, NOW())
            ");
            $stmt->execute([
                'name' => $name,
                'email' => $email,
                'password' => $hash,
                'phone' => $phone,
                'role' => $role
            ]);

            $userId = (int) $this->pdo->lastInsertId();
            $user = $this->getUserById($userId);

            return [
                "error" => false,
                "message" => "Tạo user thành công",
                "data" => $user->toPublicArray()
            ];

        } catch (PDOException $e) {
            return ["error" => true, "message" => "Lỗi: " . $e->getMessage()];
        }
    }

    /** Cập nhật thông tin user */
    public function updateUser(
        int $id,
        ?string $name = null,
        ?string $email = null,
        ?string $phone = null,
        ?string $role = null,
        ?string $password = null
    ): array {
        try {
            // Kiểm tra user có tồn tại không
            $existing = $this->getUserById($id);
            if (!$existing) {
                return ["error" => true, "message" => "Không tìm thấy user"];
            }

            // Nếu cập nhật email, kiểm tra email mới có trùng không
            if ($email !== null && $email !== $existing->email) {
                if ($this->emailExists($email)) {
                    return ["error" => true, "message" => "Email đã tồn tại"];
                }
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    return ["error" => true, "message" => "Email không hợp lệ"];
                }
            }

            // Build câu UPDATE động
            $fields = [];
            $params = [':id' => $id];

            if ($name !== null) {
                $fields[] = 'name = :name';
                $params[':name'] = $name;
            }
            if ($email !== null) {
                $fields[] = 'email = :email';
                $params[':email'] = $email;
            }
            if ($phone !== null) {
                $fields[] = 'phone = :phone';
                $params[':phone'] = $phone;
            }
            if ($role !== null) {
                $fields[] = 'role = :role';
                $params[':role'] = $role;
            }
            if ($password !== null && $password !== '') {
                $fields[] = 'password = :password';
                $params[':password'] = password_hash($password, PASSWORD_BCRYPT);
            }

            // Không có gì để cập nhật
            if (empty($fields)) {
                return [
                    "error" => false,
                    "message" => "Không có thay đổi nào",
                    "data" => $existing->toPublicArray()
                ];
            }

            $sql = 'UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = :id';
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);

            // Lấy user đã cập nhật
            $updated = $this->getUserById($id);

            return [
                "error" => false,
                "message" => "Cập nhật user thành công",
                "data" => $updated->toPublicArray()
            ];

        } catch (PDOException $e) {
            return ["error" => true, "message" => "Lỗi: " . $e->getMessage()];
        }
    }

    /** Xóa user */
    public function deleteUser(int $id): array
    {
        try {
            // Kiểm tra user có tồn tại không
            $user = $this->getUserById($id);
            if (!$user) {
                return ["error" => true, "message" => "Không tìm thấy user"];
            }

            // Xóa user
            $stmt = $this->pdo->prepare("DELETE FROM users WHERE id = :id");
            $stmt->execute(['id' => $id]);

            if ($stmt->rowCount() > 0) {
                return ["error" => false, "message" => "Xóa user thành công"];
            } else {
                return ["error" => true, "message" => "Không thể xóa user"];
            }

        } catch (PDOException $e) {
            return ["error" => true, "message" => "Lỗi: " . $e->getMessage()];
        }
    }

}

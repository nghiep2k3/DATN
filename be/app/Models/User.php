<?php
// File: be/app/Models/User.php
// chỉ là mô hình dữ liệu, không thao tác DB trực tiếp
namespace App\Models;

class User
{
    public int $id;
    public ?string $name;
    public string $email;
    public string $password;
    public ?string $phone;
    public ?string $role;
    public ?int $verified_account;              // <- giữ đúng tên cột bạn tạo
    public ?string $verification_code;
    public ?string $verification_expires_at;
    public ?string $created_at;

    public function __construct(array $row)
    {
        $this->id = (int) ($row['id'] ?? 0);
        $this->name = $row['name'] ?? null;
        $this->email = $row['email'] ?? '';
        $this->password = $row['password'] ?? '';
        $this->phone = $row['phone'] ?? null;
        $this->role = $row['role'] ?? null;
        $this->verified_account = isset($row['verified_account']) ? (int) $row['verified_account'] : null;
        $this->verification_code = $row['verification_code'] ?? null;
        $this->verification_expires_at = $row['verification_expires_at'] ?? null;
        $this->created_at = $row['created_at'] ?? null;
    }

    public static function fromArray(array $row): self
    {
        return new self($row);
    }

    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            'verified_account' => $this->verified_account
        ];
    }
}
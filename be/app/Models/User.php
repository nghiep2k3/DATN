<?php
// File: be/app/Models/User.php
namespace App\Models;

use PDO;

class User {
    private PDO $pdo;
    public function __construct(PDO $pdo) { $this->pdo = $pdo; }

    public function findByEmail(string $email): ?array {
        $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stm = $this->pdo->prepare($sql);
        $stm->execute(['email' => $email]);
        $row = $stm->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }
}

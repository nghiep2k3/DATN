<?php
namespace Config;

use PDO;
use PDOException;
use RuntimeException;

class Db   // 👈 Đổi từ "class db" -> "class Db"
{
    private string $host;
    private string $port;
    private string $username;
    private string $password;
    private string $dbname;
    public PDO $conn;

    public function __construct()
    {
        $this->host     = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $this->port     = $_ENV['DB_PORT'] ?? '3306';
        $this->username = $_ENV['DB_USER'] ?? 'root';
        $this->password = $_ENV['DB_PASS'] ?? '';
        $this->dbname   = $_ENV['DB_NAME'] ?? '';
    }

    public function connect(): PDO
    {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset=utf8mb4";
            $this->conn = new PDO($dsn, $this->username, $this->password, [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            return $this->conn;
        } catch (PDOException $e) {
            throw new RuntimeException("Database connection failed: " . $e->getMessage());
        }
    }
}

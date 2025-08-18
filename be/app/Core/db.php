<?php
class db
{
    private $host;
    private $port;
    private $username;
    private $password;
    private $dbname;
    public $conn;

    public function __construct()
    {
        $this->host     = $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
        $this->port     = $_ENV['DB_PORT'] ?? getenv('DB_PORT') ?: '3306';
        $this->username = $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
        $this->password = $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '';
        $this->dbname   = $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'rest_api';
    }

    public function connect()
    {
        try {
            $dsn = "mysql:host={$this->host};port={$this->port};dbname={$this->dbname};charset=utf8mb4";

            $this->conn = new PDO($dsn, $this->username, $this->password);

            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

            echo "Kết nối thành công đến cơ sở dữ liệu {$this->dbname} trên {$this->host}:{$this->port}";
        } catch (PDOException $e) {
            // Không echo lỗi ra production — chỉ nên log (nếu cần)
            throw new RuntimeException("Database connection failed.");
        }

        return $this->conn;
    }
}

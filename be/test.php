<?php
header('Content-Type: application/json; charset=utf-8');
$host = "194.59.164.15";  
$user = "u809771405_root";  
$pass = "Nghiep1320!";        
$db   = "u809771405_ecommerce"; 
$port = 3306;

try {
    // Tạo kết nối PDO
    $dsn = "mysql:host=$host;port=$port;dbname=$db;charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);

    // Truy vấn dữ liệu
    $stmt = $pdo->query("SELECT id, name, email, created_at FROM users");
    $data = $stmt->fetchAll();

    // Trả kết quả JSON
    echo json_encode([
        "status" => "success",
        "count"  => count($data),
        "data"   => $data
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status"  => "error",
        "message" => $e->getMessage()
    ]);
}


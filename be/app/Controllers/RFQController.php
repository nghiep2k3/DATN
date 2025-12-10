<?php
// be/app/Controllers/RFQController.php
namespace App\Controllers;

use App\Models\RFQRequest;
use PDO;
use PDOException;

class RFQController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /** Tạo mã RFQ dạng RFQ-2025-12345 */
    private function generateRequestCode(): string
    {
        return "RFQ-" . date("Y") . "-" . rand(10000, 99999);
    }

    /** Lấy tất cả yêu cầu báo giá */
    public function getAllRFQ(): array
    {
        $stmt = $this->db->query("SELECT * FROM rfq_requests ORDER BY created_at DESC");

        $list = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $list[] = RFQRequest::fromArray($row);
        }
        return $list;
    }

    /** Lấy 1 yêu cầu theo ID */
    public function getRFQById(int $id): ?RFQRequest
    {
        $stmt = $this->db->prepare("SELECT * FROM rfq_requests WHERE id = :id LIMIT 1");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ? RFQRequest::fromArray($row) : null;
    }

    /** Lấy tất cả yêu cầu theo user_id */
    public function getRFQByUserId(int $userId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM rfq_requests WHERE user_id = :user_id ORDER BY created_at DESC");
        $stmt->execute([':user_id' => $userId]);

        $list = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $list[] = RFQRequest::fromArray($row);
        }
        return $list;
    }

    /** Tạo yêu cầu báo giá mới */
    public function createRFQ(array $data): RFQRequest
    {
        // Validate cơ bản
        if (empty($data['full_name']) || empty($data['phone']) || empty($data['email'])) {
            throw new \InvalidArgumentException("Vui lòng nhập Họ tên, Số điện thoại và Email.");
        }

        // Dữ liệu đưa vào DB
        $insertData = [
            ':request_code' => $this->generateRequestCode(),
            ':user_id' => $data['user_id'] ?? null,

            ':full_name' => $data['full_name'],
            ':phone' => $data['phone'],
            ':email' => $data['email'],

            ':product_name' => $data['product_name'] ?? null,
            ':quantity' => $data['quantity'] ?? null,
            ':product_list' => $data['product_list'] ?? null,

            ':notes' => $data['notes'] ?? null,
            ':budget_range' => $data['budget_range'] ?? null,

            ':attachment_url' => $data['attachment_url'] ?? null,

            ':status' => "pending",
            ':ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
            ':user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
        ];

        // SQL mới không còn các cột bạn đã xóa
        $sql = "INSERT INTO rfq_requests
            (request_code, user_id, full_name, phone, email,
             product_name, quantity, product_list,
             notes, budget_range, attachment_url,
             status, ip_address, user_agent)
            VALUES
            (:request_code, :user_id, :full_name, :phone, :email,
             :product_name, :quantity, :product_list,
             :notes, :budget_range, :attachment_url,
             :status, :ip_address, :user_agent)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($insertData);

        // Trả về đối tượng Model
        return new RFQRequest(array_merge(
            ['id' => (int) $this->db->lastInsertId()],
            [
                'request_code' => $insertData[':request_code'],
                'user_id' => $insertData[':user_id'],
                'full_name' => $insertData[':full_name'],
                'phone' => $insertData[':phone'],
                'email' => $insertData[':email'],
                'product_name' => $insertData[':product_name'],
                'quantity' => $insertData[':quantity'],
                'product_list' => $insertData[':product_list'],
                'notes' => $insertData[':notes'],
                'budget_range' => $insertData[':budget_range'],
                'attachment_url' => $insertData[':attachment_url'],
                'status' => "pending",
                'ip_address' => $insertData[':ip_address'],
                'user_agent' => $insertData[':user_agent'],
                'created_at' => date('Y-m-d H:i:s'),
                'updated_at' => date('Y-m-d H:i:s'),
            ]
        ));
    }

    /** Cập nhật RFQ */
    public function updateRFQ(int $id, array $data): ?RFQRequest
    {
        // Kiểm tra tồn tại
        $existing = $this->getRFQById($id);
        if (!$existing) {
            return null;
        }

        // Chỉ cập nhật nếu có dữ liệu
        $updateData = [
            ':id' => $id,
            ':full_name' => $data['full_name'] ?? $existing->full_name,
            ':phone' => $data['phone'] ?? $existing->phone,
            ':email' => $data['email'] ?? $existing->email,

            ':product_name' => $data['product_name'] ?? $existing->product_name,
            ':quantity' => $data['quantity'] ?? $existing->quantity,
            ':product_list' => $data['product_list'] ?? $existing->product_list,

            ':notes' => $data['notes'] ?? $existing->notes,
            ':budget_range' => $data['budget_range'] ?? $existing->budget_range,

            ':attachment_url' => $data['attachment_url'] ?? $existing->attachment_url,

            ':status' => $data['status'] ?? $existing->status,
        ];

        $sql = "UPDATE rfq_requests SET
                full_name = :full_name,
                phone = :phone,
                email = :email,
                product_name = :product_name,
                quantity = :quantity,
                product_list = :product_list,
                notes = :notes,
                budget_range = :budget_range,
                attachment_url = :attachment_url,
                status = :status
            WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($updateData);

        return $this->getRFQById($id);
    }


    /** Xóa RFQ */
    public function deleteRFQ(int $id): bool
    {
        $rfq = $this->getRFQById($id);
        if (!$rfq)
            return false;

        try {
            $stmt = $this->db->prepare("DELETE FROM rfq_requests WHERE id = :id");
            $stmt->execute([':id' => $id]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            return false;
        }
    }
}

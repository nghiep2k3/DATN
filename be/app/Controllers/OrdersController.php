<?php
namespace App\Controllers;

use App\Models\Orders;
use PDO;
use PDOException;

class OrdersController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Lấy tất cả đơn hàng
     */
    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("SELECT * FROM orders ORDER BY created_at DESC");
            $items = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $items[] = Orders::fromArray($row);
            }
            return $items;
        } catch (PDOException $e) {
            return [];
        }
    }

    /**
     * Lấy đơn hàng theo ID
     */
    public function getById(int $id): ?Orders
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM orders WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            return $row ? Orders::fromArray($row) : null;
        } catch (PDOException $e) {
            return null;
        }
    }

    /**
     * Lấy đơn hàng theo user_id
     */
    public function getByUserId(int $user_id): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM orders WHERE user_id = :user_id ORDER BY created_at DESC");
            $stmt->execute(['user_id' => $user_id]);
            $items = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $items[] = Orders::fromArray($row);
            }
            return $items;
        } catch (PDOException $e) {
            return [];
        }
    }

    /**
     * Lấy đơn hàng theo phone
     */
    public function getByPhone(string $phone): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM orders WHERE phone = :phone ORDER BY created_at DESC");
            $stmt->execute(['phone' => $phone]);
            $items = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $items[] = Orders::fromArray($row);
            }
            return $items;
        } catch (PDOException $e) {
            return [];
        }
    }

    /**
     * Thêm mới đơn hàng
     */
    public function create(
        ?int $user_id,
        ?string $full_name,
        ?string $phone,
        ?string $email,
        ?string $status,
        ?float $total_price,
        ?string $product_list,
        ?string $shipping_address,
        ?string $note,
        ?string $payment_method,
        ?string $contentCk
    ): array {
        try {
            // Nếu product_list là array, convert thành JSON
            if (is_array($product_list)) {
                $product_list = json_encode($product_list, JSON_UNESCAPED_UNICODE);
            }

            $stmt = $this->db->prepare("
                INSERT INTO orders (user_id, full_name, phone, email, status, total_price, product_list, shipping_address, note, payment_method, contentCk, created_at)
                VALUES (:user_id, :full_name, :phone, :email, :status, :total_price, :product_list, :shipping_address, :note, :payment_method, :contentCk, NOW())
            ");

            $stmt->execute([
                'user_id' => $user_id,
                'full_name' => $full_name,
                'phone' => $phone,
                'email' => $email,
                'status' => $status ?? "Đang lấy hàng",
                'total_price' => $total_price,
                'product_list' => $product_list,
                'shipping_address' => $shipping_address,
                'note' => $note,
                'payment_method' => $payment_method ?? "Thanh toán QR code",
                'contentCk' => $contentCk
            ]);

            $orderId = $this->db->lastInsertId();

            return [
                "error" => false,
                "message" => "Tạo đơn hàng thành công",
                "id" => $orderId
            ];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    /**
     * Cập nhật đơn hàng
     */
    public function update(
        int $id,
        ?string $full_name = null,
        ?string $phone = null,
        ?string $email = null,
        ?string $status = null,
        ?float $total_price = null,
        ?string $product_list = null,
        ?string $shipping_address = null,
        ?string $note = null,
        ?string $payment_method = null,
        ?string $contentCk = null
    ): array {
        try {
            // Kiểm tra đơn hàng có tồn tại không
            $order = $this->getById($id);
            if (!$order) {
                return ["error" => true, "message" => "Đơn hàng không tồn tại"];
            }

            $fields = [];
            $params = ['id' => $id];

            if ($full_name !== null) {
                $fields[] = "full_name = :full_name";
                $params['full_name'] = $full_name;
            }

            if ($phone !== null) {
                $fields[] = "phone = :phone";
                $params['phone'] = $phone;
            }

            if ($email !== null) {
                $fields[] = "email = :email";
                $params['email'] = $email;
            }

            if ($status !== null) {
                $fields[] = "status = :status";
                $params['status'] = $status;
            }

            if ($total_price !== null) {
                $fields[] = "total_price = :total_price";
                $params['total_price'] = $total_price;
            }

            if ($product_list !== null) {
                // Nếu product_list là array, convert thành JSON
                if (is_array($product_list)) {
                    $product_list = json_encode($product_list, JSON_UNESCAPED_UNICODE);
                }
                $fields[] = "product_list = :product_list";
                $params['product_list'] = $product_list;
            }

            if ($shipping_address !== null) {
                $fields[] = "shipping_address = :shipping_address";
                $params['shipping_address'] = $shipping_address;
            }

            if ($note !== null) {
                $fields[] = "note = :note";
                $params['note'] = $note;
            }

            if ($payment_method !== null) {
                $fields[] = "payment_method = :payment_method";
                $params['payment_method'] = $payment_method;
            }
            if ($contentCk !== null) {
                $fields[] = "contentCk = :contentCk";
                $params['contentCk'] = $contentCk;
            }

            if (empty($fields)) {
                return ["error" => true, "message" => "Không có dữ liệu để cập nhật"];
            }

            $sql = "UPDATE orders SET " . implode(", ", $fields) . " WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            return ["error" => false, "message" => "Cập nhật đơn hàng thành công"];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    /**
     * Xóa đơn hàng
     */
    public function delete(int $id): array
    {
        try {
            // Kiểm tra đơn hàng có tồn tại không
            $order = $this->getById($id);
            if (!$order) {
                return ["error" => true, "message" => "Đơn hàng không tồn tại"];
            }

            $stmt = $this->db->prepare("DELETE FROM orders WHERE id = :id");
            $stmt->execute(['id' => $id]);

            return ["error" => false, "message" => "Xóa đơn hàng thành công"];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }


    /**
     * Kiểm tra đơn hàng có tồn tại không
     */
    public function exists(int $id): bool
    {
        return $this->getById($id) !== null;
    }

    /**
     * Lấy tổng số đơn hàng
     */
    public function getTotalCount(): int
    {
        try {
            $stmt = $this->db->query("SELECT COUNT(*) as total FROM orders");
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return (int) $result['total'] ?? 0;
        } catch (PDOException $e) {
            return 0;
        }
    }

    /**
     * Lấy đơn hàng theo trạng thái
     */
    public function getByStatus(string $status): array
    {
        try {
            $stmt = $this->db->prepare("SELECT * FROM orders WHERE status = :status ORDER BY created_at DESC");
            $stmt->execute(['status' => $status]);
            $items = [];
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $items[] = Orders::fromArray($row);
            }
            return $items;
        } catch (PDOException $e) {
            return [];
        }
    }

    /**
     * Tính tổng doanh thu theo tháng
     * @param int|null $year Năm cần tính (format: YYYY), nếu null thì lấy năm hiện tại
     * @param int|null $month Tháng cần tính (1-12), nếu null thì lấy tháng hiện tại
     * @return array ['error' => bool, 'revenue' => float, 'year' => int, 'month' => int, 'order_count' => int]
     */
    public function getRevenueByMonth(?int $year = null, ?int $month = null): array
    {
        try {
            // Nếu không có year hoặc month, lấy năm/tháng hiện tại
            if ($year === null) {
                $year = (int) date('Y');
            }
            if ($month === null) {
                $month = (int) date('m');
            }

            // Validate month (1-12)
            if ($month < 1 || $month > 12) {
                return [
                    "error" => true,
                    "message" => "Tháng không hợp lệ. Tháng phải từ 1 đến 12"
                ];
            }

            // Validate year (ít nhất từ 2000)
            if ($year < 2000 || $year > 9999) {
                return [
                    "error" => true,
                    "message" => "Năm không hợp lệ. Năm phải từ 2000 đến 9999"
                ];
            }

            // Query tính tổng doanh thu và số đơn hàng trong tháng
            $stmt = $this->db->prepare("
                SELECT 
                    COALESCE(SUM(total_price), 0) as total_revenue,
                    COUNT(*) as order_count
                FROM orders 
                WHERE YEAR(created_at) = :year 
                AND MONTH(created_at) = :month
            ");
            $stmt->execute([
                'year' => $year,
                'month' => $month
            ]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return [
                "error" => false,
                "revenue" => (float) ($result['total_revenue'] ?? 0),
                "year" => $year,
                "month" => $month,
                "order_count" => (int) ($result['order_count'] ?? 0)
            ];
        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => "Lỗi khi tính doanh thu: " . $e->getMessage()
            ];
        }
    }

    /**
     * Tính tổng doanh thu theo ngày
     * @param string|null $date Ngày cần tính (format: Y-m-d), nếu null thì lấy ngày hôm nay
     * @return array ['error' => bool, 'revenue' => float, 'date' => string, 'order_count' => int]
     */
    public function getRevenueByDate(?string $date = null): array
    {
        try {
            // Nếu không có date, lấy ngày hôm nay
            if ($date === null) {
                $date = date('Y-m-d');
            }

            // Validate date format
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                return [
                    "error" => true,
                    "message" => "Định dạng ngày không hợp lệ. Sử dụng format: YYYY-MM-DD"
                ];
            }

            // Query tính tổng doanh thu và số đơn hàng trong ngày
            $stmt = $this->db->prepare("
                SELECT 
                    COALESCE(SUM(total_price), 0) as total_revenue,
                    COUNT(*) as order_count
                FROM orders 
                WHERE DATE(created_at) = :date
            ");
            $stmt->execute(['date' => $date]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return [
                "error" => false,
                "revenue" => (float) ($result['total_revenue'] ?? 0),
                "date" => $date,
                "order_count" => (int) ($result['order_count'] ?? 0)
            ];
        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => "Lỗi khi tính doanh thu: " . $e->getMessage()
            ];
        }
    }

    /**
     * Lấy tổng số đơn hàng theo ngày
     * @param string|null $date Ngày cần tính (format: Y-m-d), nếu null thì lấy ngày hôm nay
     * @return array ['error' => bool, 'order_count' => int, 'date' => string]
     */
    public function getOrderCountByDate(?string $date = null): array
    {
        try {
            // Nếu không có date, lấy ngày hôm nay
            if ($date === null) {
                $date = date('Y-m-d');
            }

            // Validate date format
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                return [
                    "error" => true,
                    "message" => "Định dạng ngày không hợp lệ. Sử dụng format: YYYY-MM-DD"
                ];
            }

            // Query đếm số đơn hàng trong ngày
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as order_count
                FROM orders 
                WHERE DATE(created_at) = :date
            ");
            $stmt->execute(['date' => $date]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            return [
                "error" => false,
                "order_count" => (int) ($result['order_count'] ?? 0),
                "date" => $date
            ];
        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => "Lỗi khi lấy số đơn hàng: " . $e->getMessage()
            ];
        }
    }
}
?>
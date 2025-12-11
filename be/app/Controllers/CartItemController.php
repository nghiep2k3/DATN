<?php
// app/Controllers/CartItemController.php
namespace App\Controllers;

use App\Models\CartItem;
use PDO;
use PDOException;

class CartItemController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /** Lấy tất cả cart items */
    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM cartitems");
        $items = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $items[] = CartItem::fromArray($row);
        }
        return $items;
    }

    /** Lấy cart item theo id */
    public function getById(int $id): ?CartItem
    {
        $stmt = $this->db->prepare("SELECT * FROM cartitems WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? CartItem::fromArray($row) : null;
    }

    /** Thêm mới cart item */
    public function create(?int $user_id, ?int $product_id, ?int $quantity, ?string $phone, ?string $price = null): array
    {
        try {
            $stmt = $this->db->prepare("
            INSERT INTO cartitems (user_id, product_id, quantity, phone, price)
            VALUES (:user_id, :product_id, :quantity, :phone, :price)
        ");
            $stmt->execute([
                'user_id' => $user_id,
                'product_id' => $product_id,
                'quantity' => $quantity,
                'phone' => $phone,
                'price' => $price
            ]);
            return ["error" => false, "message" => "Thêm vào giỏ hàng thành công"];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    public function getCart(?int $user_id = null, ?string $phone = null): array
    {
        try {
            $where = [];
            $params = [];

            if ($user_id !== null) {
                $where[] = "c.user_id = :user_id";
                $params['user_id'] = $user_id;
            }

            if ($phone !== null) {
                $where[] = "c.phone = :phone";
                $params['phone'] = $phone;
            }

            $sql = "
            SELECT 
                c.id AS cart_id,
                c.user_id,
                c.product_id,
                c.quantity,
                c.phone,
                c.price,
                p.id AS product_id,
                p.name AS product_name,
                p.sku,
                p.description,
                p.price AS product_price,
                p.stock_quantity,
                b.name AS brand_name,
                cat.name AS category_name
            FROM cartitems c
            LEFT JOIN products p ON c.product_id = p.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN categories cat ON p.category_id = cat.id
        ";

            if (!empty($where)) {
                $sql .= " WHERE " . implode(" AND ", $where);
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Lấy danh sách product_id để join ảnh
            $productIds = array_unique(array_filter(array_column($rows, 'product_id')));
            $imagesMap = [];

            if (!empty($productIds)) {
                $in = str_repeat('?,', count($productIds) - 1) . '?';
                $imgStmt = $this->db->prepare("
                SELECT product_id, image_url 
                FROM product_images 
                WHERE product_id IN ($in)
            ");
                $imgStmt->execute($productIds);
                $allImages = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

                foreach ($allImages as $img) {
                    $imagesMap[$img['product_id']][] = $img['image_url'];
                }
            }

            foreach ($rows as &$row) {
                $row['images'] = $imagesMap[$row['product_id']] ?? [];
            }

            return [
                "error" => false,
                "data" => $rows
            ];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }



    public function update(int $id, ?int $quantity = null, ?string $phone = null, ?string $price = null): array
    {
        try {
            $fields = [];
            $params = ['id' => $id];

            if ($quantity !== null) {
                $fields[] = "quantity = :quantity";
                $params['quantity'] = $quantity;
            }

            if ($phone !== null) {
                $fields[] = "phone = :phone";
                $params['phone'] = $phone;
            }

            if ($price !== null) {
                $fields[] = "price = :price";
                $params['price'] = $price;
            }

            if (empty($fields)) {
                return ["error" => true, "message" => "Không có dữ liệu để cập nhật"];
            }

            $sql = "UPDATE cartitems SET " . implode(", ", $fields) . " WHERE id = :id";
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);

            return ["error" => false, "message" => "Cập nhật giỏ hàng thành công"];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    public function delete(int $id): array
    {
        try {
            $stmt = $this->db->prepare("DELETE FROM cartitems WHERE id = :id");
            $stmt->execute(['id' => $id]);

            return ["error" => false, "message" => "Xoá giỏ hàng thành công"];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    public function deleteCartItemsByIds(array $cartIds): array
    {
        try {

            if (empty($cartIds)) {
                return [
                    "error" => true,
                    "message" => "Danh sách cart_id trống"
                ];
            }

            // Tạo placeholder ?, ?, ?, ...
            $placeholders = implode(",", array_fill(0, count($cartIds), "?"));

            // Chuẩn bị query DELETE
            $sql = "DELETE FROM cartitems WHERE id IN ($placeholders)";
            $stmt = $this->db->prepare($sql);

            // Thực thi câu lệnh SQL
            $stmt->execute($cartIds);

            return [
                "error" => false,
                "message" => "Đã xóa " . count($cartIds) . " cartitems"
            ];

        } catch (\Throwable $e) {
            return [
                "error" => true,
                "message" => $e->getMessage()
            ];
        }
    }

}

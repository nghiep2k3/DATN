<?php
namespace App\Controllers;

use App\Models\Product;
use PDO;
use PDOException;

class ProductController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Thêm sản phẩm mới
     * @param array $data
     * @return array
     */

    /**
     * Lấy danh sách sản phẩm theo category_id
     * @param int $category_id
     * @return array
     */

    public function create(array $data): array
    {
        try {
            $stmt = $this->db->prepare("
    INSERT INTO products (name, sku, description, price, stock_quantity, brand_id, category_id, image_url, document_url, created_at)
    VALUES (:name, :sku, :description, :price, :stock_quantity, :brand_id, :category_id, :image_url, :document_url, NOW())
");

            $stmt->execute([
                'name' => $data['name'],
                'sku' => $data['sku'] ?? null,
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'stock_quantity' => $data['stock_quantity'] ?? 0,
                'brand_id' => $data['brand_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'image_url' => $data['image_url'],
                'document_url' => $data['document_url'] ?? null
            ]);


            $productId = $this->db->lastInsertId();

            // Nếu có ảnh -> insert vào bảng product_images
            if (!empty($data['images']) && is_array($data['images'])) {
                $imgStmt = $this->db->prepare("
                INSERT INTO product_images (product_id, image_url) 
                VALUES (:product_id, :image_url)
            ");
                foreach ($data['images'] as $url) {
                    $imgStmt->execute([
                        'product_id' => $productId,
                        'image_url' => $url
                    ]);
                }
            }

            return [
                "error" => false,
                "message" => "Thêm sản phẩm thành công",
                "product_id" => $productId
            ];
        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => "Lỗi khi thêm sản phẩm",
                "detail" => $e->getMessage()
            ];
        }
    }

    public function getAll(): array
    {
        try {
            $stmt = $this->db->query("SELECT * FROM products ORDER BY created_at DESC");
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($products as &$prod) {
                $imgStmt = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = :id");
                $imgStmt->execute(['id' => $prod['id']]);
                $prod['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

                // document_url
                if (!empty($prod['document_url'])) {
                    $prod['document_url'] = json_decode($prod['document_url'], true);
                }

            }

            return [
                "error" => false,
                "products" => $products
            ];
        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => $e->getMessage()
            ];
        }
    }

    public function getById(int $id): array
    {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    p.*,
                    b.name AS brand_name,
                    c.name AS category_name
                FROM products p
                LEFT JOIN brands b ON p.brand_id = b.id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.id = :id
            ");
            $stmt->execute(['id' => $id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                return [
                    "error" => true,
                    "message" => "Sản phẩm không tồn tại"
                ];
            }

            $imgStmt = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = :id");
            $imgStmt->execute(['id' => $id]);
            $product['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);
            // document_url
            if (!empty($product['document_url'])) {
                $product['document_url'] = json_decode($product['document_url'], true);
            }

            return [
                "error" => false,
                "product" => $product
            ];
        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => $e->getMessage()
            ];
        }
    }

    public function update(int $id, array $data): array
    {
        try {
            // kiểm tra sản phẩm có tồn tại không
            $stmt = $this->db->prepare("SELECT * FROM products WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                return ["error" => true, "message" => "Sản phẩm không tồn tại"];
            }

            // Xử lý document: xóa file vật lý của document cũ không còn trong danh sách mới
            $oldDocuments = [];
            if (!empty($product['document_url'])) {
                $oldDocsJson = json_decode($product['document_url'], true);
                if (is_array($oldDocsJson)) {
                    $oldDocuments = $oldDocsJson;
                }
            }

            $newDocuments = [];
            if (isset($data['document_url']) && !empty($data['document_url'])) {
                $newDocsJson = is_string($data['document_url']) 
                    ? json_decode($data['document_url'], true) 
                    : $data['document_url'];
                if (is_array($newDocsJson)) {
                    $newDocuments = $newDocsJson;
                }
            }

            // Tìm document cũ không còn trong danh sách mới để xóa file vật lý
            $oldDocLinks = array_column($oldDocuments, 'link');
            $newDocLinks = array_column($newDocuments, 'link');
            $docsToDelete = array_diff($oldDocLinks, $newDocLinks);

            // Xóa file vật lý của document đã bị loại bỏ
            foreach ($docsToDelete as $docLink) {
                $filePath = dirname(__DIR__, 2) . $docLink;
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            // update sản phẩm
            $stmt = $this->db->prepare("
            UPDATE products 
            SET name = :name, sku = :sku, description = :description, price = :price, 
                stock_quantity = :stock_quantity, brand_id = :brand_id, 
                category_id = :category_id, image_url = :image_url, document_url = :document_url
            WHERE id = :id
        ");
            $stmt->execute([
                'name' => $data['name'],
                'sku' => $data['sku'] ?? null,
                'description' => $data['description'] ?? null,
                'price' => $data['price'],
                'stock_quantity' => $data['stock_quantity'] ?? 0,
                'brand_id' => $data['brand_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'image_url' => $data['image_url'] ?? $product['image_url'],
                'document_url' => isset($data['document_url']) ? $data['document_url'] : $product['document_url'],
                'id' => $id
            ]);

            // Xử lý ảnh: luôn cập nhật theo danh sách mới
            // Lấy ảnh cũ
            $oldImgStmt = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = :id");
            $oldImgStmt->execute(['id' => $id]);
            $oldImages = $oldImgStmt->fetchAll(PDO::FETCH_COLUMN);

            // Nếu có danh sách ảnh mới
            if (isset($data['images']) && is_array($data['images'])) {
                // Tìm ảnh cũ không còn trong danh sách mới để xóa
                $imagesToDelete = array_diff($oldImages, $data['images']);
                
                // Xóa file vật lý của ảnh đã bị loại bỏ
                foreach ($imagesToDelete as $img) {
                    $filePath = dirname(__DIR__, 2) . $img;
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }

                // Xóa record cũ không còn trong danh sách mới
                if (!empty($imagesToDelete)) {
                    $placeholders = implode(',', array_fill(0, count($imagesToDelete), '?'));
                    $deleteStmt = $this->db->prepare("DELETE FROM product_images WHERE product_id = ? AND image_url IN ($placeholders)");
                    $deleteStmt->execute(array_merge([$id], $imagesToDelete));
                }

                // Tìm ảnh mới cần insert (chưa có trong DB)
                $newImages = array_diff($data['images'], $oldImages);
                
                // Insert ảnh mới
                if (!empty($newImages)) {
                    $imgStmt = $this->db->prepare("
                        INSERT INTO product_images (product_id, image_url) 
                        VALUES (:product_id, :image_url)
                    ");
                    foreach ($newImages as $url) {
                        $imgStmt->execute([
                            'product_id' => $id,
                            'image_url' => $url
                        ]);
                    }
                }
            } else {
                // Nếu không có danh sách ảnh mới (mảng rỗng hoặc null), xóa tất cả ảnh cũ
                foreach ($oldImages as $img) {
                    $filePath = dirname(__DIR__, 2) . $img;
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }
                $this->db->prepare("DELETE FROM product_images WHERE product_id = :id")->execute(['id' => $id]);
            }

            return ["error" => false, "message" => "Cập nhật sản phẩm thành công"];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }

    public function delete(int $id): array
    {
        try {
            // lấy ảnh từ product_images
            $imgStmt = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = :id");
            $imgStmt->execute(['id' => $id]);
            $images = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

            // lấy ảnh đại diện từ products
            $mainStmt = $this->db->prepare("SELECT image_url FROM products WHERE id = :id");
            $mainStmt->execute(['id' => $id]);
            $mainImage = $mainStmt->fetchColumn();

            // gom tất cả ảnh
            if ($mainImage) {
                $images[] = $mainImage;
            }

            // xoá file vật lý
            foreach ($images as $img) {
                $filePath = dirname(__DIR__, 2) . $img;
                if ($img && file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            // xoá record ảnh
            $this->db->prepare("DELETE FROM product_images WHERE product_id = :id")->execute(['id' => $id]);

            // xoá sản phẩm
            $del = $this->db->prepare("DELETE FROM products WHERE id = :id");
            $del->execute(['id' => $id]);

            return ["error" => false, "message" => "Xóa sản phẩm thành công"];
        } catch (PDOException $e) {
            return ["error" => true, "message" => $e->getMessage()];
        }
    }
    public function getByCategoryId(int $category_id): array
    {
        try {
            $stmt = $this->db->prepare("
                SELECT 
                    p.*,
                    b.name AS brand_name,
                    c.name AS category_name
                FROM products p
                LEFT JOIN brands b ON p.brand_id = b.id
                LEFT JOIN categories c ON p.category_id = c.id
                WHERE p.category_id = :category_id
                ORDER BY p.created_at DESC
            ");
            $stmt->execute(['category_id' => $category_id]);
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Nếu không có sản phẩm nào
            if (!$products) {
                return [
                    "error" => false,
                    "total" => 0,
                    "products" => []
                ];
            }

            // Lấy ảnh phụ cho từng sản phẩm
            $imgStmt = $this->db->prepare("
                SELECT image_url FROM product_images WHERE product_id = :id
            ");
            foreach ($products as &$prod) {
                // images
                $imgStmt->execute(['id' => $prod['id']]);
                $prod['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

                // document_url
                if (!empty($prod['document_url'])) {
                    $prod['document_url'] = json_decode($prod['document_url'], true);
                }
            }


            return [
                "error" => false,
                "total" => count($products),
                "products" => $products
            ];

        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => $e->getMessage()
            ];
        }
    }

    /**
     * Lấy toàn bộ danh sách sản phẩm (bao gồm brand, category, images)
     * @return array
     */
    public function getAllProducts(): array
    {
        try {
            $stmt = $this->db->query("
                SELECT 
                    p.*,
                    b.name AS brand_name,
                    c.name AS category_name
                FROM products p
                LEFT JOIN brands b ON p.brand_id = b.id
                LEFT JOIN categories c ON p.category_id = c.id
                ORDER BY p.created_at DESC
            ");
            $products = $stmt->fetchAll(PDO::FETCH_ASSOC);


            // Lấy ảnh phụ cho từng sản phẩm
            $imgStmt = $this->db->prepare("SELECT image_url FROM product_images WHERE product_id = :id");
            foreach ($products as &$prod) {
                // images
                $imgStmt->execute(['id' => $prod['id']]);
                $prod['images'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

                // document_url
                if (!empty($prod['document_url'])) {
                    $prod['document_url'] = json_decode($prod['document_url'], true);
                }
            }


            return [
                "error" => false,
                "count" => count($products),
                "products" => $products
            ];

        } catch (PDOException $e) {
            return [
                "error" => true,
                "message" => "Lỗi khi lấy danh sách sản phẩm",
                "detail" => $e->getMessage()
            ];
        }
    }


}

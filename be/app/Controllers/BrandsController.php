<?php
// be/app/Controllers/BrandsController.php
namespace App\Controllers;

use App\Models\Brands;
use PDO;
use PDOException;

class BrandsController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Tạo brand + (tuỳ chọn) upload ảnh vào be/upload
     * @param string $name
     * @param ?string $description
     * @param ?array $file   // ví dụ: $_FILES['url_image'] hoặc $_FILES['image']
     */

    public function getAllBrands(): array
    {
        $stmt = $this->db->query("SELECT * FROM brands");
        $brands = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $brands[] = Brands::fromArray($row);
        }
        return $brands;
    }

    public function getBrandById(int $id): ?Brands
    {
        $stmt = $this->db->prepare("SELECT * FROM brands WHERE id = :id");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? Brands::fromArray($row) : null;
    }

    public function createBrand(string $name, ?string $description, ?array $file = null): Brands
    {
        $imageRelPath = null; // đường dẫn sẽ lưu DB (vd: /upload/xxx.png)

        // Nếu có file ảnh -> xử lý upload
        if ($file && isset($file['tmp_name']) && $file['error'] === UPLOAD_ERR_OK) {
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowed, true)) {
                throw new \RuntimeException('Định dạng ảnh không hợp lệ (jpg, jpeg, png, webp, gif, svg).');
            }
            if ($file['size'] > 12 * 1024 * 1024) { // 12MB
                throw new \RuntimeException('Ảnh vượt quá 12MB.');
            }

            // Thư mục vật lý: be/upload (từ Controllers lùi 2 cấp ra be/)
            $uploadDir = dirname(__DIR__, 2) . '/upload/';
            if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
                throw new \RuntimeException('Không tạo được thư mục upload.');
            }

            // Tên file an toàn
            $base = preg_replace('/[^a-z0-9-_]/i', '_', pathinfo($file['name'], PATHINFO_FILENAME));
            $newName = $base . '_' . uniqid('', true) . '.' . $ext;
            $target = $uploadDir . $newName;

            if (!move_uploaded_file($file['tmp_name'], $target)) {
                throw new \RuntimeException('Không thể lưu file upload.');
            }

            // Đường dẫn public/relative để lưu DB
            $imageRelPath = 'upload/' . $newName;
        }

        // Insert DB (có url_image + created_at)
        $stmt = $this->db->prepare(
            "INSERT INTO brands (name, description, url_image, created_at)
             VALUES (:name, :description, :url_image, NOW())"
        );
        $stmt->execute([
            ':name' => $name,
            ':description' => $description,
            ':url_image' => $imageRelPath
        ]);

        return new Brands([
            'id' => (int) $this->db->lastInsertId(),
            'name' => $name,
            'description' => $description,
            'url_image' => $imageRelPath,
            'created_at' => date('Y-m-d H:i:s')
        ]);
    }

    /**
     * Cập nhật brand: name / description / url_image
     * - $file: mảng file (vd: $_FILES['url_image'] hoặc $_FILES['image'])
     * - $urlImage: nếu truyền chuỗi, sẽ cập nhật trực tiếp (ưu tiên file nếu có)
     */
    public function updateBrand(
        int $id,
        ?string $name = null,
        ?string $description = null,
        ?array $file = null,
        ?string $urlImage = null
    ): ?Brands {
        // 1) Kiểm tra tồn tại
        $existing = $this->getBrandById($id);
        if (!$existing) {
            return null;
        }
        $existingArr = $existing->toArray();
        $oldImagePath = $existingArr['url_image'] ?? null;

        // 2) Nếu có file upload -> xử lý lưu vào be/upload
        $newImageRelPath = null;
        if ($file && isset($file['tmp_name']) && $file['error'] === UPLOAD_ERR_OK) {
            $allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
            $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
            if (!in_array($ext, $allowed, true)) {
                throw new \RuntimeException('Định dạng ảnh không hợp lệ (jpg, jpeg, png, webp, gif).');
            }
            if ($file['size'] > 12 * 1024 * 1024) {
                throw new \RuntimeException('Ảnh vượt quá 12MB.');
            }

            // Thư mục vật lý: be/upload
            $uploadDir = dirname(__DIR__, 2) . '/upload/';
            if (!is_dir($uploadDir) && !mkdir($uploadDir, 0777, true) && !is_dir($uploadDir)) {
                throw new \RuntimeException('Không tạo được thư mục upload.');
            }

            $base = preg_replace('/[^a-z0-9-_]/i', '_', pathinfo($file['name'], PATHINFO_FILENAME));
            $newName = $base . '_' . uniqid('', true) . '.' . $ext;
            $target = $uploadDir . $newName;

            if (!move_uploaded_file($file['tmp_name'], $target)) {
                throw new \RuntimeException('Không thể lưu file upload.');
            }

            $newImageRelPath = 'upload/' . $newName;
        }

        // 3) Nếu không có file nhưng có chuỗi $urlImage -> dùng chuỗi đó
        if (!$newImageRelPath && $urlImage !== null && trim($urlImage) !== '') {
            $newImageRelPath = trim($urlImage);
        }

        // 4) Build câu UPDATE động theo field nào được truyền
        $fields = [];
        $params = [':id' => $id];

        if ($name !== null) {
            $fields[] = 'name = :name';
            $params[':name'] = $name;
        }
        if ($description !== null) {
            $fields[] = 'description = :description';
            $params[':description'] = $description;
        }
        if ($newImageRelPath !== null) {
            $fields[] = 'url_image = :url_image';
            $params[':url_image'] = $newImageRelPath;
        }

        // Không có gì để cập nhật -> trả về bản ghi cũ
        if (empty($fields)) {
            return $existing;
        }

        $sql = 'UPDATE brands SET ' . implode(', ', $fields) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        // 5) Xoá ảnh cũ nếu vừa cập nhật ảnh mới và ảnh cũ nằm trong /upload/
        if ($newImageRelPath !== null && $oldImagePath && substr($oldImagePath, 0, 8) === '/upload/') {
            $oldFs = dirname(__DIR__, 2) . $oldImagePath;
            if (is_file($oldFs)) {
                @unlink($oldFs);
            }
        }

        return $this->getBrandById($id);
    }

    public function deleteBrand(int $id): bool
    {
        // 1) Kiểm tra brand có tồn tại không
        $brand = $this->getBrandById($id);
        if (!$brand) {
            // Không tồn tại -> trả về false
            return false;
        }

        // Lấy đường dẫn ảnh cũ để xoá file sau khi xoá DB
        $data = $brand->toArray();
        $oldImage = $data['url_image'] ?? null;

        // 2) Xoá trong DB
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare("DELETE FROM brands WHERE id = :id");
            $stmt->execute(['id' => $id]);
            $deleted = $stmt->rowCount() > 0;
            $this->db->commit();
        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }

        // 3) Nếu xoá DB thành công, thử xoá file ảnh trong /upload (nếu nằm trong đó)
        if ($deleted && $oldImage && str_starts_with($oldImage, '/upload/')) {
            $fsPath = dirname(__DIR__, 2) . $oldImage; // trỏ tới be/upload/...
            if (is_file($fsPath)) {
                @unlink($fsPath);
            }
        }

        return $deleted;
    }
}


?>
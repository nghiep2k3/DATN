<?php
// be/app/Controllers/TagsController.php
namespace App\Controllers;

use App\Models\Tags;
use PDO;
use PDOException;

class TagsController
{
    private PDO $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    /** Lấy tất cả tag */
    public function getAllTags(): array
    {
        $stmt = $this->db->query("SELECT id, name FROM tags ORDER BY id DESC");
        $tags = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $tags[] = Tags::fromArray($row);
        }
        return $tags;
    }

    /** Lấy 1 tag theo id */
    public function getTagById(int $id): ?Tags
    {
        $stmt = $this->db->prepare("SELECT id, name FROM tags WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? Tags::fromArray($row) : null;
    }

    /** Tạo tag mới (chỉ có name) */
    public function createTag(string $name): Tags
    {
        $name = trim($name);
        if ($name === '') {
            throw new \InvalidArgumentException('Tên tag không được để trống');
        }

        $stmt = $this->db->prepare("INSERT INTO tags (name) VALUES (:name)");
        $stmt->execute([':name' => $name]);

        return new Tags([
            'id'   => (int) $this->db->lastInsertId(),
            'name' => $name,
        ]);
    }

    /**
     * Cập nhật tag (chỉ name). Nếu không tồn tại -> trả về null
     * Cho phép truyền null để giữ nguyên name cũ.
     */
    public function updateTag(int $id, ?string $name = null): ?Tags
    {
        // Kiểm tra tồn tại
        $existing = $this->getTagById($id);
        if (!$existing) {
            return null;
        }

        // Không có gì để cập nhật -> trả về bản ghi cũ
        if ($name === null) {
            return $existing;
        }

        $name = trim($name);
        if ($name === '') {
            throw new \InvalidArgumentException('Tên tag không được để trống');
        }

        $stmt = $this->db->prepare("UPDATE tags SET name = :name WHERE id = :id");
        $stmt->execute([':id' => $id, ':name' => $name]);

        return $this->getTagById($id);
    }

    /**
     * Xoá tag theo id.
     * Trả về false nếu không tồn tại hoặc xoá không thành công.
     * Lưu ý: nếu tag đang được tham chiếu trong product_tags, FK có thể chặn xoá (lỗi 23000).
     */
    public function deleteTag(int $id): bool
    {
        // Kiểm tra tồn tại
        $tag = $this->getTagById($id);
        if (!$tag) {
            return false;
        }

        try {
            $stmt = $this->db->prepare("DELETE FROM tags WHERE id = :id");
            $stmt->execute([':id' => $id]);
            return $stmt->rowCount() > 0;
        } catch (PDOException $e) {
            // Nếu vướng ràng buộc FK (ví dụ đang có trong product_tags)
            if ($e->getCode() === '23000') {
                // Tuỳ bạn: có thể return false hoặc throw để API hiển thị thông báo phù hợp
                return false;
            }
            throw $e;
        }
    }
}

<?php
namespace App\Controllers;

use App\Models\Categories;
use PDO;
use PDOException;

class CategoriesController
{
    public function __construct(private PDO $pdo)
    {
    }


    /** Lấy tất cả cha kèm con; hoặc 1 cha theo id kèm con */
    public function listWithChildren(?int $parentId = null): array
    {
        if ($parentId) {
            // Lấy 1 cha
            $pstmt = $this->pdo->prepare(
                'SELECT id, name, description, url_image FROM categories 
             WHERE id = :id AND parent_id IS NULL LIMIT 1'
            );
            $pstmt->execute(['id' => $parentId]);
            $parent = $pstmt->fetch(PDO::FETCH_ASSOC);
            if (!$parent) {
                return [404, ['error' => true, 'message' => 'Parent category not found']];
            }

            // Lấy con của cha đó (NHỚ SELECT description, url_image)
            $cstmt = $this->pdo->prepare(
                'SELECT id, name, description, url_image, created_at 
             FROM categories 
             WHERE parent_id = :pid 
             ORDER BY id ASC'
            );
            $cstmt->execute(['pid' => $parentId]);
            $childrenRows = $cstmt->fetchAll(PDO::FETCH_ASSOC);

            $children = array_map(function ($c) {
                return [
                    'id' => (int) $c['id'],
                    'name' => $c['name'],
                    'description' => $c['description'] ?? '',
                    'url_image' => $c['url_image'] ?? '',
                    'created_at' => $c['created_at'],
                ];
            }, $childrenRows);

            return [
                200,
                [
                    [
                        'id' => (int) $parent['id'],
                        'category' => $parent['name'],
                        'description' => $parent['description'] ?? '',
                        'url_image' => $parent['url_image'] ?? null,
                        'sub_category' => $children,
                    ]
                ]
            ];
        }

        // Lấy tất cả cha
        $parents = $this->pdo->query(
            'SELECT id, name, description, url_image 
         FROM categories 
         WHERE parent_id IS NULL 
         ORDER BY id ASC'
        )->fetchAll(PDO::FETCH_ASSOC);

        if (!$parents)
            return [200, []];

        $ids = array_column($parents, 'id');
        $in = implode(',', array_fill(0, count($ids), '?'));

        // Lấy toàn bộ con của các cha (NHỚ SELECT description, url_image)
        $cstmt = $this->pdo->prepare(
            "SELECT id, name, description, url_image, created_at, parent_id
         FROM categories
         WHERE parent_id IN ($in)
         ORDER BY parent_id ASC, id ASC"
        );
        $cstmt->execute($ids);
        $allChildren = $cstmt->fetchAll(PDO::FETCH_ASSOC);

        // group theo parent_id
        $grouped = [];
        foreach ($allChildren as $c) {
            $grouped[(int) $c['parent_id']][] = [
                'id' => (int) $c['id'],
                'name' => $c['name'],
                'description' => $c['description'] ?? '',
                'url_image' => $c['url_image'] ?? '',
                'created_at' => $c['created_at'],
            ];
        }

        // build output
        $out = [];
        foreach ($parents as $p) {
            $out[] = [
                'id' => (int) $p['id'],
                'category' => $p['name'],
                'description' => $p['description'] ?? '',
                'url_image' => $p['url_image'] ?? null,
                'sub_category' => $grouped[(int) $p['id']] ?? []
            ];
        }

        return [200, $out];
    }




    /* create/update/delete cũ của bạn vẫn dùng bình thường
       — khi tạo subcategory chỉ cần truyền parent_id */
    public function create(array $input): array
    {
        $name = trim($input['name'] ?? '');
        $description = isset($input['description']) ? trim((string) $input['description']) : null;
        $parent_id = isset($input['parent_id']) && $input['parent_id'] !== '' ? (int) $input['parent_id'] : null;
        $url_image = isset($input['url_image']) && $input['url_image'] !== '' ? (string) $input['url_image'] : null;

        if ($name === '') {
            return [422, ['error' => true, 'message' => 'Tên category là bắt buộc']];
        }
        if (mb_strlen($name) > 255) {
            return [422, ['error' => true, 'message' => 'Tên category tối đa 255 ký tự']];
        }

        // nếu có parent_id thì parent phải là category cha (parent_id IS NULL)
        if ($parent_id) {
            $chkParent = $this->pdo->prepare('SELECT 1 FROM categories WHERE id = :id AND parent_id IS NULL');
            $chkParent->execute(['id' => $parent_id]);
            if (!$chkParent->fetchColumn()) {
                return [422, ['error' => true, 'message' => 'parent_id không hợp lệ']];
            }
        }

        // chống trùng tên trong cùng 1 nhóm cha
        $dup = $this->pdo->prepare(
            'SELECT 1 FROM categories WHERE name = :name AND IFNULL(parent_id,0) = IFNULL(:pid,0) LIMIT 1'
        );
        $dup->execute(['name' => $name, 'pid' => $parent_id]);
        if ($dup->fetchColumn()) {
            return [409, ['error' => true, 'message' => 'Tên category đã tồn tại trong nhóm']];
        }

        $now = (new \DateTime('now', new \DateTimeZone('Asia/Ho_Chi_Minh')))->format('Y-m-d H:i:s');

        // INSERT có url_image
        $sql = 'INSERT INTO categories (name, description, parent_id, url_image, created_at)
                VALUES (:name, :description, :parent_id, :url_image, :created_at)';
        $stm = $this->pdo->prepare($sql);
        $stm->execute([
            'name' => $name,
            'description' => $description ?: null,
            'parent_id' => $parent_id ?: null,
            'url_image' => $url_image,         // có thể null
            'created_at' => $now
        ]);

        return [
            201,
            [
                'error' => false,
                'message' => 'Tạo category thành công',
                'id' => (int) $this->pdo->lastInsertId(),
                'url_image' => $url_image
            ]
        ];
    }

    /** Tạo sub-category dưới 1 category cha */
    public function createSub(array $input): array
    {
        $name = trim($input['name'] ?? '');
        $description = isset($input['description']) ? trim((string) $input['description']) : null;
        $parent_id = isset($input['parent_id']) ? (int) $input['parent_id'] : 0;

        // validate
        if ($name === '') {
            return [422, ['error' => true, 'message' => 'Tên sub_category là bắt buộc']];
        }
        if ($parent_id <= 0) {
            return [422, ['error' => true, 'message' => 'Thiếu hoặc sai parent_id']];
        }

        // parent phải tồn tại & là category cha (parent_id IS NULL)
        $p = $this->pdo->prepare('SELECT 1 FROM categories WHERE id = :id AND parent_id IS NULL LIMIT 1');
        $p->execute(['id' => $parent_id]);
        if (!$p->fetchColumn()) {
            return [422, ['error' => true, 'message' => 'parent_id không hợp lệ (không phải category cha)']];
        }

        // chống trùng tên trong cùng 1 parent
        $dup = $this->pdo->prepare(
            'SELECT 1 FROM categories WHERE name = :name AND parent_id = :pid LIMIT 1'
        );
        $dup->execute(['name' => $name, 'pid' => $parent_id]);
        if ($dup->fetchColumn()) {
            return [409, ['error' => true, 'message' => 'Tên sub_category đã tồn tại trong nhóm']];
        }

        // insert
        $now = (new \DateTime('now', new \DateTimeZone('Asia/Ho_Chi_Minh')))->format('Y-m-d H:i:s');
        $ins = $this->pdo->prepare(
            'INSERT INTO categories (name, description, parent_id, created_at)
             VALUES (:name, :description, :parent_id, :created_at)'
        );
        $ins->execute([
            'name' => $name,
            'description' => $description !== '' ? $description : null,
            'parent_id' => $parent_id,
            'created_at' => $now,
        ]);
        $id = (int) $this->pdo->lastInsertId();

        // trả item vừa tạo
        return [
            201,
            [
                'error' => false,
                'message' => 'Tạo sub_category thành công',
                'item' => [
                    'id' => $id,
                    'name' => $name,
                    'description' => $description ?: null,
                    'parent_id' => $parent_id,
                    'created_at' => $now,
                ],
            ]
        ];
    }

    /** Cập nhật category theo id */
    public function update(int $id, array $input): array
    {
        // Giờ VN
        date_default_timezone_set('Asia/Ho_Chi_Minh');
        $now = date('Y-m-d H:i:s');

        // 1) Kiểm tra tồn tại
        $get = $this->pdo->prepare(
            'SELECT id, name, description, parent_id, url_image, created_at 
         FROM categories WHERE id = :id'
        );
        $get->execute(['id' => $id]);
        $current = $get->fetch(PDO::FETCH_ASSOC);
        if (!$current) {
            return [404, ['error' => true, 'message' => 'Category not found']];
        }

        // 2) Lấy input (nếu không truyền thì giữ giá trị cũ)
        $name = trim($input['name'] ?? $current['name']);
        $description = array_key_exists('description', $input)
            ? trim((string) $input['description'])
            : $current['description'];

        // parent_id: có thể là '', null, hoặc số
        $parent_id = $current['parent_id'];
        if (array_key_exists('parent_id', $input)) {
            $parent_id = ($input['parent_id'] === '' || $input['parent_id'] === null)
                ? null
                : (int) $input['parent_id'];
        }

        // url_image: relative path (vd: upload/xxx.jpg)
        $url_image = array_key_exists('url_image', $input)
            ? (string) $input['url_image']
            : $current['url_image'];

        // 3) Validate cơ bản
        if ($name === '') {
            return [422, ['error' => true, 'message' => 'Tên category là bắt buộc']];
        }
        if (mb_strlen($name) > 255) {
            return [422, ['error' => true, 'message' => 'Tên tối đa 255 ký tự']];
        }

        // 4) Validate parent_id (cho phép đổi cha↔con)
        if (!is_null($parent_id)) {
            // Không thể tự tham chiếu
            if ((int) $parent_id === (int) $id) {
                return [422, ['error' => true, 'message' => 'parent_id không hợp lệ (không thể trỏ tới chính nó)']];
            }
            // Bắt buộc parent là "category cha" (parent_id IS NULL)
            $chkParent = $this->pdo->prepare(
                'SELECT 1 FROM categories WHERE id = :id AND parent_id IS NULL LIMIT 1'
            );
            $chkParent->execute(['id' => $parent_id]);
            if (!$chkParent->fetchColumn()) {
                return [422, ['error' => true, 'message' => 'parent_id không hợp lệ (không phải category cha)']];
            }
        }

        // 5) Chống trùng tên trong cùng nhóm cha
        $dup = $this->pdo->prepare(
            'SELECT 1 FROM categories 
         WHERE name = :name 
           AND id <> :id
           AND IFNULL(parent_id,0) = IFNULL(:pid,0)
         LIMIT 1'
        );
        $dup->execute([
            'name' => $name,
            'id' => $id,
            'pid' => $parent_id
        ]);
        if ($dup->fetchColumn()) {
            return [409, ['error' => true, 'message' => 'Tên category đã tồn tại trong nhóm']];
        }

        // 6) Update (đổi cả parent_id & url_image nếu có)
        $sql = 'UPDATE categories 
            SET name = :name,
                description = :description,
                parent_id = :parent_id,
                url_image = :url_image,
                created_at = :created_at
            WHERE id = :id';
        $stm = $this->pdo->prepare($sql);
        $stm->execute([
            'name' => $name,
            'description' => $description !== '' ? $description : null,
            'parent_id' => $parent_id,      // có thể null
            'url_image' => $url_image !== '' ? $url_image : null,
            'created_at' => $now,            // theo yêu cầu của bạn
            'id' => $id
        ]);

        // 7) Trả lại bản ghi sau update
        $get2 = $this->pdo->prepare(
            'SELECT id, name, description, parent_id, url_image, created_at 
         FROM categories WHERE id = :id'
        );
        $get2->execute(['id' => $id]);
        $row = $get2->fetch(PDO::FETCH_ASSOC);

        return [
            200,
            [
                'error' => false,
                'message' => 'Cập nhật category thành công',
                'data' => Categories::fromArray($row)->toArray()
            ]
        ];
    }



    /** Xoá category theo id */
    public function delete(int $id): array
    {
        // 1) Tồn tại?
        $get = $this->pdo->prepare('SELECT id FROM categories WHERE id = :id');
        $get->execute(['id' => $id]);
        if (!$get->fetchColumn()) {
            return [404, ['error' => true, 'message' => 'Category not found']];
        }

        try {
            $this->pdo->beginTransaction();

            // 2) Gom toàn bộ id con/cháu (ưu tiên CTE MySQL 8+)
            $ids = [];
            try {
                $sqlTree = "
                WITH RECURSIVE tree AS (
                    SELECT id FROM categories WHERE id = :root
                    UNION ALL
                    SELECT c.id
                    FROM categories c
                    INNER JOIN tree t ON c.parent_id = t.id
                )
                SELECT id FROM tree
            ";
                $stmt = $this->pdo->prepare($sqlTree);
                $stmt->execute(['root' => $id]);
                $ids = array_map('intval', $stmt->fetchAll(PDO::FETCH_COLUMN));
            } catch (\PDOException $e) {
                // Fallback nếu không có CTE
                $ids = [$id];
                $queue = [$id];
                while ($queue) {
                    $in = implode(',', array_fill(0, count($queue), '?'));
                    $childStmt = $this->pdo->prepare("SELECT id FROM categories WHERE parent_id IN ($in)");
                    $childStmt->execute($queue);
                    $children = array_map('intval', $childStmt->fetchAll(PDO::FETCH_COLUMN));
                    $queue = $children;
                    $ids = array_merge($ids, $children);
                }
            }

            if (!$ids) {
                $this->pdo->commit();
                return [200, ['error' => false, 'message' => 'Không có bản ghi để xoá', 'deleted' => 0, 'ids' => []]];
            }

            // 3) Lấy trước danh sách relative image paths để xoá file sau khi DB commit
            $inImg = implode(',', array_fill(0, count($ids), '?'));
            $imgStmt = $this->pdo->prepare("SELECT url_image FROM categories WHERE id IN ($inImg)");
            $imgStmt->execute($ids);
            $imgRows = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

            // 4) Xoá DB
            $in = implode(',', array_fill(0, count($ids), '?'));
            $del = $this->pdo->prepare("DELETE FROM categories WHERE id IN ($in)");
            $del->execute($ids);
            $deleted = $del->rowCount();

            $this->pdo->commit();

            // 5) Xoá file ảnh (sau khi DB commit để tránh mồ côi dữ liệu nếu xoá file lỗi)
            $baseDir = dirname(__DIR__, 2); // trỏ tới thư mục /be
            $removed_files = [];
            $failed_files = [];

            foreach ($imgRows as $rel) {
                $rel = trim((string) $rel);
                if ($rel === '')
                    continue; // không có ảnh
                // chỉ cho phép đường dẫn tương đối dưới /upload để an toàn
                if (str_starts_with($rel, 'upload/')) {
                    $absPath = $baseDir . '/' . $rel;
                    if (is_file($absPath)) {
                        if (@unlink($absPath)) {
                            $removed_files[] = $rel;
                        } else {
                            $failed_files[] = $rel;
                        }
                    }
                }
            }

            return [
                200,
                [
                    'error' => false,
                    'message' => 'Xoá category (kèm toàn bộ con/cháu) thành công',
                    'deleted' => $deleted,
                    'ids' => $ids,
                    'removed_files' => $removed_files,
                    'failed_files' => $failed_files
                ]
            ];

        } catch (\PDOException $e) {
            $this->pdo->rollBack();
            if ($e->getCode() === '23000') {
                // Thường do products.category_id RESTRICT
                return [
                    409,
                    [
                        'error' => true,
                        'message' => 'Không thể xoá do ràng buộc dữ liệu (foreign key). Hãy đặt FK products(category_id) = ON DELETE SET NULL.',
                        'detail' => $e->getMessage()
                    ]
                ];
            }
            return [500, ['error' => true, 'message' => 'Lỗi khi xoá category', 'detail' => $e->getMessage()]];
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            return [500, ['error' => true, 'message' => 'Lỗi khi xoá category', 'detail' => $e->getMessage()]];
        }
    }


}

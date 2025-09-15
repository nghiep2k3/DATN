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



    // /** Lấy tất cả categories (có tìm kiếm + phân trang nhẹ) */
    // public function list(array $query): array
    // {
    //     $page = max(1, (int) ($query['page'] ?? 1));
    //     $limit = min(100, max(1, (int) ($query['limit'] ?? 50)));
    //     $offset = ($page - 1) * $limit;

    //     $where = [];
    //     $params = [];

    //     if (!empty($query['search'])) {
    //         $where[] = 'name LIKE :kw';
    //         $params['kw'] = '%' . $query['search'] . '%';
    //     }

    //     $whereSql = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    //     // total
    //     $countSql = "SELECT COUNT(*) FROM categories $whereSql";
    //     $stm = $this->pdo->prepare($countSql);
    //     $stm->execute($params);
    //     $total = (int) $stm->fetchColumn();

    //     // data (chỉ các cột còn tồn tại: id, name, description; created_at nếu không có sẽ không ảnh hưởng)
    //     $sql = "SELECT id, name, description, " . // nếu không có created_at thì MySQL sẽ lỗi => chọn cách an toàn: NULL AS created_at
    //         "       NULL AS created_at
    //             FROM categories
    //             $whereSql
    //             ORDER BY id ASC
    //             LIMIT :limit OFFSET :offset";
    //     $stm = $this->pdo->prepare($sql);
    //     foreach ($params as $k => $v)
    //         $stm->bindValue(':' . $k, $v);
    //     $stm->bindValue(':limit', $limit, PDO::PARAM_INT);
    //     $stm->bindValue(':offset', $offset, PDO::PARAM_INT);
    //     $stm->execute();

    //     $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
    //     $items = array_map(fn($r) => Categories::fromArray($r)->toArray(), $rows);

    //     return [
    //         200,
    //         [
    //             'error' => false,
    //             'data' => $items,
    //             'pagination' => [
    //                 'total' => $total,
    //                 'page' => $page,
    //                 'limit' => $limit,
    //                 'pages' => (int) ceil($total / $limit)
    //             ]
    //         ]
    //     ];
    // }

    /** Lấy tất cả cha kèm con; hoặc 1 cha theo id kèm con */
    public function listWithChildren(?int $parentId = null): array
    {
        if ($parentId) {
            // lấy 1 cha
            $pstmt = $this->pdo->prepare(
                'SELECT id, name FROM categories WHERE id = :id AND parent_id IS NULL LIMIT 1'
            );
            $pstmt->execute(['id' => $parentId]);
            $parent = $pstmt->fetch(PDO::FETCH_ASSOC);
            if (!$parent)
                return [404, ['error' => true, 'message' => 'Parent category not found']];

            $cstmt = $this->pdo->prepare(
                'SELECT id, name, created_at FROM categories WHERE parent_id = :pid ORDER BY id ASC'
            );
            $cstmt->execute(['pid' => $parentId]);
            $children = $cstmt->fetchAll(PDO::FETCH_ASSOC);

            return [
                200,
                [
                    [
                        'category' => $parent['name'],
                        'sub_category' => $children,
                    ]
                ]
            ];
        }

        // tất cả cha
        $parents = $this->pdo->query(
            'SELECT id, name FROM categories WHERE parent_id IS NULL ORDER BY id ASC'
        )->fetchAll(PDO::FETCH_ASSOC);

        if (!$parents)
            return [200, []];

        // lấy toàn bộ con cho các cha trong 1 query
        $ids = array_column($parents, 'id');
        $in = implode(',', array_fill(0, count($ids), '?'));

        $cstmt = $this->pdo->prepare(
            "SELECT id, name, created_at, parent_id 
           FROM categories 
           WHERE parent_id IN ($in)
           ORDER BY parent_id ASC, id ASC"
        );
        $cstmt->execute($ids);
        $allChildren = $cstmt->fetchAll(PDO::FETCH_ASSOC);

        // group children theo parent_id
        $grouped = [];
        foreach ($allChildren as $c) {
            $grouped[(int) $c['parent_id']][] = [
                'id' => (int) $c['id'],
                'name' => $c['name'],
                'created_at' => $c['created_at']
            ];
        }

        // build output
        $out = [];
        foreach ($parents as $p) {
            $out[] = [
                'category' => $p['name'],
                'sub_category' => $grouped[(int) $p['id']] ?? []
            ];
        }
        return [200, $out];
    }

    /** Lấy 1 category theo id */
    public function show(int $id): array
    {
        $sql = "SELECT id, name, description, NULL AS created_at
                FROM categories WHERE id = :id LIMIT 1";
        $stm = $this->pdo->prepare($sql);
        $stm->execute(['id' => $id]);
        $row = $stm->fetch(PDO::FETCH_ASSOC);

        if (!$row)
            return [404, ['error' => true, 'message' => 'Category not found']];
        return [200, ['error' => false, 'data' => Categories::fromArray($row)->toArray()]];
    }

    /* create/update/delete cũ của bạn vẫn dùng bình thường
       — khi tạo subcategory chỉ cần truyền parent_id */
    public function create(array $input): array
    {
        $name = trim($input['name'] ?? '');
        $description = isset($input['description']) ? trim((string) $input['description']) : null;
        $parent_id = isset($input['parent_id']) ? (int) $input['parent_id'] : null;

        if ($name === '')
            return [422, ['error' => true, 'message' => 'Tên category là bắt buộc']];
        if (mb_strlen($name) > 255)
            return [422, ['error' => true, 'message' => 'Tên category tối đa 255 ký tự']];

        // nếu truyền parent_id thì parent phải tồn tại và là cha (parent_id IS NULL)
        if ($parent_id) {
            $chkParent = $this->pdo->prepare('SELECT 1 FROM categories WHERE id = :id AND parent_id IS NULL');
            $chkParent->execute(['id' => $parent_id]);
            if (!$chkParent->fetchColumn()) {
                return [422, ['error' => true, 'message' => 'parent_id không hợp lệ']];
            }
        }

        $dup = $this->pdo->prepare(
            'SELECT 1 FROM categories WHERE name = :name AND IFNULL(parent_id,0) = IFNULL(:pid,0) LIMIT 1'
        );
        $dup->execute(['name' => $name, 'pid' => $parent_id]);
        if ($dup->fetchColumn())
            return [409, ['error' => true, 'message' => 'Tên category đã tồn tại trong nhóm']];

        $stmt = $this->pdo->prepare(
            'INSERT INTO categories (name, description, parent_id, created_at) 
           VALUES (:name, :description, :parent_id, :created_at)'
        );
        $stmt->execute([
            'name' => $name,
            'description' => $description ?: null,
            'parent_id' => $parent_id ?: null,
            'created_at' => (new \DateTime('now', new \DateTimeZone('Asia/Ho_Chi_Minh')))->format('Y-m-d H:i:s')
        ]);
        return [201, ['error' => false, 'message' => 'Tạo category thành công', 'id' => (int) $this->pdo->lastInsertId()]];
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
        date_default_timezone_set('Asia/Ho_Chi_Minh');

        $now = date('Y-m-d H:i:s'); // giờ Việt Nam (UTC+7)

        // tồn tại?
        $get = $this->pdo->prepare('SELECT id, name, description, created_at FROM categories WHERE id = :id');
        $get->execute(['id' => $id]);
        $current = $get->fetch(PDO::FETCH_ASSOC);
        if (!$current) {
            return [404, ['error' => true, 'message' => 'Category not found']];
        }

        $name = trim($input['name'] ?? $current['name']);
        $description = array_key_exists('description', $input)
            ? trim((string) $input['description'])
            : $current['description'];

        // validate
        if ($name === '') {
            return [422, ['error' => true, 'message' => 'Tên category là bắt buộc']];
        }
        if (mb_strlen($name) > 255) {
            return [422, ['error' => true, 'message' => 'Tên tối đa 255 ký tự']];
        }

        // trùng tên (trừ chính nó)
        $chk = $this->pdo->prepare('SELECT 1 FROM categories WHERE name = :name AND id <> :id LIMIT 1');
        $chk->execute(['name' => $name, 'id' => $id]);
        if ($chk->fetchColumn()) {
            return [409, ['error' => true, 'message' => 'Tên category đã tồn tại']];
        }

        // update: cập nhật luôn created_at thành thời điểm hiện tại
        $sql = 'UPDATE categories 
            SET name = :name, description = :description, created_at = :created_at 
            WHERE id = :id';
        $stm = $this->pdo->prepare($sql);
        $stm->execute([
            'name' => $name,
            'description' => $description !== '' ? $description : null,
            'created_at' => $now,
            'id' => $id
        ]);

        // lấy lại bản ghi
        $get2 = $this->pdo->prepare('SELECT id, name, description, created_at FROM categories WHERE id = :id');
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
        // tồn tại?
        $get = $this->pdo->prepare('SELECT id FROM categories WHERE id = :id');
        $get->execute(['id' => $id]);
        if (!$get->fetchColumn())
            return [404, ['error' => true, 'message' => 'Category not found']];

        try {
            $del = $this->pdo->prepare('DELETE FROM categories WHERE id = :id');
            $del->execute(['id' => $id]);
            return [200, ['error' => false, 'message' => 'Xoá category thành công']];
        } catch (PDOException $e) {
            // nếu FK không cho xoá (tuỳ schema), trả 409
            return [409, ['error' => true, 'message' => 'Không thể xoá category do ràng buộc dữ liệu', 'detail' => $e->getMessage()]];
        }
    }
}

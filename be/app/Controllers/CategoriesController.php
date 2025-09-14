<?php
namespace App\Controllers;

use App\Models\Categories;
use PDO;

class CategoriesController
{
    public function __construct(private PDO $pdo) {}

    /** Lấy tất cả categories (có tìm kiếm + phân trang nhẹ) */
    public function list(array $query): array
    {
        $page   = max(1, (int)($query['page'] ?? 1));
        $limit  = min(100, max(1, (int)($query['limit'] ?? 50)));
        $offset = ($page - 1) * $limit;

        $where  = [];
        $params = [];

        if (!empty($query['search'])) {
            $where[] = 'name LIKE :kw';
            $params['kw'] = '%'.$query['search'].'%';
        }

        $whereSql = $where ? 'WHERE '.implode(' AND ', $where) : '';

        // total
        $countSql = "SELECT COUNT(*) FROM categories $whereSql";
        $stm = $this->pdo->prepare($countSql);
        $stm->execute($params);
        $total = (int)$stm->fetchColumn();

        // data (chỉ các cột còn tồn tại: id, name, description; created_at nếu không có sẽ không ảnh hưởng)
        $sql = "SELECT id, name, description, ". // nếu không có created_at thì MySQL sẽ lỗi => chọn cách an toàn: NULL AS created_at
               "       NULL AS created_at
                FROM categories
                $whereSql
                ORDER BY id ASC
                LIMIT :limit OFFSET :offset";
        $stm = $this->pdo->prepare($sql);
        foreach ($params as $k=>$v) $stm->bindValue(':'.$k, $v);
        $stm->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stm->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stm->execute();

        $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
        $items = array_map(fn($r)=>Categories::fromArray($r)->toArray(), $rows);

        return [200, [
            'error' => false,
            'data'  => $items,
            'pagination' => [
                'total' => $total,
                'page'  => $page,
                'limit' => $limit,
                'pages' => (int)ceil($total/$limit)
            ]
        ]];
    }

    /** Lấy 1 category theo id */
    public function show(int $id): array
    {
        $sql = "SELECT id, name, description, NULL AS created_at
                FROM categories WHERE id = :id LIMIT 1";
        $stm = $this->pdo->prepare($sql);
        $stm->execute(['id'=>$id]);
        $row = $stm->fetch(PDO::FETCH_ASSOC);

        if (!$row) return [404, ['error'=>true, 'message'=>'Category not found']];
        return [200, ['error'=>false, 'data'=>Categories::fromArray($row)->toArray()]];
    }

    /** Tạo category mới */
    public function create(array $input): array
    {
        $name = trim($input['name'] ?? '');
        $description = isset($input['description']) ? trim((string)$input['description']) : null;

        // Validate
        if ($name === '') {
            return [422, ['error' => true, 'message' => 'Tên category là bắt buộc']];
        }
        if (mb_strlen($name) > 255) {
            return [422, ['error' => true, 'message' => 'Tên category tối đa 255 ký tự']];
        }

        // Kiểm tra trùng tên (app-level). Nếu bạn đặt UNIQUE(name) ở DB thì có thể bỏ đoạn này.
        $chk = $this->pdo->prepare('SELECT 1 FROM categories WHERE name = :name LIMIT 1');
        $chk->execute(['name' => $name]);
        if ($chk->fetchColumn()) {
            return [409, ['error' => true, 'message' => 'Tên category đã tồn tại']];
        }

        // Insert
        $sql = 'INSERT INTO categories (name, description) VALUES (:name, :description)';
        $stm = $this->pdo->prepare($sql);
        $stm->execute([
            'name'        => $name,
            'description' => $description ?: null
        ]);
        $id = (int)$this->pdo->lastInsertId();

        // Lấy lại bản ghi vừa tạo
        $get = $this->pdo->prepare('SELECT id, name, description, NULL AS created_at FROM categories WHERE id = :id');
        $get->execute(['id' => $id]);
        $row = $get->fetch(PDO::FETCH_ASSOC);

        return [201, [
            'error' => false,
            'message' => 'Tạo category thành công',
            'data' => Categories::fromArray($row)->toArray()
        ]];
    }
}

<?php
namespace App\Controllers;

use App\Models\Product;
use PDO;

class ProductController
{
    public function __construct(private PDO $pdo) {}

    /** Lấy chi tiết 1 sản phẩm theo id */
    public function show(int $id): array {
        $sql = "
            SELECT p.*, b.name AS brand_name, c.name AS category_name
            FROM Products p
            LEFT JOIN Brands b ON b.id = p.brand_id
            LEFT JOIN Categories c ON c.id = p.category_id
            WHERE p.id = :id
            LIMIT 1
        ";
        $stm = $this->pdo->prepare($sql);
        $stm->execute(['id' => $id]);
        $row = $stm->fetch(PDO::FETCH_ASSOC);
        if (!$row) return [404, ['error'=>true,'message'=>'Product not found']];

        $product = Product::fromArray($row)->toArray();
        // gắn thêm tên brand/category nếu cần
        $product['brand_name'] = $row['brand_name'] ?? null;
        $product['category_name'] = $row['category_name'] ?? null;

        return [200, ['error'=>false, 'data'=>$product]];
    }

    /** Danh sách + lọc + phân trang */
    public function list(array $query): array {
        $page  = max(1, (int)($query['page'] ?? 1));
        $limit = min(100, max(1, (int)($query['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        $where = [];
        $params = [];

        if (!empty($query['search'])) {
            $where[] = '(p.name LIKE :kw OR p.sku LIKE :kw)';
            $params['kw'] = '%'.$query['search'].'%';
        }
        if (!empty($query['category_id'])) {
            $where[] = 'p.category_id = :cid';
            $params['cid'] = (int)$query['category_id'];
        }
        if (!empty($query['brand_id'])) {
            $where[] = 'p.brand_id = :bid';
            $params['bid'] = (int)$query['brand_id'];
        }
        $whereSql = $where ? 'WHERE '.implode(' AND ', $where) : '';

        $sortMap = ['name'=>'p.name','price'=>'p.price','created_at'=>'p.created_at'];
        $sort  = strtolower($query['sort'] ?? 'created_at');
        $order = strtolower($query['order'] ?? 'desc');
        $order = $order === 'asc' ? 'ASC' : 'DESC';
        $sortCol = $sortMap[$sort] ?? 'p.created_at';

        // total
        $countSql = "SELECT COUNT(*) FROM Products p $whereSql";
        $stm = $this->pdo->prepare($countSql);
        $stm->execute($params);
        $total = (int)$stm->fetchColumn();

        // data
        $sql = "
            SELECT
                p.*, b.name AS brand_name, c.name AS category_name
            FROM Products p
            LEFT JOIN Brands b ON b.id = p.brand_id
            LEFT JOIN Categories c ON c.id = p.category_id
            $whereSql
            ORDER BY $sortCol $order
            LIMIT :limit OFFSET :offset
        ";
        $stm = $this->pdo->prepare($sql);
        foreach ($params as $k=>$v) $stm->bindValue(':'.$k, $v);
        $stm->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stm->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stm->execute();

        $rows = $stm->fetchAll(PDO::FETCH_ASSOC);
        // hydrate -> array
        $items = [];
        foreach ($rows as $r) {
            $p = Product::fromArray($r)->toArray();
            $p['brand_name'] = $r['brand_name'] ?? null;
            $p['category_name'] = $r['category_name'] ?? null;
            $items[] = $p;
        }

        return [200, [
            'error'=>false,
            'data'=>$items,
            'pagination'=>[
                'total'=>$total,
                'page'=>$page,
                'limit'=>$limit,
                'pages'=>(int)ceil($total/$limit),
                'sort'=>$sort,
                'order'=>strtolower($order)
            ]
        ]];
    }
}

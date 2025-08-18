<?php
namespace App\Controllers;

use App\Models\Product;
use PDO;

class ProductController
{
    public function __construct(private PDO $pdo) {}

    // GET /api/products
    public function getData(): void
    {
        $page     = max(1, (int)($_GET['page'] ?? 1));
        $perPage  = min(100, max(1, (int)($_GET['per_page'] ?? 12)));
        $q        = trim((string)($_GET['q'] ?? ''));
        $catId    = isset($_GET['category_id']) ? (int)$_GET['category_id'] : null;
        $brandId  = isset($_GET['brand_id'])    ? (int)$_GET['brand_id']    : null;

        $sortBy   = strtolower($_GET['sort_by'] ?? 'created_at');
        $order    = strtolower($_GET['order']   ?? 'desc');
        $allowed  = ['created_at','price','name'];
        if (!in_array($sortBy, $allowed, true)) $sortBy = 'created_at';
        $order = $order === 'asc' ? 'ASC' : 'DESC';

        $offset = ($page-1)*$perPage;

        $where = []; $p = [];
        if ($q !== '')         { $where[] = 'p.name LIKE :q';     $p[':q']   = "%{$q}%"; }
        if (!is_null($catId))  { $where[] = 'p.category_id=:cid'; $p[':cid'] = $catId; }
        if (!is_null($brandId)){ $where[] = 'p.brand_id=:bid';    $p[':bid'] = $brandId; }

        $whereSql = $where ? 'WHERE '.implode(' AND ', $where) : '';

        // total
        $cst = $this->pdo->prepare("SELECT COUNT(*) FROM Products p {$whereSql}");
        foreach ($p as $k=>$v) $cst->bindValue($k, $v, is_int($v)?\PDO::PARAM_INT:\PDO::PARAM_STR);
        $cst->execute();
        $total = (int)$cst->fetchColumn();

        // data
        $sql = "SELECT p.id, p.name, p.sku, p.price, p.stock_quantity, p.image_url,
                       b.name AS brand_name, c.name AS category_name, p.created_at
                FROM Products p
                LEFT JOIN Brands b ON p.brand_id=b.id
                LEFT JOIN Categories c ON p.category_id=c.id
                {$whereSql}
                ORDER BY p.{$sortBy} {$order}
                LIMIT :limit OFFSET :offset";
        $st = $this->pdo->prepare($sql);
        foreach ($p as $k=>$v) $st->bindValue($k, $v, is_int($v)?\PDO::PARAM_INT:\PDO::PARAM_STR);
        $st->bindValue(':limit',  $perPage, \PDO::PARAM_INT);
        $st->bindValue(':offset', $offset,  \PDO::PARAM_INT);
        $st->execute();

        $rows = array_map(fn($r)=> (new Product($r))->toArray(), $st->fetchAll());

        $this->json([
            'data' => $rows,
            'pagination' => [
                'page'=>$page,'per_page'=>$perPage,'total'=>$total,
                'total_pages'=> max(1,(int)ceil($total/$perPage))
            ],
            'filters' => [
                'q'=>$q,'category_id'=>$catId,'brand_id'=>$brandId,
                'sort_by'=>$sortBy,'order'=>strtolower($order)
            ]
        ]);
    }

    // GET /api/products/{id}
    public function show(int $id): void
    {
        $st = $this->pdo->prepare(
            "SELECT p.*, b.name AS brand_name, c.name AS category_name
             FROM Products p
             LEFT JOIN Brands b ON p.brand_id=b.id
             LEFT JOIN Categories c ON p.category_id=c.id
             WHERE p.id=:id LIMIT 1"
        );
        $st->bindValue(':id', $id, \PDO::PARAM_INT);
        $st->execute();
        $row = $st->fetch();
        if (!$row) $this->json(['error'=>true,'message'=>'Not found'], 404);

        $this->json(['data'=>(new Product($row))->toArray()]);
    }

    private function json($data, int $code=200): void
    {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }
}

<?php
namespace App\Models;

class Product {
    public int $id;
    public string $name;
    public ?string $sku;
    public ?string $description;
    public float $price;
    public int $stock_quantity;
    public ?int $brand_id;
    public ?int $category_id;
    public ?string $image_url;
    public ?string $created_at;

    public function __construct(array $row) {
        $this->id = (int)($row['id'] ?? 0);
        $this->name = $row['name'] ?? '';
        $this->sku = $row['sku'] ?? null;
        $this->description = $row['description'] ?? null;
        $this->price = (float)($row['price'] ?? 0);
        $this->stock_quantity = (int)($row['stock_quantity'] ?? 0);
        $this->brand_id = isset($row['brand_id']) ? (int)$row['brand_id'] : null;
        $this->category_id = isset($row['category_id']) ? (int)$row['category_id'] : null;
        $this->image_url = $row['image_url'] ?? null;
        $this->created_at = $row['created_at'] ?? null;
    }

    public static function fromArray(array $row): self { return new self($row); }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'description' => $this->description,
            'price' => $this->price,
            'stock_quantity' => $this->stock_quantity,
            'brand_id' => $this->brand_id,
            'category_id' => $this->category_id,
            'image_url' => $this->image_url,
            'created_at' => $this->created_at,
        ];
    }
}

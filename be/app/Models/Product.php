<?php
// Name: be/app/Models/Product.php

namespace App\Models;

class Product
{
    public int $id;
    public string $name;
    public ?string $sku;
    public float $price;
    public int $stock_quantity;
    public ?string $image_url;
    public ?string $brand_name;
    public ?string $category_name;
    public ?string $created_at;

    public function __construct(array $row)
    {
        $this->id             = (int)($row['id'] ?? 0);
        $this->name           = (string)($row['name'] ?? '');
        $this->sku            = $row['sku'] ?? null;
        $this->price          = (float)($row['price'] ?? 0);
        $this->stock_quantity = (int)($row['stock_quantity'] ?? 0);
        $this->image_url      = $row['image_url'] ?? null;
        $this->brand_name     = $row['brand_name'] ?? null;
        $this->category_name  = $row['category_name'] ?? null;
        $this->created_at     = $row['created_at'] ?? null;
    }

    public function toArray(): array
    {
        return [
            'id'=>$this->id,'name'=>$this->name,'sku'=>$this->sku,
            'price'=>$this->price,'stock_quantity'=>$this->stock_quantity,
            'image_url'=>$this->image_url,'brand_name'=>$this->brand_name,
            'category_name'=>$this->category_name,'created_at'=>$this->created_at
        ];
    }
}

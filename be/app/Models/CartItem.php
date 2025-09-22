<?php
// app/Models/CartItem.php
namespace App\Models;

class CartItem
{
    public ?int $id;
    public ?int $user_id;
    public ?int $product_id;
    public ?int $quantity;
    public ?string $number_phone;

    public function __construct(
        ?int $id,
        ?int $user_id,
        ?int $product_id,
        ?int $quantity,
        ?string $number_phone
    ) {
        $this->id = $id;
        $this->user_id = $user_id;
        $this->product_id = $product_id;
        $this->quantity = $quantity;
        $this->number_phone = $number_phone;
    }

    public static function fromArray(array $data): CartItem
    {
        return new CartItem(
            $data['id'] ?? null,
            $data['user_id'] ?? null,
            $data['product_id'] ?? null,
            $data['quantity'] ?? null,
            $data['number_phone'] ?? null
        );
    }
}

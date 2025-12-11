<?php
namespace App\Models;

class Orders
{
    public ?int $id = null;
    public ?int $user_id = null;
    public ?string $full_name = null;
    public ?string $phone = null;
    public ?string $email = null;
    public ?string $status = "Đang lấy hàng";
    public ?float $total_price = null;
    public ?string $product_list = null;
    public ?string $shipping_address = null;
    public ?string $note = null;
    public ?string $payment_method = "Thanh toán QR code";
    public ?string $contentCk = null;
    public ?string $created_at = null;

    public function __construct(
        ?int $user_id = null,
        ?string $full_name = null,
        ?string $phone = null,
        ?string $email = null,
        ?string $status = null,
        ?float $total_price = null,
        ?string $product_list = null,
        ?string $shipping_address = null,
        ?string $note = null,
        ?string $payment_method = null,
        ?string $contentCk = null,
        ?string $created_at = null
    ) {
        $this->user_id = $user_id;
        $this->full_name = $full_name;
        $this->phone = $phone;
        $this->email = $email;
        $this->status = $status;
        $this->total_price = $total_price;
        $this->product_list = $product_list;
        $this->shipping_address = $shipping_address;
        $this->note = $note;
        $this->payment_method = $payment_method;
        $this->contentCk = $contentCk;
        $this->created_at = $created_at;
    }

    /**
     * Tạo Order từ mảng
     */
    public static function fromArray(array $data): self
    {
        $order = new self();
        $order->id = $data['id'] ?? null;
        $order->user_id = $data['user_id'] ?? null;
        $order->full_name = $data['full_name'] ?? null;
        $order->phone = $data['phone'] ?? null;
        $order->email = $data['email'] ?? null;
        $order->status = $data['status'] ?? null;
        $order->total_price = $data['total_price'] ?? null;
        $order->product_list = $data['product_list'] ?? null;
        $order->shipping_address = $data['shipping_address'] ?? null;
        $order->note = $data['note'] ?? null;
        $order->payment_method = $data['payment_method'] ?? null;
        $order->contentCk = $data['contentCk'] ?? null;
        $order->created_at = $data['created_at'] ?? null;
        return $order;
    }

    /**
     * Chuyển Order thành mảng
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'full_name' => $this->full_name,
            'phone' => $this->phone,
            'email' => $this->email,
            'status' => $this->status,
            'total_price' => $this->total_price,
            'product_list' => $this->product_list ? json_decode($this->product_list, true) : null,
            'shipping_address' => $this->shipping_address,
            'note' => $this->note,
            'payment_method' => $this->payment_method,
            'contentCk' => $this->contentCk,
            'created_at' => $this->created_at
        ];
    }
}
?>
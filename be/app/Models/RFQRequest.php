<?php
// be/app/Models/RFQRequest.php

namespace App\Models;

class RFQRequest
{
    public int $id;
    public string $request_code;

    public ?int $user_id;

    // Thông tin khách hàng
    public string $full_name;
    public string $phone;
    public string $email;

    // Thông tin sản phẩm
    public ?string $product_name;
    public ?int $quantity;
    public ?string $product_list;

    public ?string $notes;

    // Kỹ thuật
    public ?string $budget_range;

    // File upload
    public ?string $attachment_url;

    // System
    public string $status;
    public ?string $ip_address;
    public ?string $user_agent;

    public string $created_at;
    public string $updated_at;

    public function __construct(array $row)
    {
        $this->id = (int)($row['id'] ?? 0);
        $this->request_code = $row['request_code'] ?? '';

        $this->user_id = isset($row['user_id']) ? (int)$row['user_id'] : null;

        $this->full_name = $row['full_name'] ?? '';
        $this->phone = $row['phone'] ?? '';
        $this->email = $row['email'] ?? '';

        $this->product_name = $row['product_name'] ?? null;
        $this->quantity = isset($row['quantity']) ? (int)$row['quantity'] : null;
        $this->product_list = $row['product_list'] ?? null;

        $this->notes = $row['notes'] ?? null;

        $this->budget_range = $row['budget_range'] ?? null;

        $this->attachment_url = $row['attachment_url'] ?? null;

        $this->status = $row['status'] ?? 'pending';
        $this->ip_address = $row['ip_address'] ?? null;
        $this->user_agent = $row['user_agent'] ?? null;

        $this->created_at = $row['created_at'] ?? '';
        $this->updated_at = $row['updated_at'] ?? '';
    }

    public static function fromArray(array $row): self
    {
        return new self($row);
    }

    public function toArray(): array
    {
        return [
            'id'                 => $this->id,
            'request_code'       => $this->request_code,
            'user_id'            => $this->user_id,

            'full_name'          => $this->full_name,
            'phone'              => $this->phone,
            'email'              => $this->email,

            'product_name'       => $this->product_name,
            'quantity'           => $this->quantity,
            'product_list'       => $this->product_list,

            'notes'              => $this->notes,
            'budget_range'       => $this->budget_range,

            'attachment_url'     => $this->attachment_url,

            'status'             => $this->status,
            'ip_address'         => $this->ip_address,
            'user_agent'         => $this->user_agent,

            'created_at'         => $this->created_at,
            'updated_at'         => $this->updated_at,
        ];
    }
}

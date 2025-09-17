<?php
// be/app/Models/Brands.php
namespace App\Models;

class Brands {
    public int $id;
    public string $name;
    public ?string $description;
    public ?string $url_image;
    public ?string $created_at;

    public function __construct(array $row) {
        $this->id = (int)($row['id'] ?? 0);
        $this->name = $row['name'] ?? '';
        $this->description = $row['description'] ?? null;
        $this->url_image = $row['url_image'] ?? null;
        $this->created_at = $row['created_at'] ?? null;
    }

    public static function fromArray(array $row): self { return new self($row); }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'url_image' => $this->url_image,
            'created_at' => $this->created_at,
        ];
    }
}

?>
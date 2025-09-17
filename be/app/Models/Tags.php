<?php
// be/app/Models/Tags.php
namespace App\Models;
class Tags {
    public int $id;
    public string $name;

    public function __construct(array $row) {
        $this->id = (int)($row['id'] ?? 0);
        $this->name = $row['name'] ?? '';
    }

    public static function fromArray(array $row): self { return new self($row); }

    public function toArray(): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
        ];
    }
}


?>
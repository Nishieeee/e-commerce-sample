<?php

namespace App\DTOs;

readonly class CartDTO
{
    public function __construct(
        public int $user_id,
        public int $product_id,
        public ?int $quantity = null,
    ) {}
}

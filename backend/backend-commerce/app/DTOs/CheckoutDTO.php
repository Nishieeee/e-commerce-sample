<?php

namespace App\DTOs;
use App\Models\User;
use App\Models\Product;

readonly class CheckoutDTO
{
    public function __construct(
        public int $user_id,
        public int $product_id,
        public int $quantity,
    ) {
    }
}
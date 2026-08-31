<?php

namespace App\DTOs;
use App\Models\User;
use App\Models\Product;


readonly class CheckoutDTO
{
    public function __construct(
        public int $user_id,
        public array $cart_items,
    ) {
    }
}
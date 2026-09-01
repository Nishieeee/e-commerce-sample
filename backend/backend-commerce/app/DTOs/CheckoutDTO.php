<?php

namespace App\DTOs;

readonly class CheckoutDTO
{
    public function __construct(
        public int $user_id,
        public array $cart_items,
    ) {}
}

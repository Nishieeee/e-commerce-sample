<?php 

namespace App\DTOs;

use App\Models\User;
use App\Models\Product;
use App\Models\Cart;

readonly class CheckoutDTO {

    public function _construct(
        public int $user_id,
        public int $product_id,
        public int $price_at_add
    ) {
        
    }
}
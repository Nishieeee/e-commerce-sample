<?php 

namespace App\DTOs;

use App\Models\User;
use App\Models\Product;
use App\Models\Cart;

readonly class CartDTO {

    public function __construct(
        public int $user_id,
        public int $product_id,
    ) {
        
    }
}
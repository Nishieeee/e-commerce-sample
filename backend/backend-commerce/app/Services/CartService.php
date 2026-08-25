<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

use App\Models\CartItem;
use App\Models\Order;
use App\DTOs\CartDTO;

class CartService 
{
    public function addToCart(CartDTO $dto) {
        DB::transaction(function () use ($dto){

            // finds an existing if non exist create a new cart
            $cart = Cart::firstOrCreate([
               [ 
                   'user_id' => $dto->user_id
               ],
               [
                   'id' => Str::uuid()->toString(),
                   'user_id' => $dto->user_id,
                   'session_id' => session()->getId(),
                   'expires_at' => now()->addDays(7)
               ]
            ]);

               
        });
    }
}

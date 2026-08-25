<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;


use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Product;
use App\DTOs\CartDTO;

class CartService 
{
    public function addToCart(CartDTO $dto) {
        DB::transaction(function () use ($dto){

            // finds an existing cart if non exist create a new cart
            $cart = Cart::firstOrCreate(
               [ 
                   'user_id' => $dto->user_id
               ],
               [
                   'id' => Str::uuid()->toString(),
                   'expires_at' => now()->addDays(7)
               ]
            );

            $product = Product::findOrFail($dto->product_id);
            
            // find and get the cart_item or create a new one 
            $cart_item = CartItem::firstOrNew([
               'cart_id' => $cart->id,
               'product_id' => $dto->product_id 
            ],
            [
                'quantity' => 0,
                'price_at_add' => $price->price,
            ]);

            // increment if there is any
            $cart_item->quantity += 1;
            // save to db
            $cart_item->save();       
        });
    }
}

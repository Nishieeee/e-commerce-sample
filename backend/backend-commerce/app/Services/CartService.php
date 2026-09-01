<?php

namespace App\Services;

use App\DTOs\CartDTO;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CartService
{
    public function __construct(
        protected InventoryService $inventoryservice
    ) {}

    public function fetchCartItemsFromCart(int $user_id)
    {
        return DB::transaction(function () use ($user_id) {

            // this will create a new cart for the user they'll visit cartpage
            $cart = Cart::firstOrCreate(
                [
                    'user_id' => $user_id,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'expires_at' => now()->addDays(7),
                ]
            );

            $cart_items = Cache::remember("cache_cart_{$user_id}", now()->addDays(7), function () use ($cart) {
                return CartItem::where('cart_id', $cart->id)->get();
            });

            return $cart_items;
        });
    }

    public function addToCart(CartDTO $dto)
    {
        return DB::transaction(function () use ($dto) {

            // finds an existing cart if non exist create a new cart
            $cart = Cart::firstOrCreate(
                [
                    'user_id' => $dto->user_id,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'expires_at' => now()->addDays(7),
                ]
            );

            $product = Product::findOrFail($dto->product_id);

            // find and get the cart_item or create a new one
            $cart_item = CartItem::firstOrNew([
                'cart_id' => $cart->id,
                'product_id' => $dto->product_id,
            ],
                [
                    'quantity' => 0,
                    'price_at_add' => $product->price,
                ]);

            // increment if there is any
            if ($dto->quantity) {
                $cart_item->quantity += $dto->quantity;
            } else {
                $cart_item->quantity += 1;
            }

            $this->inventoryservice->incrementReservedQuantity($dto->product_id, $dto->quantity);

            // save to db
            $cart_item->save();

            // get all cart items
            $cart_items = CartItem::where('cart_id', $cart->id)->get();

            return $cart_items;
        });
    }

    public function updateCart(CartDTO $dto)
    {
        return DB::transaction(function () use ($dto) {

            // finds an existing cart if non exist create a new cart
            $cart = Cart::firstOrCreate(
                [
                    'user_id' => $dto->user_id,
                ],
                [
                    'id' => Str::uuid()->toString(),
                    'expires_at' => now()->addDays(7),
                ]
            );

            // get cart_item to updateCart
            $cart_item = CartItem::where('cart_id', $cart->id)->where('product_id', $dto->product_id)->firstOrFail();

            // calculate reserved stock difference
            $difference = $dto->quantity - $cart_item->quantity;

            if ($difference > 0) {
                $this->inventoryservice->incrementReservedQuantity($dto->product_id, $difference);
            } elseif ($difference < 0) {
                $this->inventoryservice->releaseReservedQuantity($dto->product_id, abs($difference));
            }

            if ($dto->quantity <= 0) {
                $cart_item->delete();
            } else {
                $cart_item->quantity = $dto->quantity;
                $cart_item->save();
            }

            // get all cart items
            $cart_items = CartItem::where('cart_id', $cart->id)->get();

            return $cart_items;
        });
    }

    public function calculateCartTotal(Collection $cart_items)
    {

        // calculate cart total
        $cart_total = $cart_items->sum(function ($item) {
            return $item->quantity * $item->price;
        });

        return $cart_total;
    }
}

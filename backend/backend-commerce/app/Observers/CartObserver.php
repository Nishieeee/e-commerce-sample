<?php

namespace App\Observers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Support\Facades\Cache;

class CartObserver
{
    public function created(CartItem $cartItem): void
    {
        // clear user cart Cache
        $user_id = $cartItem->cart->user_id;
        Cache::forget("cache_cart_{$user_id}");
    }

    public function updated(CartItem $cartItem): void
    {
        // clear user cart Cache
        $user_id = $cartItem->cart->user_id;
        Cache::forget("cache_cart_{$user_id}");
    }

    public function deleted(CartItem $cartItem): void
    {
        // clear user cart Cache
        $user_id = $cartItem->cart->user_id;
        Cache::forget("cache_cart_{$user_id}");
    }

    public function forceDeleted(CartItem $cartItem): void
    {
        // clear user cart Cache
        $user_id = $cartItem->cart->user_id;
        Cache::forget("cache_cart_{$user_id}");
    }
}

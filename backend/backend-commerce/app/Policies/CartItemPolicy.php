<?php

namespace App\Policies;

use App\Models\User;
use App\Models\CartItem;
class CartItemPolicy
{
    /**
     * Create a new policy instance.
     */
     
    public function delete(User $user, CartItem $cart_item): bool {
        return $cart_item->cart->user_id === $user->id;
    }
}

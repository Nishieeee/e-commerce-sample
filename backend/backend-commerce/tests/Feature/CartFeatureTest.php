<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;

use App\Models\CartItem;
use App\Models\Cart;
use App\Models\Product;
use App\Models\User;

class CartFeatureTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    public function test_add_to_cart() {
        $user = User::factory()->create();
        $product = Product::factory()->create();
        \App\Models\InventoryItem::create(['product_id' => $product->id, 'quantity' => 10]);

        
        $response = $this
        ->actingAs($user)
        ->postJson('/api/cart/items', [
           'product_id'=>$product->id,
           'quantity'=>2,
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('cart_items', [
           'product_id' => $product->id,
           'quantity' => 2, 
        ]);
    }

    public function test_update_cart() {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 10.00]);
        \App\Models\InventoryItem::create(['product_id' => $product->id, 'quantity' => 10, 'reserved_quantity' => 1]);

        $cart = Cart::create(['user_id' => $user->id, 'expires_at' => now()->addDays(7)]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 1,
            'price_at_add' => 10.00
        ]);

        $response = $this
            ->actingAs($user)
            ->putJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 5,
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('cart_items', [
            'id' => $cartItem->id,
            'quantity' => 5, 
        ]);
    }

    public function test_update_cart_deletes_when_quantity_is_zero() {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 10.00]);
        \App\Models\InventoryItem::create(['product_id' => $product->id, 'quantity' => 10, 'reserved_quantity' => 2]);

        $cart = Cart::create(['user_id' => $user->id, 'expires_at' => now()->addDays(7)]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price_at_add' => 10.00
        ]);

        $response = $this
            ->actingAs($user)
            ->putJson('/api/cart/items', [
                'product_id' => $product->id,
                'quantity' => 0,
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }

    public function test_delete_cart_item() {
        $user = User::factory()->create();
        $product = Product::factory()->create(['price' => 10.00]);
        \App\Models\InventoryItem::create(['product_id' => $product->id, 'quantity' => 10, 'reserved_quantity' => 2]);

        $cart = Cart::create(['user_id' => $user->id, 'expires_at' => now()->addDays(7)]);
        $cartItem = CartItem::create([
            'cart_id' => $cart->id,
            'product_id' => $product->id,
            'quantity' => 2,
            'price_at_add' => 10.00
        ]);

        $response = $this
            ->actingAs($user)
            ->deleteJson('/api/cart/items/' . $cartItem->id);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('cart_items', [
            'id' => $cartItem->id,
        ]);
    }
}

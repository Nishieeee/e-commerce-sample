<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Product;
use App\Models\InventoryItem;
use Illuminate\Support\Facades\Queue;
use App\Jobs\ProcessOrderPayment;
use App\Jobs\SendOrderConfirmationEmail;

class CheckoutFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_checkout_successfully_from_cart()
    {
        Queue::fake();
        
        $user = User::factory()->create();
        $token = $user->createToken('auth')->plainTextToken;

        // Create the cart for the user
        $cart = \App\Models\Cart::create([
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7)
        ]);

        $product1 = Product::factory()->create(['price' => 10.00]);
        $product2 = Product::factory()->create(['price' => 20.00]);

        InventoryItem::create(['product_id' => $product1->id, 'quantity' => 10]);
        InventoryItem::create(['product_id' => $product2->id, 'quantity' => 5]);

        \App\Models\CartItem::create(['cart_id' => $cart->id, 'product_id' => $product1->id, 'quantity' => 2, 'price_at_add' => 10.00]);
        \App\Models\CartItem::create(['cart_id' => $cart->id, 'product_id' => $product2->id, 'quantity' => 1, 'price_at_add' => 20.00]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/checkout', []); // Notice no payload!

        $response->assertStatus(201);
        
        // Assert inventory deducted
        $this->assertDatabaseHas('inventory_items', ['product_id' => $product1->id, 'quantity' => 8]);
        $this->assertDatabaseHas('inventory_items', ['product_id' => $product2->id, 'quantity' => 4]);
        
        // Assert order created with correct total (10*2 + 20*1 = 40)
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 40.00
        ]);

        // Assert cart items are deleted
        $this->assertDatabaseMissing('cart_items', ['cart_id' => $cart->id]);

        Queue::assertPushedWithChain(ProcessOrderPayment::class, [
            SendOrderConfirmationEmail::class
        ]);
    }

    public function test_checkout_fails_if_insufficient_stock_in_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth')->plainTextToken;

        // Create the cart for the user
        $cart = \App\Models\Cart::create([
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7)
        ]);

        $product = Product::factory()->create(['price' => 10.00]);
        InventoryItem::create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        // Trying to buy 5, only 1 in stock
        \App\Models\CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 5, 'price_at_add' => 10.00]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/checkout', []); // Notice no payload!

        $response->assertStatus(400);
        $this->assertDatabaseHas('inventory_items', [
            'product_id' => $product->id,
            'quantity' => 1, // Stock should not change
        ]);
        
        // Cart item shouldn't be deleted because transaction rolled back
        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'quantity' => 5
        ]);
    }
}

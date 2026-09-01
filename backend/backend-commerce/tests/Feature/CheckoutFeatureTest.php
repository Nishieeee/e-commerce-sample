<?php

namespace Tests\Feature;

use App\Jobs\ProcessOrderPayment;
use App\Jobs\SendOrderConfirmationEmail;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\InventoryItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class CheckoutFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_checkout_successfully_from_cart()
    {
        Queue::fake();

        $user = User::factory()->create();
        $token = $user->createToken('auth')->plainTextToken;

        // Create the cart for the user
        $cart = Cart::create([
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7),
        ]);

        $product1 = Product::factory()->create(['price' => 10.00]);
        $product2 = Product::factory()->create(['price' => 20.00]);

        InventoryItem::create(['product_id' => $product1->id, 'quantity' => 8, 'reserved_quantity' => 2]);
        InventoryItem::create(['product_id' => $product2->id, 'quantity' => 4, 'reserved_quantity' => 1]);

        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product1->id, 'quantity' => 2, 'price_at_add' => 10.00]);
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product2->id, 'quantity' => 1, 'price_at_add' => 20.00]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->postJson('/api/checkout', []); // Notice no payload!

        $response->assertStatus(201);

        // Assert inventory reserved quantity deducted (quantity stays the same since it was already deducted when added to cart)
        $this->assertDatabaseHas('inventory_items', ['product_id' => $product1->id, 'quantity' => 8, 'reserved_quantity' => 0]);
        $this->assertDatabaseHas('inventory_items', ['product_id' => $product2->id, 'quantity' => 4, 'reserved_quantity' => 0]);

        // Assert order created with correct total (10*2 + 20*1 = 40)
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
            'total_amount' => 40.00,
        ]);

        // Assert cart items are deleted
        $this->assertDatabaseMissing('cart_items', ['cart_id' => $cart->id]);

        Queue::assertPushedWithChain(ProcessOrderPayment::class, [
            SendOrderConfirmationEmail::class,
        ]);
    }

    public function test_checkout_fails_if_insufficient_stock_in_cart()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth')->plainTextToken;

        // Create the cart for the user
        $cart = Cart::create([
            'user_id' => $user->id,
            'expires_at' => now()->addDays(7),
        ]);

        $product = Product::factory()->create(['price' => 10.00]);
        InventoryItem::create([
            'product_id' => $product->id,
            'quantity' => 1,
            'reserved_quantity' => 1, // Only 1 is actually reserved
        ]);

        // Trying to buy 5, but we only reserved 1! (Malicious user bypassing Cart API)
        CartItem::create(['cart_id' => $cart->id, 'product_id' => $product->id, 'quantity' => 5, 'price_at_add' => 10.00]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer '.$token,
        ])->postJson('/api/checkout', []); // Notice no payload!

        $response->assertStatus(400);
        $this->assertDatabaseHas('inventory_items', [
            'product_id' => $product->id,
            'quantity' => 1, // Stock should not change
            'reserved_quantity' => 1,
        ]);

        // Cart item shouldn't be deleted because transaction rolled back
        $this->assertDatabaseHas('cart_items', [
            'cart_id' => $cart->id,
            'quantity' => 5,
        ]);
    }
}

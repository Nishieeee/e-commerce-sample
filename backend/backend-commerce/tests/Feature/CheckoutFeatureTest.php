<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Product;
use App\Models\InventoryItem;

class CheckoutFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_checkout_successfully()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth')->plainTextToken;

        $product = Product::factory()->create();
        $inventory = InventoryItem::create([
            'product_id' => $product->id,
            'quantity' => 10,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/checkout', [
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('inventory_items', [
            'product_id' => $product->id,
            'quantity' => 8,
        ]);
        $this->assertDatabaseHas('orders', [
            'user_id' => $user->id,
        ]);
    }

    public function test_checkout_fails_if_insufficient_stock()
    {
        $user = User::factory()->create();
        $token = $user->createToken('auth')->plainTextToken;

        $product = Product::factory()->create();
        $inventory = InventoryItem::create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/checkout', [
            'product_id' => $product->id,
            'quantity' => 5, // Trying to buy 5, only 1 in stock
        ]);

        $response->assertStatus(400);
        $this->assertDatabaseHas('inventory_items', [
            'product_id' => $product->id,
            'quantity' => 1, // Stock should not change
        ]);
    }
}

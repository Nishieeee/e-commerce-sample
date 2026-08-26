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
}

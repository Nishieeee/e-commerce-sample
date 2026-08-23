<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\Product;


class ProductFeatureTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    public function test_index()
    {
        $products = Product::factory()->create();
        
        $response = $this->get('/api/products');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'name', 
                    'category_name', 
                    'slug', 
                    'sku', 
                    'price', 
                    'compare_at_price', 
                    'is_active', 
                    'rating', 
                    'reviews',
                    'badge_type',
                    'specs',
                ],
            ],
        ]);
    }
}
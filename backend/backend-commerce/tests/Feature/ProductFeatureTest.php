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
        $response = $this->get('/api/products');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'name', 
                    'category_id', 
                    'slug', 
                    'sku', 
                    'price', 
                    'compare_at_price', 
                    'description', 
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
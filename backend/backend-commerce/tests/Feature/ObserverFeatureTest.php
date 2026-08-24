<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ObserverFeatureTest extends TestCase
{
    use RefreshDatabase;

    public function test_product_observer_clears_cache_on_update()
    {
        Cache::put('catalog.active', 'some_cached_data');
        
        $product = Product::factory()->create();
        
        $this->assertFalse(Cache::has('catalog.active'));
    }
}

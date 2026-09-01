<?php

namespace Tests\Feature;

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

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

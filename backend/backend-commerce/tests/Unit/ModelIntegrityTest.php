<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ModelIntegrityTest extends TestCase
{
    public function test_user_has_correct_relationships()
    {
        $user = new User();
        $this->assertInstanceOf(HasMany::class, $user->orders());
        $this->assertInstanceOf(HasMany::class, $user->addresses());
    }

    public function test_order_has_correct_relationships()
    {
        $order = new Order();
        $this->assertInstanceOf(BelongsTo::class, $order->user());
    }
    
    public function test_product_has_correct_relationships()
    {
        $product = new Product();
        $this->assertInstanceOf(BelongsTo::class, $product->category());
    }
}

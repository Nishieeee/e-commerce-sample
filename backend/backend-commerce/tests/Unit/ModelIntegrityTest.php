<?php

namespace Tests\Unit;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Tests\TestCase;

class ModelIntegrityTest extends TestCase
{
    public function test_user_has_correct_relationships()
    {
        $user = new User;
        $this->assertInstanceOf(HasMany::class, $user->orders());
        $this->assertInstanceOf(HasMany::class, $user->addresses());
    }

    public function test_order_has_correct_relationships()
    {
        $order = new Order;
        $this->assertInstanceOf(BelongsTo::class, $order->user());
    }

    public function test_product_has_correct_relationships()
    {
        $product = new Product;
        $this->assertInstanceOf(BelongsTo::class, $product->category());
    }
}

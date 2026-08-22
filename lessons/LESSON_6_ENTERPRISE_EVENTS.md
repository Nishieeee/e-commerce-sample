# Phase 6: Enterprise Concepts & Event-Driven Design

In a massive codebase, code coupling is the enemy.

If you have an `OrderService` that creates an order, you might eventually need it to also send an email, update the search index, deduct inventory, and notify the warehouse. If you put all of that inside the `OrderService`, the file becomes 1,000 lines long and breaks constantly.

## 6.1 Events & Listeners (Decoupling)
Instead of the `OrderService` knowing *what* to do after an order is placed, it just shouts into the void: "An order was placed!"

```php
// 1. Dispatch an Event
OrderPlaced::dispatch($order);
```

Then, you create independent **Listeners** that listen for that specific event and do their jobs in isolation:
- `SendOrderConfirmationEmail` (Listener)
- `UpdateElasticSearchIndex` (Listener)
- `NotifyWarehouse` (Listener)

If the warehouse API changes, you only update the warehouse listener. The core `OrderService` remains untouched.

## 6.2 Eloquent Observers
Observers are special event listeners that listen for database operations (`created`, `updated`, `deleted`).

Earlier, we talked about caching the product catalog. The problem is knowing when to clear the cache. Instead of manually putting `Cache::forget()` in every controller that might update a product, we use an Observer.

`php artisan make:observer ProductObserver --model=Product`

```php
namespace App\Observers;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;

class ProductObserver
{
    /**
     * Handle the Product "saved" event (Triggered on create AND update).
     */
    public function saved(Product $product): void
    {
        // Whenever ANY code saves a product, clear the catalog cache.
        Cache::forget('catalog.active');
    }
    
    public function deleted(Product $product): void
    {
        Cache::forget('catalog.active');
    }
}
```

Now, whether a product is updated via the API, a scheduled job, or Laravel Tinker, the cache is guaranteed to be cleared.

---

## Your Assignment (For Later)
We will implement a `ProductObserver` that automatically flushes the Redis product cache whenever an Admin creates, updates, or deletes a product.

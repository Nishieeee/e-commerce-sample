# Lesson 4 & 5: Caching, Queues, and Asynchronous Processing

As an application scales, the database becomes the bottleneck, and third-party APIs (like Stripe or Mailgun) become liabilities. We solve this by caching data in memory (Redis) and moving slow tasks to the background (Queues).

---

## 1. Caching (Phase 4)
If you have a product catalog that changes once a week, but gets viewed 100,000 times a day, querying the database 100,000 times is a massive waste of CPU.

Instead, we use **Redis** to cache the result in RAM (which is milliseconds fast).

```php
use Illuminate\Support\Facades\Cache;

public function index() 
{
    // If 'active_products' is in Redis, return it immediately.
    // If not, run the query, store it in Redis for 24 hours, then return it.
    $products = Cache::remember('active_products', now()->addHours(24), function () {
        return Product::with('images', 'category')->where('is_active', true)->get();
    });

    return ProductResource::collection($products);
}
```

### Cache Invalidation
The hardest part of caching is knowing when to clear it. If an Admin changes a product's price, the cache will still serve the old price for 24 hours!
To fix this, we can use an Eloquent Observer on the `Product` model to clear the cache whenever a product is saved:
```php
Cache::forget('active_products');
```

---

## 2. Queues & Background Jobs (Phase 5)
Imagine a user completes a checkout. In the controller, you do this:
```php
// 1. Process payment (Stripe API - takes 2 seconds)
// 2. Generate PDF Invoice (Takes 3 seconds)
// 3. Send email to customer (Mail API - takes 2 seconds)
// 4. Return response
```
The user is sitting there staring at a loading spinner for 7 seconds. If the Mail API goes down, the entire checkout crashes!

### The Solution: Asynchronous Jobs
We use Laravel Queues. We return a response instantly, and tell a background "worker" process to handle the slow stuff.

**1. Create a Job:** `php artisan make:job SendOrderConfirmationEmail`

**2. Dispatch it in the controller:**
```php
public function checkout() {
    $order = $checkoutService->process(...);
    
    // Put the email task on the Redis queue and move on immediately!
    SendOrderConfirmationEmail::dispatch($order);
    
    return response()->json(['message' => 'Order placed!'], 201);
}
```
Now, the user sees a success screen in 0.2 seconds. Meanwhile, in the background, a Laravel Queue Worker picks up the job from Redis and sends the email safely.

---

## The Master Architecture
By the end of this project, your code will look like this:
1. **Middleware** verifies the JWT Token and checks RBAC.
2. **Form Requests** validate the incoming data.
3. The **Controller** maps the data to a **DTO**.
4. The Controller passes the DTO to a **Service**.
5. The Service uses a **Database Transaction** and **Pessimistic Locking** to update data.
6. The Service dispatches **Jobs** to a **Redis Queue** for emails.
7. The Controller returns an **API Resource** formatted cleanly as JSON.

This is the exact architecture used by the largest Laravel applications in the world.

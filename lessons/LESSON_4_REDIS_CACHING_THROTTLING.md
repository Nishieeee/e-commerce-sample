# Phase 4: Caching & Traffic Management (Scaling Traffic)

As traffic spikes (e.g., during a Black Friday sale), hitting the database for every single page load is unsustainable. We need an in-memory data store.

## 4.1 Redis Configuration
Redis is a key-value store that runs entirely in RAM. It is millisecond-fast.
In Laravel, we configure Redis in `.env`:
```env
CACHE_STORE=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
```
*Note: Since you are developing locally without Docker, you will need to install the Redis server directly on your Linux machine (`sudo apt install redis-server`) and run it.*

## 4.2 Catalog Caching & Invalidation
We cache our product catalog so the database never has to answer to frontend visitors.

```php
use Illuminate\Support\Facades\Cache;

public function index() 
{
    // The query is cached for 24 hours under the key 'catalog.active'
    $products = Cache::remember('catalog.active', now()->addHours(24), function () {
        return Product::where('is_active', true)->with('category', 'images')->get();
    });

    return ProductResource::collection($products);
}
```
**Cache Invalidation:** If an admin updates a product, the cache is instantly stale. We use Eloquent Observers (covered in Phase 6) to run `Cache::forget('catalog.active')` whenever a Product is saved or deleted.

## 4.3 Rate Limiting & API Throttling
A malicious user might try to brute-force a login endpoint by sending 10,000 passwords a second. We must stop them at the door.

In `App\Providers\AppServiceProvider.php` (Laravel 11 routing):
```php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function (Request $request) {
    // Limit API traffic to 60 requests per minute per IP address
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

RateLimiter::for('login', function (Request $request) {
    // Limit login attempts to 5 per minute per IP address
    return Limit::perMinute(5)->by($request->ip());
});
```

Then we apply the `throttle:login` middleware to our `api.php` route:
```php
Route::middleware('throttle:login')->post('/login', [AuthController::class, 'login']);
```

---

## Your Assignment (For Later)
1. Ensure the Redis server is installed locally and update your `.env` to use the `redis` driver for Cache and Queue.
2. Implement caching in your `ProductController@index` method.
3. Apply rate limiting to your `/login` route to prevent brute-force attacks.

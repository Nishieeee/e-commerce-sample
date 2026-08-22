# Lesson 3.1: Eradicating the N+1 Problem

The single most common reason Laravel applications crash in production is the **N+1 Query Problem**. 

## What is it?
Imagine an API endpoint that fetches the 50 newest products and their categories.

```php
// ProductController.php
$products = Product::latest()->take(50)->get();

return ProductResource::collection($products);
```

Inside your `ProductResource`, you do this:
```php
return [
    'id' => $this->id,
    'name' => $this->name,
    'category' => $this->category->name, // Danger!
];
```

**What happens at the database level?**
1. Laravel runs **1 query** to get the 50 products: `SELECT * FROM products LIMIT 50;`
2. Then, as it transforms the products into JSON, it hits `$this->category->name`. Because the category wasn't loaded in the first query, Eloquent "lazy loads" it by running a new query: `SELECT * FROM categories WHERE id = ?`.
3. It does this for *every single product*.

Total queries: **1 (to get products) + 50 (to get categories) = 51 queries.**
If 1,000 users hit this endpoint at the same time, your database is executing 51,000 queries per second. Your server will catch fire.

## The Solution: Eager Loading
We solve this using **Eager Loading** (`with()`). We tell Eloquent to fetch the relationships upfront.

```php
$products = Product::with('category')->latest()->take(50)->get();
```
Now, Laravel runs exactly **2 queries**, no matter how many products there are:
1. `SELECT * FROM products LIMIT 50;`
2. `SELECT * FROM categories WHERE id IN (1, 2, 3...);`

## The Senior Developer Safety Net: Strict Mode
Even senior devs accidentally trigger N+1 queries. To prevent this, we enforce **Strict Mode** during development.

In your `AppServiceProvider.php`:
```php
use Illuminate\Database\Eloquent\Model;

public function boot(): void
{
    // If we try to lazy load a relationship, crash the app! (Only in local/testing)
    Model::preventLazyLoading(!app()->isProduction());
    
    // Crash if we try to mass-assign a field not in $fillable
    Model::preventSilentlyDiscardingAttributes(!app()->isProduction());
}
```

With this turned on, if you ever forget to use `with('category')`, Laravel will throw a `LazyLoadingViolationException` with a massive red screen, forcing you to fix it before it ever reaches production.

---

## Your Assignment (For Later)
1. Turn on Strict Mode in `AppServiceProvider.php`.
2. Create a `ProductController` with an `index` method that returns paginated products.
3. Test hitting the endpoint. Observe how Strict Mode protects you. Ensure you use `with()` to eager load relations!

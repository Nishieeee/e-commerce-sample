# Lesson 1.3: Role-Based Access Control (RBAC) & Policies

Authentication (which we just built) answers the question: **"Who are you?"**
Authorization (which we are building now) answers the question: **"What are you allowed to do?"**

If we don't build authorization, any registered customer with a token could send a `DELETE` request to our API and wipe out our entire product catalog. 

Looking at our database schema, the `users` table has a `role` column which defaults to `'customer'` and can also be `'admin'`. We will use this column to implement Role-Based Access Control (RBAC).

In Laravel, we handle authorization in two ways: **Middleware** and **Policies**.

---

## 1. The Helper Method
First, we should add a helper method to our `User` model so we don't have to keep writing `$user->role === 'admin'` everywhere in our code.

```php
public function isAdmin(): bool
{
    return $this->role === 'admin';
}
```

## 2. Middleware (The Bouncer)
Middleware sits between the incoming HTTP request and your controller. If the request doesn't pass the middleware's logic, it is rejected before it even reaches your business logic.

This is perfect for broad routing checks, like creating an "Admin Only" route group.

You create one using: `php artisan make:middleware AdminMiddleware`

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // 1. Check if the user is authenticated at all
        if (!$request->user()) {
            abort(401, 'Unauthorized.');
        }

        // 2. Check if the user is an admin
        if (!$request->user()->isAdmin()) {
            abort(403, 'Forbidden. You do not have admin rights.');
        }

        // Pass the request deeper into the application
        return $next($request);
    }
}
```

In Laravel 11, you register middleware aliases in `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \App\Http\Middleware\AdminMiddleware::class,
    ]);
})
```

You can then protect your routes like this:
```php
Route::middleware(['auth:sanctum', 'admin'])->post('/products', [ProductController::class, 'store']);
```

## 3. Policies (The Granular Bouncer)
Middleware is great for general access, but what if you want to be granular? For example, an Admin can edit *any* order, but a Customer can only view *their own* order. Middleware can't easily handle that logic.

This is what **Policies** are for. Policies are tied directly to Eloquent Models.

You create one using: `php artisan make:policy OrderPolicy --model=Order`

```php
namespace App\Policies;

use App\Models\Order;
use App\Models\User;

class OrderPolicy
{
    /**
     * Determine if the given order can be viewed by the user.
     */
    public function view(User $user, Order $order): bool
    {
        // Admins can see everything. Customers can only see their own orders.
        return $user->isAdmin() || $user->id === $order->user_id;
    }
}
```

In your controller, you can enforce this policy right before acting:
```php
public function show(Order $order) 
{
    Gate::authorize('view', $order); // Will throw a 403 if the policy returns false
    
    return new OrderResource($order);
}
```

*(Note: In Laravel 11, policies are auto-discovered as long as they are in the `App\Policies` namespace and match the model name).*

---

## Your Assignment (Action Required)

It's time to build the admin gates.

1. **Update the User Model**: 
   - Add the `isAdmin(): bool` helper method to your `User` model.
   - *Don't forget to ensure `role` is NOT in your `$fillable` array to prevent mass-assignment privilege escalation!*

2. **Create the Middleware**: 
   - Run `php artisan make:middleware AdminMiddleware`.
   - Implement the `handle` logic to abort with a `403` if the user is not an admin.
   - Register it as an alias called `'admin'` in `bootstrap/app.php`.

3. **Create a Test Route**: 
   - In `routes/api.php`, create a dummy `GET /admin-dashboard` route that returns `['message' => 'Welcome Admin']`.
   - Protect this route with `middleware(['auth:sanctum', 'admin'])`.

4. **Create a Policy**: 
   - Run `php artisan make:policy ProductPolicy --model=Product`.
   - Update the `create` method to return true *only* if the user is an admin. (We aren't hooking this up to a controller just yet, but having it ready is best practice).

Let me know when you've finished, and I'll review your RBAC implementation!

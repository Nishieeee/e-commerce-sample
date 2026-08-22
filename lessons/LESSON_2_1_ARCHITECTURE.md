# Lesson 2.1: The Service Pattern & API Resources

Welcome to Phase 2. Now that our foundation is built, we need to talk about **architecture**. In the real world, e-commerce platforms have extremely complex business logic (calculating taxes, locking inventory, processing payments, sending emails). 

If you put all of that logic inside your Controllers, your application will quickly turn into an unmaintainable, untestable mess known as the **"Fat Controller Anti-Pattern"**.

To solve this, Enterprise Laravel applications use two powerful patterns: **Services** (for input/logic) and **Resources** (for output).

---

## 1. API Resources (Controlling the Output)

Right now, when a user logs in, we do this:
```php
return response()->json([
    'access_token' => $token,
    'user' => $user
]);
```
This is dangerous. By returning the raw Eloquent model, you run the risk of accidentally exposing database columns you meant to keep hidden. Furthermore, what if the frontend team wants the `created_at` timestamp formatted as a readable string instead of a database timestamp? If you change it on the Model, it might break other backend logic.

**The Solution:** Laravel API Resources.
Resources act as a transformation layer between your Eloquent models and the JSON response returned to the user.

You create one using: `php artisan make:resource UserResource`

```php
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        // Only return exactly what the frontend needs. No more, no less.
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'role' => $this->role,
            // Format data specifically for the frontend
            'joined_at' => $this->created_at->format('Y-m-d'), 
        ];
    }
}
```

Now, in your controller, you return the resource:
```php
return response()->json([
    'access_token' => $token,
    'user' => new UserResource($user)
]);
```

## 2. The Service Pattern (Controlling the Logic)

A Controller's **only** job is to:
1. Receive the HTTP Request.
2. Hand the data to a Service class to do the heavy lifting.
3. Return a Response.

Let's look at a hypothetical `CheckoutController`.
**Bad (Fat Controller):**
```php
public function checkout(Request $request) {
    // 50 lines of checking inventory
    // 30 lines of calculating tax
    // 40 lines of Stripe API calls
    // 20 lines of creating database records
    // Return response
}
```
If you ever want to trigger a checkout from an artisan console command, or a scheduled job, you can't—because the logic is trapped inside an HTTP Controller!

**Good (Service Pattern):**
```php
class CheckoutController extends Controller {
    public function checkout(Request $request, CheckoutService $service) {
        $order = $service->processOrder($request->user(), $request->all());
        return new OrderResource($order);
    }
}
```

A Service is just a plain PHP class that you create in the `app/Services` directory (you have to create this folder manually).

```php
namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    /**
     * Handle the business logic of registering a new user.
     */
    public function registerUser(array $data): User
    {
        // We can do complex logic here before creating the user if needed
        $data['password'] = Hash::make($data['password']);
        
        return User::create($data);
    }
}
```

---

## Your Assignment (Action Required)

It's time to refactor our Auth code to enterprise standards.

### Part 1: API Resources
1. Run `php artisan make:resource UserResource`.
2. Update the `toArray` method in `UserResource` to only return the `id`, `name`, `email`, `phone`, and a formatted `joined_at` date.
3. Update your `AuthController`'s `register` and `login` methods to wrap the `$user` variable in `new UserResource($user)` before returning it in the JSON response.

### Part 2: The Service Pattern
1. Create a new directory: `app/Services`.
2. Create a new file: `app/Services/AuthService.php`.
3. Create the `AuthService` class and write a `registerUser(array $data)` method. Move the `User::create(...)` and `createToken(...)` logic inside this service method. Have the service return an array containing the `user` and `token`.
4. Inject the `AuthService` into your `AuthController`'s `register` method and use it. 
   *(Hint: You can type-hint it in the method signature: `public function register(Request $request, AuthService $authService)`).*

Once you have completed this refactor, run your tests again (`php artisan test --filter AuthFeatureTest`) to ensure you didn't break anything. 

Let me know when you're done!

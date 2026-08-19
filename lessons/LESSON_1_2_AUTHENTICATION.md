# Lesson 1.2: API Authentication with Laravel Sanctum

Now that our data access layer is secure, we need to secure the application gates. Our backend is a pure REST API serving a Next.js frontend. This means we cannot use traditional session cookies with Laravel Blade views.

Instead, we will use **Token-Based Authentication**.
When a user logs in, the API generates a unique, cryptographically secure string (a token) and gives it to the frontend. For every subsequent request, the frontend must attach that token to the HTTP headers:
`Authorization: Bearer 1|abcdef123456...`

Laravel provides a lightweight package for this called **Laravel Sanctum**.

---

## 1. Setting up Sanctum
Laravel 11 usually comes with Sanctum pre-configured, but if you need to install it manually:
```bash
php artisan install:api
```
This command installs Sanctum, publishes its migrations, runs them, and creates your `routes/api.php` file if it doesn't exist.

## 2. The `HasApiTokens` Trait
For Sanctum to know how to issue tokens for a user, the `User` model must use the `HasApiTokens` trait.

```php
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    // ...
}
```

## 3. The AuthController
We need a dedicated controller to handle the authentication lifecycle: Registration, Login, and Logout. Since this is an API, **we must only return JSON responses**. Never return redirects or HTML views.

### Registration Example
```php
public function register(Request $request)
{
    // 1. Validate the incoming request
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users',
        'password' => 'required|string|min:8'
    ]);

    // 2. Create the User (Password will be hashed automatically by Laravel 11's casts, or you can use Hash::make())
    $user = User::create($request->all());

    // 3. Generate a Sanctum Token
    $token = $user->createToken('auth_token')->plainTextToken;

    // 4. Return JSON
    return response()->json([
        'message' => 'User registered successfully',
        'access_token' => $token,
        'user' => $user
    ], 201);
}
```

### Login Example
```php
public function login(Request $request)
{
    // Validate credentials...
    
    // Check if the user exists and the password is correct
    $user = User::where('email', $request->email)->first();
    
    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }
    
    // Generate Token
    $token = $user->createToken('auth_token')->plainTextToken;
    
    return response()->json([
        'access_token' => $token,
        'user' => $user
    ]);
}
```

## 4. Protecting Routes
Once a user is logged in, they can access protected endpoints (like their order history, or logging out). We protect these endpoints in `routes/api.php` using the `auth:sanctum` middleware.

```php
use App\Http\Controllers\Api\V1\AuthController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user(); // Returns the authenticated user
    });
});
```

---

## Your Assignment (Action Required)

It's time to code the authentication system.

1. **Install API Routing (if needed)**: Run `php artisan install:api` in the terminal to ensure Sanctum is installed and the `api.php` route file is ready.
2. **Update the User Model**: Add the `Laravel\Sanctum\HasApiTokens` trait to your `User` model.
3. **Create the Controller**: Run `php artisan make:controller Api/V1/AuthController`.
4. **Implement the Methods**: Write the `register`, `login`, and `logout` methods inside the `AuthController`. 
   - *Senior Note:* For `logout`, you can revoke all tokens for the user using: `$request->user()->tokens()->delete();`
5. **Define the Routes**: Open `routes/api.php` and map your controller methods to the appropriate endpoints. Protect the `logout` route with the `auth:sanctum` middleware.

Let me know when you have written the code, and I will review it!

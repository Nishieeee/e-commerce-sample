# Lesson 1.4: Strict Request Validation (Form Requests)

Controllers should be thin. Their only job is to receive a request, hand it to a service, and return a response.

In our current `AuthController`, we are doing this:
```php
$request->validate([
    'name' => 'required|string|max:255',
    'email' => 'required|string|email|unique:users',
    'password' => 'required|string|min:8',
]);
```
This is fine for a quick prototype, but what happens when you have a 20-field product creation form? What if you need complex validation rules (e.g., "discount_price must be less than price")? Your controller becomes huge.

To solve this, Laravel provides **Form Requests**.

---

## 1. Creating a Form Request
You generate a Form Request using the CLI:
```bash
php artisan make:request StoreProductRequest
```

This creates a class in `app/Http/Requests/StoreProductRequest.php`.

```php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // We can do RBAC checks here!
        return $this->user()->isAdmin(); 
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'sku' => 'required|string|unique:products',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|gt:price', // Must be greater than price!
        ];
    }
    
    /**
     * Custom error messages (Optional)
     */
    public function messages(): array
    {
        return [
            'sku.unique' => 'This SKU is already in use by another product.',
            'compare_at_price.gt' => 'The compare price must be higher than the actual price to show a discount.'
        ];
    }
}
```

## 2. Using the Form Request
Now, instead of injecting the base `Illuminate\Http\Request` into your controller, you inject your custom Form Request.

**Old Controller:**
```php
public function store(Request $request) {
    $request->validate([...]); // Bloated
}
```

**New Controller:**
```php
public function store(StoreProductRequest $request, ProductService $service) {
    // If the code reaches this line, we guarantee:
    // 1. The user is an admin (because authorize() returned true)
    // 2. The data is 100% valid.
    
    // Pass the validated data directly into our DTO!
    $dto = new StoreProductDTO(...$request->validated());
    
    $product = $service->createProduct($dto);
    
    return new ProductResource($product);
}
```

---

## Your Assignment (For Later)
When you are ready:
1. Extract the validation logic from `AuthController@register` into a `RegisterUserRequest`.
2. Extract the validation logic from `AuthController@login` into a `LoginUserRequest`.
3. Update the controller methods to use these requests.

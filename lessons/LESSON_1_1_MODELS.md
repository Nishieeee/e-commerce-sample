# Lesson 1.1: Models, Relationships, and Data Integrity

Welcome to your first lesson. Today we are tackling the foundational layer of any backend application: the **Data Access Layer**. In Laravel, we use the Eloquent ORM (Object-Relational Mapper) to interact with our database.

Writing a model isn't just about extending a class; it's about protecting your database from malicious inputs, ensuring data is retrieved efficiently, and formatting data correctly right out of the database.

---

## 1. Mass Assignment Vulnerabilities
When you create or update a record using an array of data (e.g., `$user->update($request->all())`), you are performing **mass assignment**. 

**The Danger:** If a malicious user sends a request with `{"role": "admin"}` and your model isn't protected, they just escalated their privileges.

**The Solution:**
You must define which attributes can be mass-assigned. You do this using either `$fillable` (an allowlist) or `$guarded` (a blocklist).

```php
// Approach 1: The Allowlist (Safer, preferred by strict teams)
class User extends Authenticatable {
    protected $fillable = ['name', 'email', 'password', 'phone'];
}

// Approach 2: The Blocklist (Faster, but requires extreme caution)
class User extends Authenticatable {
    protected $guarded = ['id', 'role']; // Everything else is fillable
}
```
*Senior Tip:* I generally prefer `$fillable`. It forces you to be explicit about what is allowed, leaving no room for accidents when new columns are added later.

## 2. Eloquent Relationships
Your database tables are relational. Your code should reflect that. Defining relationships correctly allows you to traverse your database elegantly without writing raw SQL joins.

### One-to-Many
A `Category` has many `Products`. A `Product` belongs to a `Category`.

```php
class Category extends Model {
    public function products() {
        return $this->hasMany(Product::class);
    }
}

class Product extends Model {
    public function category() {
        // If your foreign key is 'category_id', Laravel guesses it automatically!
        return $this->belongsTo(Category::class);
    }
}
```

### Self-Referencing (Hierarchies)
A `Category` can have a parent `Category`. This is crucial for nested taxonomies (e.g., Clothing -> Mens -> Hoodies).

```php
class Category extends Model {
    public function parent() {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function subcategories() {
        return $this->hasMany(Category::class, 'parent_id');
    }
}
```

## 3. Attribute Casting (Dealing with JSON)
Databases store data as raw strings, integers, or JSON blobs. In PHP, we want to work with real arrays, objects, and boolean types. 

Laravel's **Casts** automatically convert attributes to common data types when you access them, and back to database-friendly formats when you save them.

In our schema, `orders.shipping_address` is a `JSONB` column. We don't want to manually `json_decode` it every time we need it.

```php
class Order extends Model {
    protected function casts(): array {
        return [
            // Automatically encode to json on save, decode to array on fetch
            'shipping_address' => 'array', 
            'billing_address' => 'array',
            
            // Ensure numbers come out as floats/decimals, not strings
            'total_amount' => 'decimal:2',
            
            // Ensure dates are parsed as Carbon instances
            'shipped_at' => 'datetime',
        ];
    }
}
```

## 4. Laravel Strict Mode (The Senior Engineer's Secret Weapon)
By default, Laravel is very forgiving. If you try to access a property that doesn't exist on a model, it returns `null`. If you try to mass-assign a field that isn't in `$fillable`, it silently ignores it. 

In a real-world enterprise app, **silent failures are unacceptable.** We want the app to throw loud exceptions during development so we catch bugs immediately.

We will enable Strict Mode in the `AppServiceProvider` later, which does three things:
1. Prevents silent discarding of mass-assigned attributes.
2. Prevents lazy-loading (the N+1 query problem).
3. Prevents accessing missing attributes on a model.

---

## Your Assignment (Action Required)

Now it's your turn to write the code. I need you to implement the following Eloquent Models in the `backend/backend-commerce/app/Models/` directory.

Look closely at the `database/migrations` (or `database_schema.sql`) to see what columns exist for these tables.

1. **`User.php`**
   - Must have `orders()` relationship.
   - Must have `addresses()` relationship.
   - Protect `$fillable` attributes. Hide `password` and `remember_token`.

2. **`Category.php`**
   - Must have `products()`, `parent()`, and `subcategories()` relationships.
   - Protect mass assignment.

3. **`Product.php`**
   - Must have `category()`, `images()` (relates to `ProductImage`), and `inventory()` (relates to `InventoryItem`).
   - Protect mass assignment.
   - Cast `price` to `decimal:2` and `specs` to `array`.

4. **`Order.php`**
   - Must have `user()`, `items()` (relates to `OrderItem`), and `payment()`.
   - Cast `shipping_address` and `billing_address` to `array`. 
   - Cast `total_amount` to `decimal:2`.

**Instructions:** 
Go into the codebase, open those files, and write the model code. (Laravel already created `User.php`, so just update it. Create the others if they don't exist yet, but I think `php artisan make:model` is the way to go). 

When you've written them, notify me so I can review your work.

# Lesson 3.2: Atomic Transactions & Pessimistic Locking

Let's talk about the biggest nightmare in e-commerce: **Overselling**.

Imagine you are selling a limited edition hoodie. You only have **1** left in stock.
Two customers, Alice and Bob, click "Checkout" at the exact same millisecond.

### The Race Condition
Here is what happens in the code if you aren't careful:
1. Thread 1 (Alice) queries inventory: `SELECT stock FROM inventory WHERE product_id = 1;` (Result: 1)
2. Thread 2 (Bob) queries inventory: `SELECT stock FROM inventory WHERE product_id = 1;` (Result: 1)
3. Thread 1 (Alice) checks if stock > 0. It is.
4. Thread 2 (Bob) checks if stock > 0. It is.
5. Thread 1 (Alice) deducts stock: `UPDATE inventory SET stock = 0 WHERE product_id = 1;`
6. Thread 2 (Bob) deducts stock: `UPDATE inventory SET stock = -1 WHERE product_id = 1;`

Both Alice and Bob successfully bought the hoodie. You only have 1 to ship. You now have an angry customer and a customer service nightmare.

## The Solution: Database Locking
Relational databases (like PostgreSQL and MySQL) have built-in mechanisms to solve this using **Pessimistic Locking**. We literally lock the database row so no one else can read or write to it until we are done.

In Laravel, we do this using `lockForUpdate()` inside a **Database Transaction**.

```php
use Illuminate\Support\Facades\DB;

public function checkout(CheckoutDTO $dto) 
{
    // DB::transaction ensures that if ANY code fails inside this block, 
    // the entire database rolls back to its previous state. No half-finished orders.
    DB::transaction(function () use ($dto) {
        
        // 1. Lock the inventory row. 
        // If Bob tries to query this row while Alice is locking it, Bob's request will pause and wait.
        $inventory = InventoryItem::where('product_id', $dto->productId)
                                  ->lockForUpdate() // <--- THE MAGIC
                                  ->first();

        // 2. Check stock
        if ($inventory->stock < $dto->quantity) {
            abort(400, 'Not enough stock.');
        }

        // 3. Deduct stock
        $inventory->decrement('stock', $dto->quantity);

        // 4. Create the Order
        Order::create([...]);
        
    }); // <-- The lock is released here when the transaction commits.
}
```

### Why this makes you a Senior Developer
Junior developers trust application-level logic (`if $stock > 0`). 
Senior developers know that application logic is executed in parallel, so they enforce data integrity at the lowest level possible: the database engine itself.

---

## Your Assignment (For Later)
When we build the checkout flow, you will implement a `CheckoutService` that uses `DB::transaction()` and `lockForUpdate()` to securely deduct stock from the `inventory_items` table and insert rows into the `orders` and `order_items` tables.

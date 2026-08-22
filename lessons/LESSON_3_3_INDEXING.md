# Lesson 3.3: Database Indexing

When an e-commerce platform grows, the `products` and `orders` tables will eventually contain millions of rows. 

If a customer searches for all "Active Hoodies under $50," the database has to scan every single row in the table to find the matches. This is called a **Full Table Scan (O(N) complexity)**. It is extremely slow and will lock up your CPU.

## The Solution: Indexes
An index is a data structure (usually a B-Tree) that the database builds behind the scenes. It acts like the index at the back of a textbook—instead of reading every page to find a topic, you go to the index, find the exact page number, and jump straight to it. This turns the search into an **O(log N)** operation.

### Adding Indexes in Laravel
You add indexes when you create your database migrations.

```php
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('slug')->unique(); // Unique automatically creates an index
    $table->foreignId('category_id')->constrained(); // Foreign keys usually need indexing
    $table->boolean('is_active')->default(true);
    $table->decimal('price', 10, 2);
    
    // 1. Single Column Index
    $table->index('category_id'); 
    
    // 2. Composite Index (For queries that filter by multiple columns)
    // e.g., SELECT * FROM products WHERE category_id = 1 AND is_active = true;
    $table->index(['category_id', 'is_active']);
});
```

### When NOT to Index
Indexes speed up `SELECT` queries, but they slow down `INSERT`, `UPDATE`, and `DELETE` queries because the database has to rebuild the B-Tree every time data changes.
- **Do index:** Foreign keys (`user_id`), columns used in `WHERE` clauses (`is_active`), columns used for sorting (`created_at`).
- **Don't index:** Text blobs (`description`), columns with low cardinality (e.g., a boolean where 99% of the values are `true`), or tables that are heavily written to but rarely read.

---

## Your Assignment (For Later)
We will review our migrations and add a composite index on the `products` table for `['category_id', 'is_active']` and on the `orders` table for `['user_id', 'created_at']`.

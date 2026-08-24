# E-Commerce Advanced Features Roadmap

This document outlines the next level of features required to turn this application into a production-ready e-commerce backend. You now possess the architectural skills (DTOs, Services, Locks, Queues, Observers) to build these independently.

---

## 1. Multi-Item Cart Management
Currently, the checkout only processes a single `product_id`. Real e-commerce platforms require a cart.

**Requirements:**
- [ ] Create a `CartController` for adding, updating, and removing items.
- [ ] Store cart session data. (Option A: In Redis for speed. Option B: In a `cart_items` database table).
- [ ] Update `CheckoutService` to accept an array of items, iterate over them, and lock multiple rows in the `inventory_items` table.
- [ ] Dynamically calculate the `subtotal` based on the product prices.

---

## 2. Inventory Reservation (Soft Allocation)
If 10 people have the last PS5 in their cart, 9 will get an error at the exact moment of checkout. We want to reserve stock when they *add* it to their cart.

**Requirements:**
- [ ] Add a `reserved_quantity` column to the `inventory_items` table.
- [ ] When an item is added to the cart, increment `reserved_quantity` and decrement available `quantity`.
- [ ] Create a scheduled Laravel Job (e.g., running every 5 minutes) that checks for abandoned carts older than 15 minutes.
- [ ] If a cart is abandoned, the job should release the `reserved_quantity` back to the available pool.

---

## 3. Payment Gateway Webhooks
When a payment succeeds on Stripe, Stripe makes a POST request to your server to notify you.

**Requirements:**
- [ ] Create a `WebhookController` with a `handleStripeWebhook` method.
- [ ] Route it without `auth:sanctum` (since Stripe is making the request, not a logged-in user).
- [ ] Implement signature verification to ensure the payload actually came from Stripe (using Stripe's SDK or a manual hash check).
- [ ] Dispatch a `PaymentReceived` Event when the payload is validated.
- [ ] Create a Listener that updates the corresponding `Order` status to `paid`.

---

## 4. Advanced Product Search & Query Scopes
The `/products` endpoint currently lists the entire catalog. Users need to filter it.

**Requirements:**
- [ ] Accept query parameters like `?min_price=50&max_price=200&category=electronics&sort=price_asc`.
- [ ] Build Local Scopes on the `Product` model (e.g., `scopeActive()`, `scopeInCategory($query, $category)`, `scopePriceRange($query, $min, $max)`).
- [ ] Keep the Controller incredibly clean by chaining these scopes: `Product::active()->inCategory($request->category)->paginate()`.

---

## 5. Role-Based Rate Limiting
Admins might need to run heavy exports or bulk updates, while normal users should be restricted.

**Requirements:**
- [ ] Update the API rate limiter in `AppServiceProvider`.
- [ ] Check if the authenticated user has the `Admin` role (using your `isAdmin()` helper).
- [ ] If Admin, return `Limit::none()`. If regular user, return `Limit::perMinute(60)`.

---

## The Workflow
For each task you pick up:
1. Write the **Feature Test** first (TDD).
2. Create the **Form Request** (if applicable).
3. Create the **DTO**.
4. Write the **Service** or **Job** containing the core logic.
5. Wire it up to the **Controller**.
6. Ping your Senior Dev AI for a Code Review!

# NexusCommerce MVP - Backend Technical Documentation

## 1. Overview
This backend serves the NexusCommerce MVP frontend, functioning as a stateless RESTful API. Built with **Laravel 11/12 (PHP 8.3+)**, the backend is engineered for high performance, strict type safety, and real-time inventory locking, supporting a Next.js App Router frontend.

### Core Stack
- **Framework**: Laravel 11/12 API Mode
- **Language**: PHP 8.3+
- **Authentication**: Laravel Sanctum (Bearer Tokens)
- **Database**: PostgreSQL 16+ (or SQLite for local dev) using JSONB
- **ORM**: Eloquent (Strict Mode enabled)
- **Caching & Queues**: Redis (Session locking, API rate limiting, Job queues)

---

## 2. Architecture & Design Principles

### 2.1 Decoupled RESTful API
The backend acts strictly as an API gateway. It does not return HTML views, Blade templates, or handle frontend routing. All communication between the frontend client and the backend is done via JSON over HTTPS.
- Base API URL: `/api/v1/`
- Data Format: `application/json`

### 2.2 Atomic Inventory Row-Locking (Zero Overselling)
To prevent overselling limited items, checkout actions implement **pessimistic locking** via atomic database transactions:
```php
DB::transaction(function () use ($items) {
    // Lock inventory rows and check for sufficient stock using lockForUpdate()
    // Decrement stock and increment reserved_quantity atomically.
});
```

### 2.3 Role-Based Access Control (RBAC)
Endpoints are strictly protected via Sanctum middleware and Role/Policy checks:
- **Public**: Access to the catalog, products, and categories.
- **Customer**: Access to their own carts, orders, checkout, and address book.
- **Admin**: Full access to KPI metrics, product/category management (CRUD), and inventory adjustments (`role = 'admin'`).

### 2.4 Immutable Address Snapshots
Shipping and billing addresses are saved as immutable `JSONB` columns in the `orders` table to prevent future changes to customer profiles from altering historical invoice data.

---

## 3. Directory Structure
```text
backend/backend-commerce/
├── app/
│   ├── Http/Controllers/Api/V1/      # Versioned API Controllers
│   │   ├── AuthController.php        # Register, Login, Profile
│   │   ├── ProductController.php     # Catalog & PDP endpoints
│   │   ├── CartController.php        # Cart sync
│   │   ├── CheckoutController.php    # Order processing
│   │   └── Admin/                    # Admin restricted endpoints
│   ├── Http/Requests/                # Form validation rules
│   ├── Models/                       # Eloquent models (Strict Mode)
│   └── Services/                     # Complex domain logic
│       ├── CheckoutService.php       # Handles payment intents & stock
│       └── InventoryService.php      # Stock validation & audit logs
├── database/
│   ├── migrations/                   # Database schema definitions
│   └── seeders/                      # Mock data seeding
├── routes/
│   ├── api.php                       # /api/v1/* route definitions
│   └── web.php                       # Unused (System acts purely as API)
```

---

## 4. API Endpoints Specification (v1)

### 4.1 Authentication (`/api/v1/auth`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register new customer |
| POST | `/auth/login` | Public | Verify credentials, return token |
| POST | `/auth/logout` | Auth | Revoke Sanctum token |
| GET | `/auth/me` | Auth | Fetch user profile data |

### 4.2 Catalog (`/api/v1/products`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | Paginated catalog with filters |
| GET | `/products/{slug}` | Public | Detailed Product Page (PDP) info |
| GET | `/categories` | Public | List taxonomy trees |

### 4.3 Shopping Cart (`/api/v1/cart`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/cart` | Public/Auth | Get cart items & subtotal |
| POST | `/cart/items` | Public/Auth | Add product to cart |
| PUT | `/cart/items/{id}`| Public/Auth | Update quantity |
| DELETE | `/cart/items/{id}`| Public/Auth | Remove product |

### 4.4 Checkout & Orders (`/api/v1/checkout` | `/api/v1/orders`)
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/checkout` | Auth | Lock stock, process payment, create order |
| GET | `/orders` | Auth | Customer order history |
| GET | `/orders/{id}` | Auth | Customer order details |

### 4.5 Admin Dashboard (`/api/v1/admin`)
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/admin/metrics` | Admin | KPI summary (revenue, low stock) |
| GET | `/admin/products` | Admin | Product management |
| POST | `/admin/products` | Admin | Create product |
| PATCH | `/admin/orders/{id}`| Admin | Update fulfillment status |

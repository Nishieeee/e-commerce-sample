# NexusCommerce Frontend-Aligned SQL Schema

After analyzing the frontend models in `/types` and the mock data provided in `lib/api/products.ts` and `lib/api/mockData.ts`, I've created a PostgreSQL schema that maps exactly to the data structures the frontend expects.

I've also updated your `/database_schema.sql` file in the root directory directly with these changes. 

## Key Additions to Match the Frontend:
1. **Product Display Properties**: Added `rating`, `reviews`, `badge`, and `badge_type` columns to the `products` table.
2. **Product Specs**: Added a `specs` JSONB column to seamlessly store the array of `{ label, value }` data shown on the product pages.
3. **Category Definitions**: Adjusted the `categories` insert seeds to reflect the frontend's categories (`hoodie`, `shirt`, `pants`, `bracelet`).
4. **Inventory Log Reasons**: Added `manual` as a valid reason enum in `inventory_logs` to match the frontend `InventoryLog` interface.

```sql
-- ============================================================================
-- NexusCommerce MVP - PostgreSQL Database Schema
-- Version: 1.1.0 (Updated to match Frontend Types & Mock Data)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & ROLES
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP WITH TIME ZONE NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
    phone VARCHAR(50) NULL,
    avatar_url VARCHAR(512) NULL,
    remember_token VARCHAR(100) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER ADDRESSES
CREATE TABLE IF NOT EXISTS addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(100) DEFAULT 'Home',
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'United States',
    is_default_shipping BOOLEAN NOT NULL DEFAULT FALSE,
    is_default_billing BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT NULL REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL,
    image_url VARCHAR(512) NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS & IMAGES (Updated)
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    sku VARCHAR(100) NOT NULL UNIQUE,
    summary VARCHAR(500) NULL,
    description TEXT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10, 2) NULL CHECK (compare_at_price >= 0),
    cost_price NUMERIC(10, 2) NULL CHECK (cost_price >= 0),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 0.00,
    reviews INTEGER NOT NULL DEFAULT 0,
    badge VARCHAR(50) NULL,
    badge_type VARCHAR(50) NULL CHECK (badge_type IN ('sale', 'low_stock', 'featured') OR badge_type IS NULL),
    specs JSONB NULL, -- Array of {label, value}
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(512) NOT NULL,
    alt_text VARCHAR(255) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. INVENTORY & STOCK MANAGEMENT
CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    change_quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL CHECK (reason IN ('restock', 'sale', 'return', 'manual', 'adjustment', 'reservation_expired')),
    note TEXT NULL,
    created_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SHOPPING CARTS & ITEMS
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id BIGSERIAL PRIMARY KEY,
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    price_at_add NUMERIC(10, 2) NOT NULL CHECK (price_at_add >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- 7. ORDERS & ITEMS
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    order_number VARCHAR(100) NOT NULL UNIQUE,
    user_id BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (tax_amount >= 0),
    shipping_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (shipping_amount >= 0),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_amount >= 0),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    shipping_method VARCHAR(100) NOT NULL DEFAULT 'Standard Delivery',
    tracking_number VARCHAR(100) NULL,
    customer_notes TEXT NULL,
    admin_notes TEXT NULL,
    shipped_at TIMESTAMP WITH TIME ZONE NULL,
    delivered_at TIMESTAMP WITH TIME ZONE NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id BIGINT NULL REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. PAYMENTS
CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('stripe', 'paypal', 'cod', 'bank_transfer')),
    payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'paid', 'failed', 'refunded')),
    transaction_id VARCHAR(255) NULL UNIQUE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_gateway_response JSONB NULL,
    paid_at TIMESTAMP WITH TIME ZONE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

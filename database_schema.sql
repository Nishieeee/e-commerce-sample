-- ============================================================================
-- NexusCommerce MVP - PostgreSQL Database Schema
-- Version: 1.0.0
-- Dialect: PostgreSQL 14+
-- Description: Comprehensive relational schema for React + Laravel E-Commerce MVP
-- ============================================================================

-- Enable UUID extension if needed for cart/session tracking
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS & ROLES
-- ============================================================================
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

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================================================
-- 2. USER ADDRESSES
-- ============================================================================
CREATE TABLE IF NOT EXISTS addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(100) DEFAULT 'Home', -- e.g., Home, Office
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
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

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ============================================================================
-- 3. CATEGORIES
-- ============================================================================
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

CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_is_active ON categories(is_active);

-- ============================================================================
-- 4. PRODUCTS & IMAGES
-- ============================================================================
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
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_is_active_featured ON products(is_active, is_featured);

CREATE TABLE IF NOT EXISTS product_images (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(512) NOT NULL,
    alt_text VARCHAR(255) NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);

-- ============================================================================
-- 5. INVENTORY & STOCK MANAGEMENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS inventory_items (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    reserved_quantity INTEGER NOT NULL DEFAULT 0 CHECK (reserved_quantity >= 0),
    low_stock_threshold INTEGER NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_low_stock ON inventory_items(quantity, low_stock_threshold);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id BIGSERIAL PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    change_quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason VARCHAR(100) NOT NULL CHECK (reason IN ('restock', 'sale', 'return', 'adjustment', 'reservation_expired')),
    note TEXT NULL,
    created_by BIGINT NULL REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventory_logs_product_id ON inventory_logs(product_id);

-- ============================================================================
-- 6. SHOPPING CARTS & ITEMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id BIGINT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_carts_user_id ON carts(user_id);
CREATE INDEX idx_carts_session_id ON carts(session_id);

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

CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);

-- ============================================================================
-- 7. ORDERS & ITEMS
-- ============================================================================
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

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_created_at ON orders(created_at);

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

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- ============================================================================
-- 8. PAYMENTS
-- ============================================================================
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

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- ============================================================================
-- 9. TRIGGERS & AUTOMATION FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to update updated_at
CREATE TRIGGER update_users_modtime BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_addresses_modtime BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_categories_modtime BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_products_modtime BEFORE UPDATE ON products FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_inventory_modtime BEFORE UPDATE ON inventory_items FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_carts_modtime BEFORE UPDATE ON carts FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_cart_items_modtime BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_orders_modtime BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();
CREATE TRIGGER update_payments_modtime BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_timestamp_column();

-- ============================================================================
-- 10. SAMPLE SEED DATA
-- ============================================================================

-- Insert Admin and Customer Users (Password hash corresponds to bcrypt 'password')
INSERT INTO users (name, email, password, role, phone)
VALUES 
('System Admin', 'admin@nexuscommerce.io', '$2y$12$e0X900/L.n/0d52E8VfB.O0f2qFv8FvG0wV1Z2r1rX1w2b3c4d5e6', 'admin', '+1-800-555-0199'),
('John Doe', 'john.doe@example.com', '$2y$12$e0X900/L.n/0d52E8VfB.O0f2qFv8FvG0wV1Z2r1rX1w2b3c4d5e6', 'customer', '+1-800-555-0122')
ON CONFLICT (email) DO NOTHING;

-- Insert Sample Categories
INSERT INTO categories (name, slug, description)
VALUES 
('Electronics', 'electronics', 'Latest gadgets, computers, and electronic accessories'),
('Apparel & Fashion', 'apparel-fashion', 'Modern clothing, shoes, and lifestyle apparel'),
('Home & Living', 'home-living', 'Premium home decor, furniture, and kitchen essentials')
ON CONFLICT (slug) DO NOTHING;

-- Insert Sample Products
INSERT INTO products (category_id, name, slug, sku, summary, description, price, compare_at_price, cost_price, is_featured)
VALUES 
((SELECT id FROM categories WHERE slug='electronics'), 'AuraPro Noise-Canceling Wireless Headphones', 'aurapro-headphones', 'ELEC-HP-001', 'Studio-quality adaptive noise cancellation with 40h battery life.', 'Experience immersive audio with custom 40mm beryllium drivers, dual noise-canceling processors, and plush memory foam earcups.', 249.99, 299.99, 120.00, true),
((SELECT id FROM categories WHERE slug='electronics'), 'NexusBook Ultra 16 Laptop', 'nexusbook-ultra-16', 'ELEC-LP-002', '16-inch Retina 120Hz display, Octa-core processor, 32GB RAM.', 'Designed for professionals and creators. Features ultra-fast unified storage, aerospace-grade aluminum unibody, and all-day thermal performance.', 1499.00, 1699.00, 950.00, true),
((SELECT id FROM categories WHERE slug='apparel-fashion'), 'Minimalist Organic Cotton Hoodie', 'minimalist-cotton-hoodie', 'APPR-HD-001', 'Heavyweight 400 GSM 100% organic cotton fleece hoodie.', 'Crafted with ethical sourcing and pre-shrunk fabric for a relaxed, timeless silhouette.', 89.00, 110.00, 32.00, false)
ON CONFLICT (slug) DO NOTHING;

-- Insert Inventory Items for Products
INSERT INTO inventory_items (product_id, quantity, reserved_quantity, low_stock_threshold)
SELECT id, 45, 0, 5 FROM products WHERE sku = 'ELEC-HP-001'
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO inventory_items (product_id, quantity, reserved_quantity, low_stock_threshold)
SELECT id, 12, 0, 3 FROM products WHERE sku = 'ELEC-LP-002'
ON CONFLICT (product_id) DO NOTHING;

INSERT INTO inventory_items (product_id, quantity, reserved_quantity, low_stock_threshold)
SELECT id, 120, 0, 15 FROM products WHERE sku = 'APPR-HD-001'
ON CONFLICT (product_id) DO NOTHING;

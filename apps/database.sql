-- Complete Leema E-commerce Database Schema
-- MySQL 8.0+

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── USER MANAGEMENT ───────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  profile_picture VARCHAR(500),
  role ENUM('admin', 'user', 'guest') DEFAULT 'user',
  status ENUM('active', 'inactive', 'suspended', 'deleted') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

CREATE TABLE sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  refresh_token VARCHAR(500) NOT NULL UNIQUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── PRODUCT MANAGEMENT ───────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  image VARCHAR(500),
  slug VARCHAR(100) UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_is_active (is_active)
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category_id INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2), -- Cost price for profit calculation
  stock INT NOT NULL DEFAULT 0,
  sku VARCHAR(100) UNIQUE,
  description TEXT,
  long_description LONGTEXT,
  image VARCHAR(500),
  images JSON, -- Multiple product images
  status ENUM('active', 'inactive', 'discontinued', 'draft') DEFAULT 'active',
  rating DECIMAL(3, 2) DEFAULT 0,
  total_sales INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  INDEX idx_category_id (category_id),
  INDEX idx_status (status),
  INDEX idx_sku (sku),
  INDEX idx_price (price)
);

CREATE TABLE product_attributes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  attribute_name VARCHAR(100) NOT NULL,
  attribute_value VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id)
);

CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rating (product_id, user_id),
  INDEX idx_product_id (product_id),
  INDEX idx_rating (rating)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── SERVICES MANAGEMENT ──────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  long_description LONGTEXT,
  icon VARCHAR(100),
  image VARCHAR(500),
  active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_type (type),
  INDEX idx_active (active),
  INDEX idx_display_order (display_order)
);

CREATE TABLE service_addons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  service_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
  INDEX idx_service_id (service_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── CART & WISHLIST ──────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_cart (user_id),
  INDEX idx_user_id (user_id)
);

CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  added_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_cart_product (cart_id, product_id),
  INDEX idx_cart_id (cart_id),
  INDEX idx_product_id (product_id)
);

CREATE TABLE wishlists (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_wishlist (user_id),
  INDEX idx_user_id (user_id)
);

CREATE TABLE wishlist_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  wishlist_id INT NOT NULL,
  product_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wishlist_id) REFERENCES wishlists(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_wishlist_product (wishlist_id, product_id),
  INDEX idx_wishlist_id (wishlist_id)
);

CREATE TABLE abandoned_carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  user_id INT NOT NULL,
  total_value DECIMAL(10, 2) NOT NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_sent_at TIMESTAMP NULL,
  reminder_count INT DEFAULT 0,
  recovered_order_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (recovered_order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_reminder_sent (reminder_sent)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── ADDRESS MANAGEMENT ───────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE shipping_addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  street_address VARCHAR(255) NOT NULL,
  apartment_suite VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_default (is_default)
);

CREATE TABLE billing_addresses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  street_address VARCHAR(255) NOT NULL,
  apartment_suite VARCHAR(100),
  city VARCHAR(100) NOT NULL,
  state_province VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  country VARCHAR(100) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_default (is_default)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── SHIPPING & DELIVERY ──────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE shipping_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  cost DECIMAL(10, 2) NOT NULL,
  estimated_days INT,
  estimated_days_max INT,
  is_active BOOLEAN DEFAULT TRUE,
  countries JSON, -- JSON array of supported countries
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active)
);

CREATE TABLE shipments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  shipping_method_id INT,
  tracking_number VARCHAR(255) UNIQUE,
  carrier VARCHAR(100), -- FedEx, UPS, DHL, etc.
  status ENUM('pending', 'processing', 'shipped', 'in_transit', 'delivered', 'failed', 'returned') DEFAULT 'pending',
  shipped_date TIMESTAMP NULL,
  estimated_delivery_date DATE,
  delivered_date TIMESTAMP NULL,
  shipping_cost DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_tracking_number (tracking_number),
  INDEX idx_status (status)
);

CREATE TABLE shipment_tracking (
  id INT PRIMARY KEY AUTO_INCREMENT,
  shipment_id INT NOT NULL,
  status VARCHAR(50),
  location VARCHAR(255),
  timestamp TIMESTAMP,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  INDEX idx_shipment_id (shipment_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── DISCOUNT & COUPON MANAGEMENT ──────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE coupons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type ENUM('percentage', 'fixed_amount') NOT NULL,
  discount_value DECIMAL(10, 2) NOT NULL,
  max_uses INT,
  current_uses INT DEFAULT 0,
  min_order_amount DECIMAL(10, 2),
  max_order_amount DECIMAL(10, 2),
  applicable_to ENUM('all_products', 'specific_products', 'specific_categories') DEFAULT 'all_products',
  valid_from DATE NOT NULL,
  valid_until DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_code (code),
  INDEX idx_is_active (is_active),
  INDEX idx_valid_until (valid_until)
);

CREATE TABLE coupon_products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coupon_id INT NOT NULL,
  product_id INT NOT NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_coupon_product (coupon_id, product_id)
);

CREATE TABLE coupon_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  coupon_id INT NOT NULL,
  category_id INT NOT NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE KEY unique_coupon_category (coupon_id, category_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── ORDER MANAGEMENT ──────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  order_number VARCHAR(50) UNIQUE NOT NULL,
  shipping_address_id INT,
  billing_address_id INT,
  shipping_method_id INT,
  coupon_id INT,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned') DEFAULT 'pending',
  payment_status ENUM('pending', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
  customer_notes TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id) ON DELETE SET NULL,
  FOREIGN KEY (billing_address_id) REFERENCES billing_addresses(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_order_number (order_number),
  INDEX idx_status (status),
  INDEX idx_payment_status (payment_status),
  INDEX idx_created_at (created_at)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_product_id (product_id)
);

CREATE TABLE order_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  status VARCHAR(50) NOT NULL,
  message TEXT,
  changed_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_created_at (created_at)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── CHECKOUT SESSION ──────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE checkout_sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  cart_id INT,
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  shipping_method_id INT,
  payment_method_id INT,
  coupon_code VARCHAR(50),
  shipping_address_id INT,
  billing_address_id INT,
  status ENUM('active', 'abandoned', 'completed', 'expired', 'failed') DEFAULT 'active',
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
  FOREIGN KEY (shipping_address_id) REFERENCES shipping_addresses(id) ON DELETE SET NULL,
  FOREIGN KEY (billing_address_id) REFERENCES billing_addresses(id) ON DELETE SET NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_session_token (session_token),
  INDEX idx_status (status),
  INDEX idx_expires_at (expires_at)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── PAYMENT MANAGEMENT ────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE payment_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  method_type ENUM('credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer', 'apple_pay', 'google_pay') NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  card_last_four VARCHAR(4),
  card_brand VARCHAR(50),
  card_expiry_month INT,
  card_expiry_year INT,
  email VARCHAR(255),
  account_holder VARCHAR(255),
  bank_name VARCHAR(255),
  account_number_last_four VARCHAR(4),
  stripe_payment_method_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_method_type (method_type),
  INDEX idx_is_default (is_default)
);

CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  payment_method_id INT,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled') DEFAULT 'pending',
  gateway VARCHAR(50), -- stripe, paypal, razorpay, etc.
  gateway_transaction_id VARCHAR(255) UNIQUE,
  gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_gateway_transaction_id (gateway_transaction_id)
);

CREATE TABLE refunds (
  id INT PRIMARY KEY AUTO_INCREMENT,
  payment_id INT NOT NULL,
  order_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  reason VARCHAR(255),
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  gateway_refund_id VARCHAR(255) UNIQUE,
  gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX idx_payment_id (payment_id),
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
);

CREATE TABLE invoices (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL UNIQUE,
  payment_id INT,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  pdf_url VARCHAR(500),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_cost DECIMAL(10, 2) DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL,
  issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  due_date DATE,
  paid_date TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  INDEX idx_order_id (order_id),
  INDEX idx_invoice_number (invoice_number)
);

CREATE TABLE transaction_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  payment_id INT,
  refund_id INT,
  action VARCHAR(100), -- charge, refund, retry, webhook
  status VARCHAR(50),
  amount DECIMAL(10, 2),
  error_message TEXT,
  gateway_response JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  FOREIGN KEY (refund_id) REFERENCES refunds(id) ON DELETE SET NULL,
  INDEX idx_payment_id (payment_id),
  INDEX idx_created_at (created_at)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── RETURNS & EXCHANGES ──────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE returns (
  id INT PRIMARY KEY AUTO_INCREMENT,
  order_id INT NOT NULL,
  user_id INT NOT NULL,
  reason VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('requested', 'approved', 'rejected', 'in_transit', 'received', 'refunded', 'cancelled') DEFAULT 'requested',
  return_date DATE,
  received_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_order_id (order_id),
  INDEX idx_status (status)
);

CREATE TABLE return_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  return_id INT NOT NULL,
  order_item_id INT NOT NULL,
  quantity INT NOT NULL,
  refund_amount DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  INDEX idx_return_id (return_id)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── INVENTORY MANAGEMENT ─────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE inventory_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  quantity_change INT,
  reason VARCHAR(100), -- purchase, return, restock, damage, adjustment
  order_id INT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
  INDEX idx_product_id (product_id),
  INDEX idx_created_at (created_at)
);

CREATE TABLE low_stock_alerts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  threshold_quantity INT NOT NULL,
  current_quantity INT,
  alert_sent BOOLEAN DEFAULT FALSE,
  alert_sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_alert_sent (alert_sent)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── ANALYTICS & REPORTING ────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE sales_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  date DATE NOT NULL UNIQUE,
  total_orders INT DEFAULT 0,
  total_sales DECIMAL(12, 2) DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0,
  total_customers INT DEFAULT 0,
  avg_order_value DECIMAL(10, 2) DEFAULT 0,
  total_items_sold INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_date (date)
);

CREATE TABLE product_analytics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  date DATE NOT NULL,
  views INT DEFAULT 0,
  purchases INT DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE KEY unique_product_date (product_id, date),
  INDEX idx_product_id (product_id),
  INDEX idx_date (date)
);

CREATE TABLE user_activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(100), -- login, logout, view_product, add_to_cart, purchase, etc.
  resource_type VARCHAR(50), -- product, order, etc.
  resource_id INT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── NOTIFICATIONS & EMAIL ────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  type VARCHAR(50), -- order_confirmation, shipment, delivery, return, etc.
  title VARCHAR(255),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_is_read (is_read),
  INDEX idx_created_at (created_at)
);

CREATE TABLE email_queue (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  template VARCHAR(100),
  template_data JSON,
  status ENUM('pending', 'sent', 'failed', 'bounced') DEFAULT 'pending',
  retry_count INT DEFAULT 0,
  sent_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── ADMIN & SETTINGS ──────────────────────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE TABLE admin_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  admin_id INT NOT NULL,
  action VARCHAR(100), -- create, update, delete
  entity_type VARCHAR(50), -- product, order, user, etc.
  entity_id INT,
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_admin_id (admin_id),
  INDEX idx_action (action),
  INDEX idx_created_at (created_at)
);

CREATE TABLE system_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSON,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_setting_key (setting_key)
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ─── CREATE INDEXES FOR PERFORMANCE ───────────────────────────────────────────
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE INDEX idx_orders_created_at_user ON orders(created_at, user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_payments_order ON payments(order_id, status);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_product_reviews_product ON ratings(product_id, rating);
CREATE INDEX idx_sessions_user ON sessions(user_id, expires_at);




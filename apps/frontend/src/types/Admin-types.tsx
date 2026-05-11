// ─────────────────────────────────────────────────────────────────────────────
// Leema API Types — mirrors Java DTOs exactly
// ─────────────────────────────────────────────────────────────────────────────

// ── Generic wrappers ──────────────────────────────────────────────────────────

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    status: number;
    timestamp: string;
  }
  
  export interface PagedResponse<T> {
    content: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    empty: boolean;
  }
  
  // ── Auth ──────────────────────────────────────────────────────────────────────
  
  export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
    userId: number;
    email: string;
    name: string;
    role: UserRole;
    status: UserStatus;
    profilePicture?: string;
  }
  
  export type UserRole = 'ADMIN' | 'USER' | 'SELLER' | 'GUEST';
  export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  
  // ── User ──────────────────────────────────────────────────────────────────────
  
  export interface User {
    id: number;
    email: string;
    name: string;
    phoneNumber?: string;
    profilePicture?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Product ───────────────────────────────────────────────────────────────────
  
  export type ProductStatus = 'ACTIVE' | 'INACTIVE' | 'DISCONTINUED' | 'DRAFT';
  
  export interface ProductAttribute {
    id: number;
    attributeName: string;
    attributeValue: string;
  }
  
  export interface Product {
    id: number;
    name: string;
    categoryId: number;
    categoryName: string;
    sellerId?: number;
    sellerShopName?: string;
    price: number;
    cost?: number;
    stock: number;
    sku?: string;
    description?: string;
    longDescription?: string;
    image?: string;
    images?: string[];
    status: ProductStatus;
    featured?: boolean;
    rating: number;
    totalSales: number;
    reviewCount?: number;
    attributes?: ProductAttribute[];
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Category ─────────────────────────────────────────────────────────────────
  
  export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Order ─────────────────────────────────────────────────────────────────────
  
  export type OrderStatus =
    | 'PENDING' | 'CONFIRMED' | 'PROCESSING'
    | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
    | 'REFUNDED' | 'RETURNED';
  
  export type PaymentStatus =
    | 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
  
  export interface OrderItem {
    id: number;
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    tax: number;
    total: number;
  }
  
  export interface OrderHistory {
    id: number;
    status: string;
    message?: string;
    changedBy?: string;
    createdAt: string;
  }
  
  export interface ShipmentSummary {
    id: number;
    trackingNumber?: string;
    carrier?: string;
    status: string;
    shippedDate?: string;
    deliveredDate?: string;
  }
  
  export interface PaymentSummary {
    id: number;
    amount: number;
    currency: string;
    status: string;
    gateway?: string;
    gatewayTransactionId?: string;
    createdAt: string;
  }
  
  export interface ShippingMethodSummary {
    id: number;
    name: string;
    cost: number;
    estimatedDays?: number;
  }
  
  export interface CouponSummary {
    id: number;
    code: string;
    discountType: string;
    discountValue: number;
  }
  
  export interface Order {
    id: number;
    orderNumber: string;
    userId: number;
    userEmail?: string;
    userName?: string;
    subtotal: number;
    tax: number;
    shippingCost: number;
    discountAmount: number;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    customerNotes?: string;
    adminNotes?: string;
    shippingAddress?: Address;
    billingAddress?: Address;
    shippingMethod?: ShippingMethodSummary;
    coupon?: CouponSummary;
    items?: OrderItem[];
    history?: OrderHistory[];
    shipment?: ShipmentSummary;
    payment?: PaymentSummary;
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Address ───────────────────────────────────────────────────────────────────
  
  export interface Address {
    id: number;
    userId?: number;
    fullName: string;
    phoneNumber: string;
    email?: string;
    streetAddress: string;
    apartmentSuite?: string;
    city: string;
    stateProvince?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
    type?: 'shipping' | 'billing';
    createdAt?: string;
    updatedAt?: string;
  }
  
  // ── Cart ──────────────────────────────────────────────────────────────────────
  
  export interface CartItem {
    id: number;
    productId: number;
    productName: string;
    productImage?: string;
    productStatus: string;
    addedPrice: number;
    currentPrice: number;
    priceChanged: boolean;
    quantity: number;
    availableStock: number;
    itemTotal: number;
    addedAt: string;
  }
  
  export interface Cart {
    id: number;
    userId: number;
    items: CartItem[];
    totalItems: number;
    subtotal: number;
    updatedAt: string;
  }
  
  // ── Wishlist ──────────────────────────────────────────────────────────────────
  
  export interface WishlistItem {
    id: number;
    productId: number;
    productName: string;
    productImage?: string;
    price: number;
    status: string;
    stock: number;
    rating: number;
    addedAt: string;
  }
  
  export interface Wishlist {
    id: number;
    userId: number;
    items: WishlistItem[];
    totalItems: number;
  }
  
  // ── Review ────────────────────────────────────────────────────────────────────
  
  export interface Review {
    id: number;
    productId: number;
    userId: number;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    comment?: string;
    verifiedPurchase: boolean;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Payment ───────────────────────────────────────────────────────────────────
  
  export interface PaymentMethod {
    id: number;
    methodType: string;
    isDefault: boolean;
    cardLastFour?: string;
    cardBrand?: string;
    cardExpiryMonth?: number;
    cardExpiryYear?: number;
    email?: string;
    accountHolder?: string;
    bankName?: string;
    accountNumberLastFour?: string;
    createdAt: string;
  }
  
  export interface Refund {
    id: number;
    paymentId: number;
    orderId: number;
    amount: number;
    reason?: string;
    status: string;
    gatewayRefundId?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Return ────────────────────────────────────────────────────────────────────
  
  export interface ReturnItem {
    id: number;
    orderItemId: number;
    productId: number;
    productName: string;
    quantity: number;
    refundAmount?: number;
  }
  
  export interface Return {
    id: number;
    orderId: number;
    orderNumber: string;
    userId: number;
    reason: string;
    description?: string;
    status: string;
    returnDate?: string;
    receivedDate?: string;
    items?: ReturnItem[];
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Notification ──────────────────────────────────────────────────────────────
  
  export interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    readAt?: string;
    createdAt: string;
  }
  
  export interface NotificationList {
    notifications: Notification[];
    unreadCount: number;
  }
  
  // ── Shipping ──────────────────────────────────────────────────────────────────
  
  export interface ShippingMethod {
    id: number;
    name: string;
    description?: string;
    cost: number;
    estimatedDays?: number;
    estimatedDaysMax?: number;
    isActive: boolean;
    countries?: string[];
  }
  
  export interface Shipment {
    id: number;
    orderId: number;
    trackingNumber?: string;
    carrier?: string;
    status: string;
    shippedDate?: string;
    estimatedDeliveryDate?: string;
    deliveredDate?: string;
    shippingCost?: number;
    createdAt: string;
    updatedAt: string;
  }
  
  // ── Coupon ────────────────────────────────────────────────────────────────────
  
  export interface Coupon {
    id: number;
    code: string;
    description?: string;
    discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
    discountValue: number;
    maxUses?: number;
    currentUses: number;
    minOrderAmount?: number;
    maxOrderAmount?: number;
    applicableTo: string;
    validFrom: string;
    validUntil: string;
    isActive: boolean;
  }
  
  // ── Seller ────────────────────────────────────────────────────────────────────
  
  export interface SellerProfile {
    id: number;
    userId: number;
    userEmail?: string;
    userName?: string;
    shopName: string;
    shopDescription?: string;
    shopLogo?: string;
    shopBanner?: string;
    businessName?: string;
    businessRegistrationNumber?: string;
    taxId?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    status: 'PENDING' | 'ACTIVE' | 'REJECTED' | 'SUSPENDED';
    commissionRate?: number;
    rejectionReason?: string;
    suspensionReason?: string;
    approvedAt?: string;
    totalProducts?: number;
    totalOrders?: number;
    totalRevenue?: number;
    rating?: number;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface SellerPayout {
    id: number;
    sellerId: number;
    shopName: string;
    amount: number;
    commissionDeducted: number;
    netAmount: number;
    status: string;
    payoutMethod?: string;
    referenceNumber?: string;
    notes?: string;
    periodFrom?: string;
    periodTo?: string;
    processedAt?: string;
    createdAt: string;
  }
  
  export interface SellerOrderItem {
    orderItemId: number;
    productId: number;
    productName: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }
  
  export interface SellerOrder {
    orderId: number;
    orderNumber: string;
    orderStatus: OrderStatus;
    paymentStatus: PaymentStatus;
    buyerName: string;
    shippingCity?: string;
    shippingCountry?: string;
    items: SellerOrderItem[];
    itemsSubtotal: number;
    commissionDeducted: number;
    sellerRevenue: number;
    createdAt: string;
  }
  
  export interface SellerAnalytics {
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    pendingPayouts: number;
    totalPayoutsReceived: number;
    commissionRate: number;
    rating: number;
    revenueTrend: Array<{
      date: string;
      revenue: number;
      commission: number;
      netRevenue: number;
      orders: number;
    }>;
    topProducts: Array<{
      productId: number;
      productName: string;
      productImage?: string;
      unitsSold: number;
      revenue: number;
    }>;
  }
  
  // ── Admin ─────────────────────────────────────────────────────────────────────
  
  export interface AdminDashboard {
    totalUsers: number;
    totalSellers: number;
    activeSellers: number;
    pendingSellers: number;
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalRevenue: number;
    todayRevenue: number;
    monthRevenue: number;
    totalPayments: number;
    pendingRefunds: number;
    lowStockProducts: number;
    recentSales: Array<{
      date: string;
      revenue: number;
      orders: number;
    }>;
  }
  
  export interface AdminSalesAnalytics {
    date: string;
    totalOrders: number;
    totalSales: number;
    totalRevenue: number;
    totalCustomers: number;
    avgOrderValue: number;
    totalItemsSold: number;
  }
  
  export interface AdminInventory {
    productId: number;
    productName: string;
    sku?: string;
    category: string;
    stock: number;
    threshold: number;
    lowStock: boolean;
    updatedAt: string;
  }
  
  export interface AdminLog {
    id: number;
    adminId: number;
    action: string;
    entityType: string;
    entityId?: number;
    oldValues?: Record<string, unknown>;
    newValues?: Record<string, unknown>;
    createdAt: string;
  }
  
  export interface SystemSetting {
    id: number;
    settingKey: string;
    settingValue: Record<string, unknown>;
    description?: string;
    updatedAt: string;
  }
  
  export interface EmailQueue {
    id: number;
    userId?: number;
    email: string;
    subject?: string;
    template?: string;
    status: string;
    retryCount: number;
    sentAt?: string;
    createdAt: string;
  }
  
  // ── Request payloads ──────────────────────────────────────────────────────────
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
  }
  
  export interface SellerRegisterRequest {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    shopName: string;
    shopDescription?: string;
    shopLogo?: string;
    businessName?: string;
    businessRegistrationNumber?: string;
    taxId?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  }
  
  export interface RefreshTokenRequest {
    refreshToken: string;
  }
  
  export interface UpdateProfileRequest {
    name?: string;
    phoneNumber?: string;
    profilePicture?: string;
  }
  
  export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface AddressRequest {
    fullName: string;
    phoneNumber: string;
    email?: string;
    streetAddress: string;
    apartmentSuite?: string;
    city: string;
    stateProvince?: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }
  
  export interface CartItemRequest {
    productId: number;
    quantity: number;
  }
  
  export interface OrderRequest {
    shippingAddressId: number;
    billingAddressId?: number;
    shippingMethodId: number;
    paymentMethodId?: number;
    couponCode?: string;
    customerNotes?: string;
  }
  
  export interface PaymentRequest {
    orderId: number;
    paymentMethodId?: number;
    methodType: string;
    gateway?: string;
    stripePaymentMethodId?: string;
    currency?: string;
    savePaymentMethod?: boolean;
  }
  
  export interface ReviewRequest {
    rating: number;
    title?: string;
    comment?: string;
  }
  
  export interface ReturnRequest {
    orderId: number;
    reason: string;
    description?: string;
    items: Array<{ orderItemId: number; quantity: number }>;
  }
  
  export interface ProductRequest {
    name: string;
    categoryId: number;
    price: number;
    cost?: number;
    stock?: number;
    sku?: string;
    description?: string;
    longDescription?: string;
    image?: string;
    images?: string[];
    status?: string;
    featured?: boolean;
    attributes?: Array<{ attributeName: string; attributeValue: string }>;
  }
  
  export interface SellerProfileRequest {
    shopName?: string;
    shopDescription?: string;
    shopLogo?: string;
    shopBanner?: string;
    businessName?: string;
    businessRegistrationNumber?: string;
    taxId?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
  }
  
  // ── Pagination params ─────────────────────────────────────────────────────────
  
  export interface PaginationParams {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
  }
  
  export interface ProductFilterParams extends PaginationParams {
    search?: string;
    categoryId?: number;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    featured?: boolean;
  }
  
  export interface OrderFilterParams extends PaginationParams {
    status?: string;
    paymentStatus?: string;
    from?: string;
    to?: string;
    userId?: number;
  }
import { authFetch, API_BASE, productImageUrl } from "./api";

export type DashboardStats = {
  totalOrders: number;
  pendingOrders: number;
  wishlistCount: number;
  serviceCount: number;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string | null;
  address?: string;
  city?: string;
  district?: string;
  postalCode?: string;
};

export type UserOrder = {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt?: string;
  paymentMethod?: string;
  deliveryCharge?: number;
  productName?: string;
  productImage?: string;
  items?: Array<{
    productName: string;
    productImage?: string;
    quantity: number;
    price: number;
  }>;
};

export type WishlistItem = {
  id: number;
  productId: number;
  name: string;
  img: string;
  price?: number;
};

export type ServiceRequest = {
  id: number;
  referenceNumber?: string;
  invoiceRef?: string;
  status: string;
  details?: string;
  warrantyState?: boolean;
  createdAt?: string;
  date?: string;
};

export type UserNotification = {
  id: number;
  title: string;
  message: string;
  type?: string;
  read: boolean;
  createdAt?: string;
};
export type ServiceType = "REPAIR" | "REFUND" | "REINSTALLMENT";

export type ServiceRequestSubmit = {
  type: ServiceType;
  orderNumber: string;
  sku: string;
  issueDescription: string;
};
const url = (path: string) =>
  `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;

const asArray = <T>(data: unknown): T[] => (Array.isArray(data) ? data : []);

const mapOrder = (raw: any): UserOrder => ({
  id: raw.id,
  orderNumber: raw.orderNumber ?? raw.order_number ?? `#${raw.id}`,
  status: (raw.status ?? raw.orderStatus ?? "pending").toLowerCase(),
  totalAmount: Number(raw.totalAmount ?? raw.total_amount ?? raw.price ?? 0),
  createdAt: raw.createdAt ?? raw.created_at ?? raw.orderDate,
  paymentMethod: raw.paymentMethod ?? raw.payment_method ?? "COD",
  deliveryCharge: Number(
    raw.deliveryCharge ?? raw.shipping_cost ?? raw.shippingCost ?? 0,
  ),
  productName:
    raw.productName ??
    raw.items?.[0]?.productName ??
    raw.items?.[0]?.product?.name ??
    "Order items",
  productImage: productImageUrl(
    raw.productImage ??
      raw.items?.[0]?.imageUrl ?? // ✅ ADD THIS
      raw.items?.[0]?.product?.image,
  ),
  items: raw.items?.map((item: any) => ({
    productName: item.productName ?? item.product?.name ?? "Product",
    productImage: productImageUrl(
      item.imageUrl ?? // ✅ IMPORTANT FIX
        item.productImage ??
        item.product?.image,
    ),
    quantity: item.quantity ?? 1,
    price: Number(item.unitPrice ?? item.price ?? item.subtotal ?? 0),
  })),
});

const mapWishlistItem = (raw: any): WishlistItem => ({
  id: raw.productId,
  productId: raw.productId,
  name: raw.productName,
  img: productImageUrl(raw.imageUrl), // ✅ FIXED
  price: Number(raw.price ?? 0),
});

const mapServiceRequest = (raw: any): ServiceRequest => ({
  id: raw.id,
  referenceNumber: raw.referenceNumber ?? raw.reference_number,
  invoiceRef:
    raw.invoiceRef ??
    raw.invoiceNumber ??
    raw.invoice_number ??
    raw.issueDescription,
  status: (raw.status ?? "PENDING").toUpperCase(),
  details: raw.details ?? raw.issueDescription ?? raw.description,
  warrantyState: raw.warrantyState ?? raw.warranty_state,
  createdAt: raw.createdAt ?? raw.created_at,
  date: raw.date ?? raw.createdAt ?? raw.created_at,
});

const mapNotification = (raw: any): UserNotification => ({
  id: raw.id,
  title: raw.title ?? "Notification",
  message: raw.message ?? "",
  type: raw.type,
  read: Boolean(raw.read ?? raw.is_read ?? raw.isRead),
  createdAt: raw.createdAt ?? raw.created_at,
});

export const userApi = {
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await authFetch(url("/api/dashboard/overview"));
      if (!res.ok) throw new Error("stats failed");
      const data = await res.json();
      return {
        totalOrders: data.totalOrders ?? data.total_orders ?? 0,
        pendingOrders: data.pendingOrders ?? data.pending_orders ?? 0,
        wishlistCount: data.wishlistCount ?? data.wishlist_count ?? 0,
        serviceCount: data.serviceCount ?? data.service_count ?? 0,
      };
    } catch {
      return {
        totalOrders: 0,
        pendingOrders: 0,
        wishlistCount: 0,
        serviceCount: 0,
      };
    }
  },

  async getRecentOrders(): Promise<UserOrder[]> {
    const res = await authFetch(url("/api/orders/recent"));
    if (!res.ok) return [];
    return asArray<any>(await res.json()).map(mapOrder);
  },

  async getOrders(): Promise<UserOrder[]> {
    for (const path of [
      "/api/orders",
      "/api/orders/my",
      "/api/orders/recent",
    ]) {
      try {
        const res = await authFetch(url(path));
        if (res.ok) return asArray<any>(await res.json()).map(mapOrder);
      } catch {
        // try next
      }
    }
    return [];
  },

  async getProfile(): Promise<UserProfile | null> {
    const res = await authFetch(url("/api/users/me"));
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id ?? data.userId,
      name: data.name ?? "",
      email: data.email ?? "",
      phoneNumber: data.phoneNumber ?? data.phone_number ?? data.phone ?? "",
      profilePicture: data.profilePicture ?? data.profile_picture ?? null,
      address: data.address ?? data.streetAddress ?? "",
      city: data.city ?? "",
      district: data.district ?? data.stateProvince ?? "",
      postalCode: data.postalCode ?? data.postal_code ?? "",
    };
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<boolean> {
    const res = await authFetch(url("/api/users/me"), {
      method: "PUT",
      body: JSON.stringify({
        name: payload.name,
        email: payload.email,
        phoneNumber: payload.phoneNumber,
        address: payload.address,
        city: payload.city,
        district: payload.district,
        postalCode: payload.postalCode,
      }),
    });
    return res.ok;
  },

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const res = await authFetch(url("/api/users/change-password"), {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    return res.ok;
  },

  async getWishlist(): Promise<WishlistItem[]> {
    const res = await authFetch(url("/api/wishlist"));
    if (!res.ok) return [];

    const data = await res.json();

    // ✅ FIX: use data.items directly
    return asArray<any>(data.items).map(mapWishlistItem);
  },
  async addToWishlist(productId: number): Promise<boolean> {
    const res = await authFetch(url(`/api/wishlist/add/${productId}`), {
      method: "POST",
    });

    return res.ok;
  },

  async removeFromWishlist(productId: number): Promise<boolean> {
    const res = await authFetch(url(`/api/wishlist/remove/${productId}`), {
      method: "DELETE",
    });

    return res.ok;
  },
  async isInWishlist(productId: number): Promise<boolean> {
    const items = await this.getWishlist();
    return items.some((i) => i.productId === productId);
  },

  async getServiceRequests(): Promise<ServiceRequest[]> {
    const res = await authFetch(url("/api/repairs"));

    if (!res.ok) return [];

    return asArray<any>(await res.json()).map(mapServiceRequest);
  },

  async submitServiceRequest(data: {
    orderNumber: string;
    sku: string;
    issueDescription: string;
    type: "REPAIR" | "REFUND" | "REINSTALLMENT";
  }): Promise<boolean> {
    const res = await authFetch(url("/api/repairs"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderNumber: data.orderNumber,
        sku: data.sku,
        issueDescription: data.issueDescription,
        type: data.type,
      }),
    });

    return res.ok;
  },

  async getNotifications(): Promise<UserNotification[]> {
    const res = await authFetch(url("/api/notifications/my"));
    if (!res.ok) return [];

    return asArray<any>(await res.json()).map(mapNotification);
  },

  async markNotificationRead(id: number): Promise<void> {
    await authFetch(url(`/api/notifications/${id}/read`), { method: "PATCH" });
  },
};

export const API_BASE = "http://localhost:8080";

const AUTH_EVENT = "leema:auth-changed";

export const authFetch = async (url: string, options: any = {}) => {
  const token = localStorage.getItem("token");
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
};

export const isLoggedIn = (): boolean => Boolean(localStorage.getItem("token"));

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return {
    token,
    role: localStorage.getItem("role") || "",
    userId: Number(localStorage.getItem("userId") || 0),
    email: localStorage.getItem("email") || "",
  };
};

export const notifyAuthChanged = () => {
  window.dispatchEvent(new CustomEvent(AUTH_EVENT));
};

export const subscribeAuth = (cb: () => void): (() => void) => {
  const handler = () => cb();
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  notifyAuthChanged();
};

export const dashboardPath = (role: string): string => {
  switch ((role || "").toUpperCase()) {
    case "ADMIN":
      return "/admin/dashboard";
    case "SELLER":
      return "/seller/dashboard";
    default:
      return "/user/dashboard";
  }
};

export const productImageUrl = (img?: string | null): string => {
  if (!img) return "/images/placeholder.jpg";
  if (/^https?:\/\//i.test(img)) return img;
  return `${API_BASE}/${img.replace(/^\/+/, "")}`;
};

export type ApiProduct = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string | null;
  stock?: number;
  categoryName?: string;
};

const mapProduct = (raw: any): ApiProduct => ({
  id: raw.id,
  name: raw.name,
  price: Number(raw.finalPrice ?? raw.price ?? 0),
  description: raw.description,
  image: raw.image,
  stock: raw.stock,
  categoryName: raw.categoryName ?? raw.category?.name,
});

export const api = {
  async getFeaturedProducts(limit = 8): Promise<ApiProduct[]> {
    try {
      const res = await fetch(`${API_BASE}/api/products/featured`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.slice(0, limit).map(mapProduct);
        }
      }
    } catch {
      // fall through
    }
    const res = await fetch(`${API_BASE}/api/products`);
    if (!res.ok) throw new Error("Failed to load products");
    const data = await res.json();
    return (Array.isArray(data) ? data : []).slice(0, limit).map(mapProduct);
  },

  async getProduct(id: number | string): Promise<ApiProduct> {
    const res = await fetch(`${API_BASE}/api/products/${id}`);
    if (!res.ok) throw new Error("Failed to load product");
    return mapProduct(await res.json());
  },
};

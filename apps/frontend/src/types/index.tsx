// ─── Domain Models ────────────────────────────────────────────────────────────

export type ProductStatus = "Active" | "Low Stock" | "Out of Stock";
export type UserRole      = "Customer" | "VIP" | "Admin";
export type UserStatus    = "Active" | "Inactive";
export type ServiceType   = "Warranty" | "Delivery" | "Protection" | "Maintenance" | "Support" | "Trade-In";
export type OrderStatus   = "Delivered" | "In Transit" | "Processing" | "Cancelled";
export type ModalType     = "add" | "edit" | "view" | "delete" | null;
export type ViewMode      = "table" | "grid";
export type ProfileTab    = "profile" | "security";
export type BadgeVariant  = "default" | "success" | "warning" | "danger" | "info" | "purple";
export type BtnVariant    = "primary" | "secondary" | "danger" | "ghost" | "dark";
export type BtnSize       = "sm" | "md" | "lg";
export type ModalSize     = "sm" | "md" | "lg" | "xl";
export type AvatarSize    = "sm" | "md" | "lg";
export type NavPage       = "dashboard" | "products" | "users" | "services" | "analytics" | "profile";

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id:          number;
  name:        string;
  category:    string;
  price:       number;
  stock:       number;
  status:      ProductStatus;
  rating:      number;
  sales:       number;
  image:       string;
  description: string;
}

export type ProductFormData = Omit<Product, "id" | "rating" | "sales"> & {
  price: number;  // string while editing, coerced on save
  stock: number;
};

// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id:     number;
  name:   string;
  email:  string;
  phone:  string;
  role:   UserRole;
  status: UserStatus;
  orders: number;
  spent:  number;
  joined: string;
  avatar: string;
}

export type UserFormData = Pick<User, "name" | "email" | "phone" | "role" | "status">;

// ─── Service ──────────────────────────────────────────────────────────────────

export interface Service {
  id:          number;
  name:        string;
  icon:        string;
  type:        ServiceType;
  price:       number;
  active:      boolean;
  description: string;
  subscribers: number;
}

export type ServiceFormData = Omit<Service, "id" | "subscribers"> & {
  price: number;
};

// ─── Order ────────────────────────────────────────────────────────────────────

export interface Order {
  id:       string;
  customer: string;
  product:  string;
  amount:   number;
  status:   OrderStatus;
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export interface KPI {
  label:  string;
  value:  string;
  change: string;
  up:     boolean;
}

export interface TrafficSource {
  source: string;
  visits: number;
  pct:    number;
}

export interface CategoryShare {
  name:      string;
  pct:       number;
  color:     string;
}

export interface TrafficSegment {
  pct:   number;
  color: string;
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  id:    NavPage;
  label: string;
  icon:  React.ComponentType<{ size?: number; className?: string }>;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export interface StatCardProps {
  label:      string;
  value:      string;
  change?:    string;
  up?:        boolean;
  icon:       React.ComponentType<{ size?: number; className?: string }>;
  colorClass: string;
  bgClass:    string;
  ringClass:  string;
}

// ─── Chart ───────────────────────────────────────────────────────────────────

export interface BarChartProps {
  data:   number[];
  labels: string[];
  color?: string;
}

export interface SparkLineProps {
  data:    number[];
  color?:  string;
  height?: number;
}

export interface ProgressBarProps {
  label:      string;
  pct:        number;
  colorClass?: string;
}

// ─── Modal Hook ───────────────────────────────────────────────────────────────

export interface UseModalReturn<T> {
  modal:    ModalType;
  selected: T | null;
  open:     (type: NonNullable<ModalType>, item?: T) => void;
  close:    () => void;
}

// ─── Report ──────────────────────────────────────────────────────────────────

export interface Report {
  title:  string;
  desc:   string;
  period: string;
}
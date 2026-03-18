export type ActivePanel = "orders" | "details" | "service";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  district: string;
  postalCode: string;
  email: string;
  phone: string;
  avatar: string | null;
}

export interface Order {
  id: string;
  orderDate: string;
  paymentMethod: string;
  deliveryCharge: string;
  price: number;
  status: "delivered" | "on-deliver" | "pending" | "cancelled";
  productImage: string;
  productName: string;
}

export interface WishlistItem {
  id: number;
  name: string;
  image: string;
}

export interface ServiceRequest {
  id: string;
  invoiceRef: string;
  date: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
}
import type { UserProfile, Order, WishlistItem, ServiceRequest } from "../types/dashboard.types";

export const MOCK_USER: UserProfile = {
  id: "S3523636",
  firstName: "Dilhara",
  lastName: "Perera",
  address: "123 Galle Road",
  city: "Colombo",
  district: "Colombo",
  postalCode: "00300",
  email: "dilhara@email.com",
  phone: "071 883535",
  avatar: null,
};

export const MOCK_ORDERS: Order[] = [
  { id: "FI325501", orderDate: "25/06/2026 10:34:00", paymentMethod: "Full Payment", deliveryCharge: "Free", price: 130000, status: "delivered",  productImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80", productName: "Sectional Sofa Set" },
  { id: "FI325601", orderDate: "25/06/2026 10:34:00", paymentMethod: "Full Payment", deliveryCharge: "Free", price: 130000, status: "on-deliver", productImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&q=80", productName: "Emerald L-Shape Sofa" },
  { id: "FI325701", orderDate: "25/06/2026 10:34:00", paymentMethod: "Full Payment", deliveryCharge: "Free", price: 130000, status: "on-deliver", productImage: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=200&q=80", productName: "Classic 3-Seater Sofa" },
  { id: "FI325801", orderDate: "20/05/2026 09:00:00", paymentMethod: "Installment",  deliveryCharge: "Free", price:  89000, status: "delivered",  productImage: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=200&q=80", productName: "Velvet Accent Sofa" },
  { id: "FI325901", orderDate: "10/04/2026 14:20:00", paymentMethod: "Full Payment", deliveryCharge: "Free", price:  53000, status: "pending",    productImage: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=200&q=80", productName: "Modular Wardrobe" },
  { id: "FI326001", orderDate: "05/03/2026 11:45:00", paymentMethod: "Full Payment", deliveryCharge: "LKR 500", price: 45000, status: "delivered", productImage: "https://images.unsplash.com/photo-1505691723518-36a0d6d7b5d7?w=200&q=80", productName: "Oak Coffee Table" },
  { id: "FI326101", orderDate: "12/02/2026 16:10:00", paymentMethod: "Installment", deliveryCharge: "Free", price: 76000, status: "on-deliver", productImage: "https://images.unsplash.com/photo-1505691723518-36a0d6d7b5d7?w=200&q=80", productName: "Scandinavian Dining Set" },
  { id: "FI326201", orderDate: "28/01/2026 09:30:00", paymentMethod: "Full Payment", deliveryCharge: "LKR 250", price: 22000, status: "cancelled", productImage: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=200&q=80", productName: "Rattan Side Chair" },
];

export const MOCK_WISHLIST: WishlistItem[] = [
  { id: 1, name: "Sectional Sofa",    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80" },
  { id: 2, name: "Velvet Red Sofa",   image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=300&q=80" },
  { id: 3, name: "Blue L-Shape Sofa", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=300&q=80" },
  { id: 4, name: "Classic 3-Seater",  image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&q=80" },
  { id: 5, name: "Oak Coffee Table",  image: "https://images.unsplash.com/photo-1505691723518-36a0d6d7b5d7?w=300&q=80" },
  { id: 6, name: "Scandi Dining Set", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80" },
  { id: 7, name: "Rattan Chair",      image: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=300&q=80" },
  { id: 8, name: "Minimal Shelf",     image: "https://images.unsplash.com/photo-1505691723518-36a0d6d7b5d7?w=300&q=80" },
];

export const MOCK_SERVICE_REQUESTS: ServiceRequest[] = [
  { id: "1", invoiceRef: "WRD24221100", date: "15.05.2023", status: "APPROVED" },
  { id: "2", invoiceRef: "WRD24221101", date: "20.06.2023", status: "PENDING"  },
];
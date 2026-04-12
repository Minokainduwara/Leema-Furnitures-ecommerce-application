import type {
    Product, User, Service, Order, KPI,
    TrafficSource, CategoryShare,
  } from "../../types";
  
  // ─── Constants ────────────────────────────────────────────────────────────────
  
  export const CATEGORIES: string[] = [
    "Sofa", "Bed", "Table", "Chair", "Cabinet", "Outdoor", "Office", "Lighting",
  ];
  
  export const MONTHS: string[] = [
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  ];
  
  export const REVENUE_DATA: number[] = [48, 62, 55, 71, 88, 94, 76, 83, 91, 105, 118, 132];
  export const ORDERS_DATA:  number[] = [22, 31, 28, 38, 45, 49, 41, 44, 48,  55,  61,  70];
  
  export const PRODUCT_EMOJIS: string[] = ["🛋️", "🛏️", "🪑", "📚", "🌿", "🖥️", "💡", "🪞", "🛁", "🪴"];
  export const SERVICE_ICONS:  string[] = ["🛡️", "🚚", "✨", "🔧", "🎧", "♻️", "📦", "🏠", "🔑", "💎"];
  
  export const SERVICE_TYPES = [
    "Warranty", "Delivery", "Protection", "Maintenance", "Support", "Trade-In",
  ] as const;
  
  // ─── Products ─────────────────────────────────────────────────────────────────
  
  export const INITIAL_PRODUCTS: Product[] = [
    { id: 1, name: "Oslo Sectional Sofa",   category: "Sofa",     price: 2499, stock: 12, status: "Active",       rating: 4.8, sales: 34, image: "🛋️", description: "Modular sectional sofa in premium linen upholstery." },
    { id: 2, name: "Aria King Bed Frame",   category: "Bed",      price: 1899, stock:  7, status: "Active",       rating: 4.6, sales: 28, image: "🛏️", description: "Solid walnut king bed with integrated storage." },
    { id: 3, name: "Walnut Dining Table",   category: "Table",    price: 1299, stock:  0, status: "Out of Stock", rating: 4.9, sales: 51, image: "🪑", description: "Handcrafted solid walnut dining table, seats 8." },
    { id: 4, name: "Linen Accent Chair",    category: "Chair",    price:  549, stock: 23, status: "Active",       rating: 4.5, sales: 67, image: "🪑", description: "Sculptural accent chair in natural linen blend." },
    { id: 5, name: "Modular Bookshelf",     category: "Cabinet",  price:  899, stock: 15, status: "Active",       rating: 4.7, sales: 43, image: "📚", description: "Reconfigurable bookshelf system in oiled oak." },
    { id: 6, name: "Teak Garden Set",       category: "Outdoor",  price: 1799, stock:  4, status: "Low Stock",   rating: 4.4, sales: 19, image: "🌿", description: "Weather-resistant teak outdoor dining set." },
    { id: 7, name: "Ergonomic Desk",        category: "Office",   price:  679, stock: 31, status: "Active",       rating: 4.6, sales: 88, image: "🖥️", description: "Height-adjustable standing desk with cable management." },
    { id: 8, name: "Pendant Light Cluster", category: "Lighting", price:  349, stock:  2, status: "Low Stock",   rating: 4.3, sales: 22, image: "💡", description: "Brass pendant cluster with Edison bulbs, set of 5." },
  ];
  
  // ─── Users ────────────────────────────────────────────────────────────────────
  
  export const INITIAL_USERS: User[] = [
    { id: 1, name: "Amara Perera",       email: "amara@email.com",   phone: "+94 77 123 4567", role: "Customer", status: "Active",   orders:  8, spent: 12450, joined: "Jan 2024", avatar: "AP" },
    { id: 2, name: "Kasun Silva",        email: "kasun@email.com",   phone: "+94 71 987 6543", role: "Customer", status: "Active",   orders:  3, spent:  4200, joined: "Mar 2024", avatar: "KS" },
    { id: 3, name: "Nirosha Fernando",   email: "nirosha@email.com", phone: "+94 76 555 0123", role: "VIP",      status: "Active",   orders: 15, spent: 28900, joined: "Nov 2023", avatar: "NF" },
    { id: 4, name: "Dilshan Jayasena",   email: "dilshan@email.com", phone: "+94 70 444 8899", role: "Customer", status: "Inactive", orders:  1, spent:   549, joined: "Jun 2024", avatar: "DJ" },
    { id: 5, name: "Sachini Weerasinghe",email: "sachini@email.com", phone: "+94 78 222 3344", role: "VIP",      status: "Active",   orders: 22, spent: 41200, joined: "Aug 2023", avatar: "SW" },
  ];
  
  // ─── Services ─────────────────────────────────────────────────────────────────
  
  export const INITIAL_SERVICES: Service[] = [
    { id: 1, name: "5-Year Structural Warranty", icon: "🛡️", type: "Warranty",    price: 199, active: true,  description: "Full structural coverage on all solid wood and metal frames.", subscribers:  342 },
    { id: 2, name: "White Glove Delivery",        icon: "🚚", type: "Delivery",    price:  89, active: true,  description: "In-home delivery, unpacking, assembly, and debris removal.",  subscribers:  518 },
    { id: 3, name: "Fabric Protection Plan",      icon: "✨", type: "Protection",  price: 149, active: true,  description: "Professional stain and damage treatment for upholstered pieces.", subscribers: 215 },
    { id: 4, name: "Annual Maintenance Check",    icon: "🔧", type: "Maintenance", price:  79, active: false, description: "Yearly professional inspection and tightening of all fittings.", subscribers:   88 },
    { id: 5, name: "24/7 Customer Support",       icon: "🎧", type: "Support",     price:   0, active: true,  description: "Priority support line with dedicated furniture advisors.",       subscribers: 1204 },
    { id: 6, name: "Trade-In & Refresh",          icon: "♻️", type: "Trade-In",   price:   0, active: true,  description: "Trade in old furniture for credit towards new purchases.",       subscribers:  167 },
  ];
  
  // ─── Recent Orders ────────────────────────────────────────────────────────────
  
  export const RECENT_ORDERS: Order[] = [
    { id: "#ORD-8821", customer: "Sachini W.", product: "Oslo Sectional Sofa",    amount: 2499, status: "Delivered"  },
    { id: "#ORD-8820", customer: "Amara P.",   product: "Ergonomic Desk",          amount:  679, status: "In Transit" },
    { id: "#ORD-8819", customer: "Nirosha F.", product: "Aria King Bed Frame",     amount: 1899, status: "Processing" },
    { id: "#ORD-8818", customer: "Kasun S.",   product: "Linen Accent Chair",      amount:  549, status: "Delivered"  },
    { id: "#ORD-8817", customer: "Dilshan J.", product: "Pendant Light Cluster",   amount:  349, status: "Cancelled"  },
  ];
  
  // ─── Analytics ────────────────────────────────────────────────────────────────
  
  export const ANALYTICS_KPI: KPI[] = [
    { label: "Conversion Rate",  value: "3.8%",   change: "+0.6%", up: true  },
    { label: "Avg. Order Value", value: "$1,240", change: "+$88",  up: true  },
    { label: "Return Rate",      value: "2.1%",   change: "-0.3%", up: true  },
    { label: "Cart Abandonment", value: "61.4%",  change: "-4.2%", up: true  },
  ];
  
  export const TRAFFIC_SOURCES: TrafficSource[] = [
    { source: "Organic Search", visits: 12440, pct: 42 },
    { source: "Direct",         visits:  7820, pct: 26 },
    { source: "Social Media",   visits:  4910, pct: 17 },
    { source: "Referrals",      visits:  2650, pct:  9 },
    { source: "Email",          visits:  1780, pct:  6 },
  ];
  
  export const CATEGORY_BREAKDOWN: CategoryShare[] = [
    { name: "Sofas & Seating", pct: 34, color: "bg-amber-400" },
    { name: "Beds & Bedroom",  pct: 26, color: "bg-stone-700" },
    { name: "Tables & Dining", pct: 19, color: "bg-amber-200" },
    { name: "Office",          pct: 12, color: "bg-stone-300" },
    { name: "Others",          pct:  9, color: "bg-stone-100" },
  ];
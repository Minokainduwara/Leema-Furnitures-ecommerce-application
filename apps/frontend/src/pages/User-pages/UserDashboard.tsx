// import React, { useState } from "react";
// import { authFetch } from "../../utils/api";

// import {
//   LayoutDashboard,
//   User,
//   ShoppingCart,
//   Heart,
//   Wrench,
//   PackageSearch,
//   Tags,
//   Bell,
//   MessageCircle,
//   LogOut,
// } from "lucide-react";
// import { useNavigate } from "react-router";

// type Panel =
//   | "overview"
//   | "profile"
//   | "orders"
//   | "wishlist"
//   | "services"
//   | "products"
//   | "categories"
//   | "messages"
//   | "notifications";

// type ServiceRequest = {
//   id: number;
//   referenceNumber?: string;
//   status: string;
// };

// type Order = {
//   id: number;
//   orderNumber?: string;
//   status: string;
//   totalAmount?: number;
//   price?: number;
// };

// type WishlistItem = {
//   id: number;
//   productName?: string;
// };

// export default function UserDashboard() {
//   const [panel, setPanel] = useState<Panel>("overview");
//   const navigate=useNavigate();
//   function Overview() {
//     const [stats, setStats] = React.useState([
//       { label: "Total Orders", value: 0 },
//       { label: "Pending Orders", value: 0 },
//       { label: "Wishlist Items", value: 0 },
//       { label: "Services", value: 0 },
//     ]);

//     const [orders, setOrders] = React.useState<Order[]>([]);
//     const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
//     const [services, setServices] = React.useState<ServiceRequest[]>([]);

//     React.useEffect(() => {
//       loadData();
//     }, []);

//     const authFetch = async (url) => {
//       const token = localStorage.getItem("token");

//       return fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     };

//     const loadData = async () => {
//       try {
//         // 🔹 Dashboard stats
//         const statsRes = await authFetch(
//           "http://localhost:8080/api/dashboard/overview",
//         );
//         const statsData = await statsRes.json();

//         setStats([
//           { label: "Total Orders", value: statsData.totalOrders || 0 },
//           { label: "Pending Orders", value: statsData.pendingOrders || 0 },
//           { label: "Wishlist Items", value: statsData.wishlistCount || 0 },
//           { label: "Services", value: statsData.serviceCount || 0 },
//         ]);

//         // 🔹 Recent Orders
//         const orderRes = await authFetch(
//           "http://localhost:8080/api/orders/recent",
//         );
//         const orderData = await orderRes.json();
//         setOrders(orderData || []);

//         // 🔹 Wishlist
//         const wishRes = await authFetch("http://localhost:8080/api/wishlist");
//         const wishData = await wishRes.json();
//         setWishlist(wishData || []);

//         // 🔹 Services
//         const serviceRes = await authFetch(
//           "http://localhost:8080/api/service-requests",
//         );
//         const serviceData: ServiceRequest[] = await serviceRes.json();
//         setServices(serviceData);
//       } catch (err) {
//         console.error("Dashboard load error:", err);
//       }
//     };

//     return (
//       <div className="space-y-6">
//         {/* ================= STATS ================= */}
//         <div className="grid grid-cols-4 gap-4">
//           {stats.map((s, i) => (
//             <div key={i} className="bg-white rounded-xl shadow p-5 border">
//               <p className="text-gray-500 text-sm">{s.label}</p>
//               <p className="text-2xl font-bold">{s.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* ================= RECENT ORDERS ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-4">Recent Orders</h2>

//           <div className="space-y-3">
//             {orders.length === 0 && <p>No recent orders</p>}

//             {orders.map((o) => (
//               <div key={o.id} className="flex justify-between border-b pb-2">
//                 <span>Order #{o.orderNumber || o.id}</span>
//                 <span className="text-gray-500">{o.status}</span>
//                 <span className="font-bold">
//                   LKR {o.totalAmount || o.price}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ================= WISHLIST ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-3">Wishlist Preview</h2>

//           <div className="flex gap-3 flex-wrap">
//             {wishlist.length === 0 && <p>No wishlist items</p>}

//             {wishlist.map((item) => (
//               <span
//                 key={item.id}
//                 className="px-3 py-1 bg-gray-100 rounded-full text-sm"
//               >
//                 {item.productName || "Item"}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* ================= SERVICES ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-4">Service Requests</h2>

//           {services.length === 0 && <p>No service requests</p>}

//           {services.map((s) => (
//             <div key={s.id} className="flex justify-between py-2 border-b">
//               <span>Request #{s.referenceNumber || s.id}</span>
//               <span className="text-yellow-600">{s.status}</span>
//             </div>
//           ))}
//         </div>

//         {/* ================= QUICK ACTIONS ================= */}
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => navigate("/user/category")}
//             className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/30"
//           >
//             🛍️ Browse Products
//           </button>
//           <button
//             onClick={() => navigate("/addtocart")}
//             className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-lg"
//           >
//             View Cart
//           </button>
//           <button
//             onClick={() => setPanel("orders")}
//             className="bg-stone-200 hover:bg-stone-300 px-5 py-2.5 rounded-lg"
//           >
//             My Orders
//           </button>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-72 bg-gray-900 text-white flex flex-col">
//         {/* BRAND */}
//         <div className="p-6 text-xl font-bold border-b border-gray-800">
//           MyStore
//         </div>

//         <nav className="flex-1 overflow-y-auto p-3 space-y-6">
//           {/* ACCOUNT SECTION */}
//           <Section title="ACCOUNT">
//             <Item
//               icon={<LayoutDashboard size={18} />}
//               label="Overview"
//               active={panel === "overview"}
//               onClick={() => setPanel("overview")}
//             />
//             <Item
//               icon={<User size={18} />}
//               label="Profile"
//               active={panel === "profile"}
//               onClick={() => setPanel("profile")}
//             />
//             <Item
//               icon={<ShoppingCart size={18} />}
//               label="Orders"
//               active={panel === "orders"}
//               onClick={() => setPanel("orders")}
//             />
//             <Item
//               icon={<Heart size={18} />}
//               label="Wishlist"
//               active={panel === "wishlist"}
//               onClick={() => setPanel("wishlist")}
//             />
//             <Item
//               icon={<Wrench size={18} />}
//               label="Services"
//               active={panel === "services"}
//               onClick={() => setPanel("services")}
//             />
//           </Section>

//           {/* SHOP SECTION */}
//           <Section title="SHOP">
//             <Item
//               icon={<PackageSearch size={18} />}
//               label="Browse Products"
//               active={false}
//               onClick={() => navigate("/user/category")}
//             />
//             <Item
//               icon={<Tags size={18} />}
//               label="Cart"
//               active={false}
//               onClick={() => navigate("/addtocart")}
//             />
//           </Section>

//           {/* SUPPORT */}
//           <Section title="SUPPORT">
//             <Item
//               icon={<MessageCircle size={18} />}
//               label="Messages"
//               active={panel === "messages"}
//               onClick={() => setPanel("messages")}
//             />
//             <Item
//               icon={<Bell size={18} />}
//               label="Notifications"
//               active={panel === "notifications"}
//               onClick={() => setPanel("notifications")}
//             />
//           </Section>
//         </nav>

//         {/* LOGOUT */}
//         <div className="p-4 border-t border-gray-800">
//           <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-red-500 transition">
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold capitalize text-gray-800">
//             {panel}
//           </h1>
//           <p className="text-gray-500">
//             Manage your account and shopping experience
//           </p>
//         </div>

//         {/* CONTENT AREA */}
//         <div className="bg-gray-50 rounded-xl shadow p-6 border text-gray-700">
//           {panel === "overview" && <Overview />}
//           {panel === "profile" && <p>User profile settings</p>}
//           {panel === "orders" && <p>Order history list</p>}
//           {panel === "wishlist" && <p>Saved products</p>}
//           {panel === "services" && <p>Service requests</p>}

//           {panel === "products" && (
//             <div>
//               <h2 className="text-lg font-semibold mb-3">Browse Products</h2>
//               <p>Product grid + search + filters will be here</p>
//             </div>
//           )}

//           {panel === "categories" && (
//             <div>
//               <h2 className="text-lg font-semibold mb-3">Categories</h2>
//               <p>Filter products by category (Sofas, Chairs, etc.)</p>
//             </div>
//           )}

//           {panel === "messages" && <p>Chat with support/seller</p>}
//           {panel === "notifications" && <p>System notifications</p>}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ================= SIDEBAR COMPONENTS ================= */

// function Section({ title, children }: any) {
//   return (
//     <div>
//       <p className="text-xs text-gray-400 px-4 mb-2 tracking-wider">{title}</p>
//       <div className="space-y-1">{children}</div>
//     </div>
//   );
// }

// function Item({ icon, label, active, onClick }: any) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition
//       ${
//         active
//           ? "bg-yellow-500 text-black"
//           : "hover:bg-yellow-500 hover:text-black"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }




                                              // updated code:


// import React, { useState } from "react";
// import { authFetch } from "../../utils/api";

// import {
//   LayoutDashboard,
//   User,
//   ShoppingCart,
//   Heart,
//   Wrench,
//   PackageSearch,
//   Tags,
//   Bell,
//   MessageCircle,
//   LogOut,
//   Plus,
//   Trash2,
//   Edit3,
//   MapPin,
//   Lock,
// } from "lucide-react";
// import { useNavigate } from "react-router";

// type Panel =
//   | "overview"
//   | "profile"
//   | "orders"
//   | "wishlist"
//   | "services"
//   | "products"
//   | "categories"
//   | "messages"
//   | "notifications";

// type ServiceRequest = {
//   id: number;
//   referenceNumber?: string;
//   status: string;
// };

// type Order = {
//   id: number;
//   orderNumber?: string;
//   status: string;
//   totalAmount?: number;
//   price?: number;
// };

// type WishlistItem = {
//   id: number;
//   productName?: string;
// };

// type AddressResponse = {
//   id: number;
//   fullName: string;
//   phoneNumber: string;
//   email?: string;
//   streetAddress: string;
//   apartmentSuite?: string;
//   city: string;
//   stateProvince?: string;
//   postalCode: string;
//   country: string;
//   isDefault: boolean;
// };

// export default function UserDashboard() {
//   const [panel, setPanel] = useState<Panel>("overview");
//   const navigate = useNavigate();

//   function Overview() {
//     const [stats, setStats] = React.useState([
//       { label: "Total Orders", value: 0 },
//       { label: "Pending Orders", value: 0 },
//       { label: "Wishlist Items", value: 0 },
//       { label: "Services", value: 0 },
//     ]);

//     const [orders, setOrders] = React.useState<Order[]>([]);
//     const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
//     const [services, setServices] = React.useState<ServiceRequest[]>([]);

//     React.useEffect(() => {
//       loadData();
//     }, []);

//     const authFetch = async (url) => {
//       const token = localStorage.getItem("token");

//       return fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     };

//     const loadData = async () => {
//       try {
//         // 🔹 Dashboard stats
//         const statsRes = await authFetch(
//           "http://localhost:8080/api/dashboard/overview",
//         );
//         const statsData = await statsRes.json();

//         setStats([
//           { label: "Total Orders", value: statsData.totalOrders || 0 },
//           { label: "Pending Orders", value: statsData.pendingOrders || 0 },
//           { label: "Wishlist Items", value: statsData.wishlistCount || 0 },
//           { label: "Services", value: statsData.serviceCount || 0 },
//         ]);

//         // 🔹 Recent Orders
//         const orderRes = await authFetch(
//           "http://localhost:8080/api/orders/recent",
//         );
//         const orderData = await orderRes.json();
//         setOrders(orderData || []);

//         // 🔹 Wishlist
//         const wishRes = await authFetch("http://localhost:8080/api/wishlist");
//         const wishData = await wishRes.json();
//         setWishlist(wishData || []);

//         // 🔹 Services
//         const serviceRes = await authFetch(
//           "http://localhost:8080/api/service-requests",
//         );
//         const serviceData: ServiceRequest[] = await serviceRes.json();
//         setServices(serviceData);
//       } catch (err) {
//         console.error("Dashboard load error:", err);
//       }
//     };

//     return (
//       <div className="space-y-6">
//         {/* ================= STATS ================= */}
//         <div className="grid grid-cols-4 gap-4">
//           {stats.map((s, i) => (
//             <div key={i} className="bg-white rounded-xl shadow p-5 border">
//               <p className="text-gray-500 text-sm">{s.label}</p>
//               <p className="text-2xl font-bold">{s.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* ================= RECENT ORDERS ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-4">Recent Orders</h2>

//           <div className="space-y-3">
//             {orders.length === 0 && <p>No recent orders</p>}

//             {orders.map((o) => (
//               <div key={o.id} className="flex justify-between border-b pb-2">
//                 <span>Order #{o.orderNumber || o.id}</span>
//                 <span className="text-gray-500">{o.status}</span>
//                 <span className="font-bold">
//                   LKR {o.totalAmount || o.price}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ================= WISHLIST ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-3">Wishlist Preview</h2>

//           <div className="flex gap-3 flex-wrap">
//             {wishlist.length === 0 && <p>No wishlist items</p>}

//             {wishlist.map((item) => (
//               <span
//                 key={item.id}
//                 className="px-3 py-1 bg-gray-100 rounded-full text-sm"
//               >
//                 {item.productName || "Item"}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* ================= SERVICES ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-4">Service Requests</h2>

//           {services.length === 0 && <p>No service requests</p>}

//           {services.map((s) => (
//             <div key={s.id} className="flex justify-between py-2 border-b">
//               <span>Request #{s.referenceNumber || s.id}</span>
//               <span className="text-yellow-600">{s.status}</span>
//             </div>
//           ))}
//         </div>

//         {/* ================= QUICK ACTIONS ================= */}
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => navigate("/user/category")}
//             className="bg-amber-50 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/30"
//           >
//             🛍️ Browse Products
//           </button>
//           <button
//             onClick={() => navigate("/addtocart")}
//             className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-lg"
//           >
//             View Cart
//           </button>
//           <button
//             onClick={() => setPanel("orders")}
//             className="bg-stone-200 hover:bg-stone-300 px-5 py-2.5 rounded-lg"
//           >
//             My Orders
//           </button>
//         </div>
//       </div>
//     );
//   }

//   function Profile() {
//     const [profile, setProfile] = useState({
//       id: null,
//       name: "",
//       email: "",
//       phoneNumber: "",
//       role: "",
//     });
//     const [isEditing, setIsEditing] = useState(false);
//     const [profileForm, setProfileForm] = useState({ name: "", email: "", phoneNumber: "" });
//     const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

//     const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
//     const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

//     const [shippingAddresses, setShippingAddresses] = useState<AddressResponse[]>([]);
//     const [billingAddresses, setBillingAddresses] = useState<AddressResponse[]>([]);
//     const [addressTab, setAddressTab] = useState<"shipping" | "billing">("shipping");

//     // Address form state
//     const [showAddressForm, setShowAddressForm] = useState(false);
//     const [editingAddress, setEditingAddress] = useState<any>(null); // null if adding
//     const [addressFormFields, setAddressFormFields] = useState({
//       fullName: "",
//       phoneNumber: "",
//       email: "",
//       streetAddress: "",
//       apartmentSuite: "",
//       city: "",
//       stateProvince: "",
//       postalCode: "",
//       country: "",
//       isDefault: false,
//     });
//     const [addressMsg, setAddressMsg] = useState({ text: "", type: "" });

//     const makeAuthRequest = async (url: string, method = "GET", body: any = null) => {
//       const token = localStorage.getItem("token");
//       const headers: Record<string, string> = {
//         "Content-Type": "application/json",
//       };
//       if (token) {
//         headers["Authorization"] = `Bearer ${token}`;
//       }
//       const config: RequestInit = { method, headers };
//       if (body) {
//         config.body = JSON.stringify(body);
//       }
//       return fetch(url, config);
//     };

//     const loadProfile = async () => {
//       try {
//         const res = await makeAuthRequest("http://localhost:8080/api/users/me");
//         if (res.ok) {
//           const data = await res.json();
//           setProfile(data);
//           setProfileForm({
//             name: data.name || "",
//             email: data.email || "",
//             phoneNumber: data.phoneNumber || "",
//           });
//         }
//       } catch (err) {
//         console.error("Failed to load profile:", err);
//       }
//     };

//     const loadAddresses = async () => {
//       try {
//         const shipRes = await makeAuthRequest("http://localhost:8080/api/addresses/shipping");
//         if (shipRes.ok) {
//           const data = await shipRes.json();
//           setShippingAddresses(data);
//         }
//         const billRes = await makeAuthRequest("http://localhost:8080/api/addresses/billing");
//         if (billRes.ok) {
//           const data = await billRes.json();
//           setBillingAddresses(data);
//         }
//       } catch (err) {
//         console.error("Failed to load addresses:", err);
//       }
//     };

//     React.useEffect(() => {
//       loadProfile();
//       loadAddresses();
//     }, []);

//     const handleUpdateProfile = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setProfileMsg({ text: "", type: "" });
//       try {
//         const res = await makeAuthRequest(
//           "http://localhost:8080/api/users/me",
//           "PUT",
//           profileForm
//         );
//         const data = await res.json();
//         if (res.ok) {
//           setProfile(data);
//           setIsEditing(false);
//           setProfileMsg({ text: "Profile updated successfully!", type: "success" });
//         } else {
//           setProfileMsg({ text: data.message || "Failed to update profile", type: "error" });
//         }
//       } catch (err) {
//         setProfileMsg({ text: "Network error occurred", type: "error" });
//       }
//     };

//     const handleUpdatePassword = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setPasswordMsg({ text: "", type: "" });
//       if (passwordForm.newPassword.length < 6) {
//         setPasswordMsg({ text: "New password must be at least 6 characters", type: "error" });
//         return;
//       }
//       try {
//         const res = await makeAuthRequest(
//           "http://localhost:8080/api/users/change-password",
//           "PUT",
//           passwordForm
//         );
//         if (res.ok) {
//           setPasswordForm({ currentPassword: "", newPassword: "" });
//           setPasswordMsg({ text: "Password changed successfully!", type: "success" });
//         } else {
//           const data = await res.json().catch(() => ({ message: "Incorrect password" }));
//           setPasswordMsg({ text: data.message || "Failed to change password", type: "error" });
//         }
//       } catch (err) {
//         setPasswordMsg({ text: "Network error occurred", type: "error" });
//       }
//     };

//     const handleAddressSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setAddressMsg({ text: "", type: "" });
//       const url = editingAddress
//         ? `http://localhost:8080/api/addresses/${addressTab}/${editingAddress.id}`
//         : `http://localhost:8080/api/addresses/${addressTab}`;
//       const method = editingAddress ? "PUT" : "POST";

//       try {
//         const res = await makeAuthRequest(url, method, addressFormFields);
//         if (res.ok) {
//           await loadAddresses();
//           setShowAddressForm(false);
//           setEditingAddress(null);
//           setAddressMsg({ text: "Address saved successfully!", type: "success" });
//         } else {
//           const data = await res.json();
//           setAddressMsg({ text: data.message || "Failed to save address", type: "error" });
//         }
//       } catch (err) {
//         setAddressMsg({ text: "Network error occurred", type: "error" });
//       }
//     };

//     const handleSetDefaultAddress = async (addr: any) => {
//       try {
//         const updated = { ...addr, isDefault: true };
//         const res = await makeAuthRequest(
//           `http://localhost:8080/api/addresses/${addressTab}/${addr.id}`,
//           "PUT",
//           updated
//         );
//         if (res.ok) {
//           await loadAddresses();
//         }
//       } catch (err) {
//         console.error("Failed to set default address:", err);
//       }
//     };

//     const handleDeleteAddress = async (id: number) => {
//       if (!confirm("Are you sure you want to delete this address?")) return;
//       try {
//         const res = await makeAuthRequest(
//           `http://localhost:8080/api/addresses/${addressTab}/${id}`,
//           "DELETE"
//         );
//         if (res.ok) {
//           await loadAddresses();
//         }
//       } catch (err) {
//         console.error("Failed to delete address:", err);
//       }
//     };

//     const startAddAddress = () => {
//       setEditingAddress(null);
//       setAddressFormFields({
//         fullName: "",
//         phoneNumber: "",
//         email: "",
//         streetAddress: "",
//         apartmentSuite: "",
//         city: "",
//         stateProvince: "",
//         postalCode: "",
//         country: "",
//         isDefault: false,
//       });
//       setShowAddressForm(true);
//     };

//     const startEditAddress = (addr: any) => {
//       setEditingAddress(addr);
//       setAddressFormFields({
//         fullName: addr.fullName || "",
//         phoneNumber: addr.phoneNumber || "",
//         email: addr.email || "",
//         streetAddress: addr.streetAddress || "",
//         apartmentSuite: addr.apartmentSuite || "",
//         city: addr.city || "",
//         stateProvince: addr.stateProvince || "",
//         postalCode: addr.postalCode || "",
//         country: addr.country || "",
//         isDefault: addr.isDefault || false,
//       });
//       setShowAddressForm(true);
//     };

//     const addresses = addressTab === "shipping" ? shippingAddresses : billingAddresses;

//     return (
//       <div className="space-y-8">
//         {/* PROFILE INFO & SECURITY GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* USER INFO CARD */}
//           <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
//             <div className="flex justify-between items-center pb-4 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
//                   <User size={22} />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg text-gray-800">Personal Profile</h3>
//                   <p className="text-sm text-gray-400">Manage your credentials</p>
//                 </div>
//               </div>
//               {!isEditing && (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-4 py-1.5 rounded-lg text-sm transition"
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </div>

//             {profileMsg.text && (
//               <div
//                 className={`p-3.5 rounded-lg text-sm ${
//                   profileMsg.type === "success"
//                     ? "bg-green-50 text-green-700 border border-green-200"
//                     : "bg-red-50 text-red-700 border border-red-200"
//                 }`}
//               >
//                 {profileMsg.text}
//               </div>
//             )}

//             {!isEditing ? (
//               <div className="space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
//                   <span className="text-gray-400 text-sm">Full Name</span>
//                   <span className="font-medium text-gray-800">{profile.name}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
//                   <span className="text-gray-400 text-sm">Email Address</span>
//                   <span className="font-medium text-gray-800">{profile.email}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
//                   <span className="text-gray-400 text-sm">Phone Number</span>
//                   <span className="font-medium text-gray-800">{profile.phoneNumber || "Not provided"}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
//                   <span className="text-gray-400 text-sm">Account Role</span>
//                   <span className="inline-flex px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full uppercase">
//                     {profile.role}
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleUpdateProfile} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={profileForm.name}
//                     onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
//                   <input
//                     type="email"
//                     required
//                     value={profileForm.email}
//                     onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
//                   <input
//                     type="text"
//                     value={profileForm.phoneNumber}
//                     onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <button
//                     type="submit"
//                     className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition text-sm"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditing(false);
//                       setProfileForm({
//                         name: profile.name,
//                         email: profile.email,
//                         phoneNumber: profile.phoneNumber || "",
//                       });
//                     }}
//                     className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg transition text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* CHANGE PASSWORD CARD */}
//           <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
//             <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
//               <div className="bg-stone-100 text-stone-800 p-2.5 rounded-lg">
//                 <Lock size={22} />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-800">Security Setting</h3>
//                 <p className="text-sm text-gray-400">Change your password</p>
//               </div>
//             </div>

//             {passwordMsg.text && (
//               <div
//                 className={`p-3.5 rounded-lg text-sm ${
//                   passwordMsg.type === "success"
//                     ? "bg-green-50 text-green-700 border border-green-200"
//                     : "bg-red-50 text-red-700 border border-red-200"
//                 }`}
//               >
//                 {passwordMsg.text}
//               </div>
//             )}

//             <form onSubmit={handleUpdatePassword} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
//                 <input
//                   type="password"
//                   required
//                   value={passwordForm.currentPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
//                 <input
//                   type="password"
//                   required
//                   value={passwordForm.newPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>
//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2 rounded-lg transition text-sm"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* ADDRESS BOOK SECTION */}
//         <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-4">
//             <div className="flex items-center gap-3">
//               <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
//                 <MapPin size={22} />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-800">My Address Book</h3>
//                 <p className="text-sm text-gray-400">Manage billing and delivery destinations</p>
//               </div>
//             </div>
//             {!showAddressForm && (
//               <button
//                 onClick={startAddAddress}
//                 className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add New Address
//               </button>
//             )}
//           </div>

//           {addressMsg.text && (
//             <div
//               className={`p-3.5 rounded-lg text-sm ${
//                 addressMsg.type === "success"
//                   ? "bg-green-50 text-green-700 border border-green-200"
//                   : "bg-red-50 text-red-700 border border-red-200"
//               }`}
//             >
//               {addressMsg.text}
//             </div>
//           )}

//           {/* TAB TOGGLE */}
//           <div className="flex gap-2 p-1 bg-gray-50 rounded-xl w-fit">
//             <button
//               onClick={() => {
//                 setAddressTab("shipping");
//                 setShowAddressForm(false);
//               }}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                 addressTab === "shipping"
//                   ? "bg-white text-stone-900 shadow"
//                   : "text-gray-500 hover:text-stone-900"
//               }`}
//             >
//               Shipping Address
//             </button>
//             <button
//               onClick={() => {
//                 setAddressTab("billing");
//                 setShowAddressForm(false);
//               }}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                 addressTab === "billing"
//                   ? "bg-white text-stone-900 shadow"
//                   : "text-gray-500 hover:text-stone-900"
//               }`}
//             >
//               Billing Address
//             </button>
//           </div>

//           {/* ADDRESS FORM OR LIST */}
//           {showAddressForm ? (
//             <form onSubmit={handleAddressSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-150 space-y-6">
//               <h4 className="font-semibold text-gray-800 text-base">
//                 {editingAddress ? "Edit Address Details" : "Add New Address"}
//               </h4>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.fullName}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, fullName: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.phoneNumber}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, phoneNumber: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Email Address (Optional)</label>
//                   <input
//                     type="email"
//                     value={addressFormFields.email}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, email: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Street Address</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.streetAddress}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, streetAddress: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Apartment, Suite, Unit, etc. (Optional)</label>
//                   <input
//                     type="text"
//                     value={addressFormFields.apartmentSuite}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, apartmentSuite: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.city}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, city: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">State / Province</label>
//                   <input
//                     type="text"
//                     value={addressFormFields.stateProvince}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, stateProvince: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Postal / ZIP Code</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.postalCode}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, postalCode: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.country}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, country: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div className="flex items-center pt-6">
//                   <label className="flex items-center gap-2 cursor-pointer select-none">
//                     <input
//                       type="checkbox"
//                       checked={addressFormFields.isDefault}
//                       onChange={(e) => setAddressFormFields({ ...addressFormFields, isDefault: e.target.checked })}
//                       className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 h-4.5 w-4.5"
//                     />
//                     <span className="text-sm font-medium text-gray-600">Set as Default Address</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   type="submit"
//                   className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition text-sm"
//                 >
//                   Save Address
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddressForm(false)}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg transition text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {addresses.length === 0 ? (
//                 <div className="col-span-full py-8 text-center text-gray-400">
//                   No addresses found. Add one to get started!
//                 </div>
//               ) : (
//                 addresses.map((addr) => (
//                   <div
//                     key={addr.id}
//                     className={`p-5 rounded-xl border relative flex flex-col justify-between h-full bg-white transition duration-300 hover:shadow-md ${
//                       addr.isDefault
//                         ? "border-amber-500 ring-1 ring-amber-500 shadow-sm"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <div>
//                       <div className="flex justify-between items-start mb-3 gap-2">
//                         <h5 className="font-semibold text-gray-800">{addr.fullName}</h5>
//                         {addr.isDefault && (
//                           <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full">
//                             Default
//                           </span>
//                         )}
//                       </div>

//                       <div className="text-sm text-gray-500 space-y-1.5 mb-4">
//                         <p>{addr.streetAddress}{addr.apartmentSuite ? `, ${addr.apartmentSuite}` : ""}</p>
//                         <p>{addr.city}, {addr.stateProvince ? `${addr.stateProvince}, ` : ""}{addr.postalCode}</p>
//                         <p>{addr.country}</p>
//                         <p className="pt-1.5 border-t border-gray-50 text-[13px]">📞 {addr.phoneNumber}</p>
//                         {addr.email && <p className="text-[13px]">✉️ {addr.email}</p>}
//                       </div>
//                     </div>

//                     <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
//                       <div className="flex gap-3">
//                         <button
//                           onClick={() => startEditAddress(addr)}
//                           className="text-stone-600 hover:text-stone-900 font-semibold text-xs flex items-center gap-1 transition"
//                         >
//                           <Edit3 size={12} />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteAddress(addr.id)}
//                           className="text-red-500 hover:text-red-700 font-semibold text-xs flex items-center gap-1 transition"
//                         >
//                           <Trash2 size={12} />
//                           Delete
//                         </button>
//                       </div>
//                       {!addr.isDefault && (
//                         <button
//                           onClick={() => handleSetDefaultAddress(addr)}
//                           className="text-amber-600 hover:text-amber-700 font-semibold text-xs transition"
//                         >
//                           Set Default
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-72 bg-gray-900 text-white flex flex-col">
//         {/* BRAND */}
//         <div className="p-6 text-xl font-bold border-b border-gray-800">
//           MyStore
//         </div>

//         <nav className="flex-1 overflow-y-auto p-3 space-y-6">
//           {/* ACCOUNT SECTION */}
//           <Section title="ACCOUNT">
//             <Item
//               icon={<LayoutDashboard size={18} />}
//               label="Overview"
//               active={panel === "overview"}
//               onClick={() => setPanel("overview")}
//             />
//             <Item
//               icon={<User size={18} />}
//               label="Profile"
//               active={panel === "profile"}
//               onClick={() => setPanel("profile")}
//             />
//             <Item
//               icon={<ShoppingCart size={18} />}
//               label="Orders"
//               active={panel === "orders"}
//               onClick={() => setPanel("orders")}
//             />
//             <Item
//               icon={<Heart size={18} />}
//               label="Wishlist"
//               active={panel === "wishlist"}
//               onClick={() => setPanel("wishlist")}
//             />
//             <Item
//               icon={<Wrench size={18} />}
//               label="Services"
//               active={panel === "services"}
//               onClick={() => setPanel("services")}
//             />
//           </Section>

//           {/* SHOP SECTION */}
//           <Section title="SHOP">
//             <Item
//               icon={<PackageSearch size={18} />}
//               label="Browse Products"
//               active={false}
//               onClick={() => navigate("/user/category")}
//             />
//             <Item
//               icon={<Tags size={18} />}
//               label="Cart"
//               active={false}
//               onClick={() => navigate("/addtocart")}
//             />
//           </Section>

//           {/* SUPPORT */}
//           <Section title="SUPPORT">
//             <Item
//               icon={<MessageCircle size={18} />}
//               label="Messages"
//               active={panel === "messages"}
//               onClick={() => setPanel("messages")}
//             />
//             <Item
//               icon={<Bell size={18} />}
//               label="Notifications"
//               active={panel === "notifications"}
//               onClick={() => setPanel("notifications")}
//             />
//           </Section>
//         </nav>

//         {/* LOGOUT */}
//         <div className="p-4 border-t border-gray-800">
//           <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-red-500 transition">
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         {/* HEADER */}
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold capitalize text-gray-800">
//             {panel}
//           </h1>
//           <p className="text-gray-500">
//             Manage your account and shopping experience
//           </p>
//         </div>

//         {/* CONTENT AREA */}
//         <div className="bg-gray-50 rounded-xl shadow p-6 border text-gray-700">
//           {panel === "overview" && <Overview />}
//           {panel === "profile" && <Profile />}
//           {panel === "orders" && <p>Order history list</p>}
//           {panel === "wishlist" && <p>Saved products</p>}
//           {panel === "services" && <p>Service requests</p>}

//           {panel === "products" && (
//             <div>
//               <h2 className="text-lg font-semibold mb-3">Browse Products</h2>
//               <p>Product grid + search + filters will be here</p>
//             </div>
//           )}

//           {panel === "categories" && (
//             <div>
//               <h2 className="text-lg font-semibold mb-3">Categories</h2>
//               <p>Filter products by category (Sofas, Chairs, etc.)</p>
//             </div>
//           )}

//           {panel === "messages" && <p>Chat with support/seller</p>}
//           {panel === "notifications" && <p>System notifications</p>}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ================= SIDEBAR COMPONENTS ================= */

// function Section({ title, children }: any) {
//   return (
//     <div>
//       <p className="text-xs text-gray-400 px-4 mb-2 tracking-wider">{title}</p>
//       <div className="space-y-1">{children}</div>
//     </div>
//   );
// }

// function Item({ icon, label, active, onClick }: any) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition
//       ${
//         active
//           ? "bg-yellow-500 text-black"
//           : "hover:bg-yellow-500 hover:text-black"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }


                //================= MAIN DASHBOARD COMPONENT =================




// import React, { useState } from "react";
// import { authFetch } from "../../utils/api";

// import {
//   LayoutDashboard,
//   User,
//   ShoppingCart,
//   Heart,
//   Wrench,
//   PackageSearch,
//   Tags,
//   Bell,
//   MessageCircle,
//   LogOut,
//   Plus,
//   Trash2,
//   Edit3,
//   MapPin,
//   Lock,
// } from "lucide-react";
// import { useNavigate } from "react-router";

// type Panel =
//   | "overview"
//   | "profile"
//   | "orders"
//   | "wishlist"
//   | "services"
//   | "products"
//   | "categories"
//   | "messages"
//   | "notifications";

// type ServiceRequest = {
//   id: number;
//   referenceNumber?: string;
//   status: string;
// };

// type Order = {
//   id: number;
//   orderNumber?: string;
//   status: string;
//   totalAmount?: number;
//   price?: number;
// };

// type WishlistItem = {
//   id: number;
//   productName?: string;
// };

// type AddressResponse = {
//   id: number;
//   fullName: string;
//   phoneNumber: string;
//   email?: string;
//   streetAddress: string;
//   apartmentSuite?: string;
//   city: string;
//   stateProvince?: string;
//   postalCode: string;
//   country: string;
//   isDefault: boolean;
// };

// export default function UserDashboard() {
//   const [panel, setPanel] = useState<Panel>("overview");
//   const [userProfile, setUserProfile] = useState<any>(null);
//   const navigate = useNavigate();

//   // Helper to make API requests with automatic token sanitization (stripping outer quotes)
//   const makeAuthRequest = async (url: string, method = "GET", body: any = null) => {
//     let token = localStorage.getItem("token");
//     if (token) {
//       // 1. Strip double quotes if stored as a stringified string
//       if (token.startsWith('"') && token.endsWith('"')) {
//         token = token.slice(1, -1);
//       }
//       // 2. Parse if stored as a stringified object (e.g. {"token": "..."})
//       if (token.startsWith("{")) {
//         try {
//           const parsed = JSON.parse(token);
//           if (parsed.token) {
//             token = parsed.token;
//           } else if (parsed.accessToken) {
//             token = parsed.accessToken;
//           }
//         } catch (e) {
//           // ignore parsing error
//         }
//       }
//     }

//     const headers: Record<string, string> = {
//       "Content-Type": "application/json",
//     };
//     if (token) {
//       headers["Authorization"] = `Bearer ${token}`;
//     }
//     const config: RequestInit = { method, headers };
//     if (body) {
//       config.body = JSON.stringify(body);
//     }
//     return fetch(url, config);
//   };

//   const loadUserProfile = async () => {
//     try {
//       const res = await makeAuthRequest("http://localhost:8080/api/users/me");
//       if (res.ok) {
//         const data = await res.json();
//         setUserProfile(data);
//       }
//     } catch (err) {
//       console.error("Failed to load user profile at dashboard level:", err);
//     }
//   };

//   React.useEffect(() => {
//     loadUserProfile();
//   }, []);

//   function Overview() {
//     const [stats, setStats] = React.useState([
//       { label: "Total Orders", value: 0 },
//       { label: "Pending Orders", value: 0 },
//       { label: "Wishlist Items", value: 0 },
//       { label: "Services", value: 0 },
//     ]);

//     const [orders, setOrders] = React.useState<Order[]>([]);
//     const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
//     const [services, setServices] = React.useState<ServiceRequest[]>([]);

//     React.useEffect(() => {
//       loadData();
//     }, []);

//     const authFetch = async (url) => {
//       let token = localStorage.getItem("token");
//       if (token && token.startsWith('"') && token.endsWith('"')) {
//         token = token.slice(1, -1);
//       }
//       return fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     };

//     const loadData = async () => {
//       try {
//         // 🔹 Dashboard stats
//         const statsRes = await authFetch(
//           "http://localhost:8080/api/dashboard/overview",
//         );
//         const statsData = await statsRes.json();

//         setStats([
//           { label: "Total Orders", value: statsData.totalOrders || 0 },
//           { label: "Pending Orders", value: statsData.pendingOrders || 0 },
//           { label: "Wishlist Items", value: statsData.wishlistCount || 0 },
//           { label: "Services", value: statsData.serviceCount || 0 },
//         ]);

//         // 🔹 Recent Orders
//         const orderRes = await authFetch(
//           "http://localhost:8080/api/orders/recent",
//         );
//         const orderData = await orderRes.json();
//         setOrders(orderData || []);

//         // 🔹 Wishlist
//         const wishRes = await authFetch("http://localhost:8080/api/wishlist");
//         const wishData = await wishRes.json();
//         setWishlist(wishData || []);

//         // 🔹 Services
//         const serviceRes = await authFetch(
//           "http://localhost:8080/api/service-requests",
//         );
//         const serviceData: ServiceRequest[] = await serviceRes.json();
//         setServices(serviceData);
//       } catch (err) {
//         console.error("Dashboard load error:", err);
//       }
//     };

//     return (
//       <div className="space-y-6">
//         {/* ================= STATS ================= */}
//         <div className="grid grid-cols-4 gap-4">
//           {stats.map((s, i) => (
//             <div key={i} className="bg-white rounded-xl shadow p-5 border">
//               <p className="text-gray-500 text-sm">{s.label}</p>
//               <p className="text-2xl font-bold">{s.value}</p>
//             </div>
//           ))}
//         </div>

//         {/* ================= RECENT ORDERS ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-4">Recent Orders</h2>

//           <div className="space-y-3">
//             {orders.length === 0 && <p>No recent orders</p>}

//             {orders.map((o) => (
//               <div key={o.id} className="flex justify-between border-b pb-2">
//                 <span>Order #{o.orderNumber || o.id}</span>
//                 <span className="text-gray-500">{o.status}</span>
//                 <span className="font-bold">
//                   LKR {o.totalAmount || o.price}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* ================= WISHLIST ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-3">Wishlist Preview</h2>

//           <div className="flex gap-3 flex-wrap">
//             {wishlist.length === 0 && <p>No wishlist items</p>}

//             {wishlist.map((item) => (
//               <span
//                 key={item.id}
//                 className="px-3 py-1 bg-gray-100 rounded-full text-sm"
//               >
//                 {item.productName || "Item"}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* ================= SERVICES ================= */}
//         <div className="bg-white p-5 rounded-xl shadow border">
//           <h2 className="font-semibold mb-4">Service Requests</h2>

//           {services.length === 0 && <p>No service requests</p>}

//           {services.map((s) => (
//             <div key={s.id} className="flex justify-between py-2 border-b">
//               <span>Request #{s.referenceNumber || s.id}</span>
//               <span className="text-yellow-600">{s.status}</span>
//             </div>
//           ))}
//         </div>

//         {/* ================= QUICK ACTIONS ================= */}
//         <div className="flex flex-wrap gap-3">
//           <button
//             onClick={() => navigate("/user/category")}
//             className="bg-amber-50 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/30"
//           >
//             🛍️ Browse Products
//           </button>
//           <button
//             onClick={() => navigate("/addtocart")}
//             className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-lg"
//           >
//             View Cart
//           </button>
//           <button
//             onClick={() => setPanel("orders")}
//             className="bg-stone-200 hover:bg-stone-300 px-5 py-2.5 rounded-lg"
//           >
//             My Orders
//           </button>
//         </div>
//       </div>
//     );
//   }

//   function Profile() {
//     const [isEditing, setIsEditing] = useState(false);
//     const [profileForm, setProfileForm] = useState({
//       name: userProfile?.name || "",
//       email: userProfile?.email || "",
//       phoneNumber: userProfile?.phoneNumber || "",
//     });
//     const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

//     const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
//     const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

//     const [shippingAddresses, setShippingAddresses] = useState<AddressResponse[]>([]);
//     const [billingAddresses, setBillingAddresses] = useState<AddressResponse[]>([]);
//     const [addressTab, setAddressTab] = useState<"shipping" | "billing">("shipping");

//     // Address form state
//     const [showAddressForm, setShowAddressForm] = useState(false);
//     const [editingAddress, setEditingAddress] = useState<any>(null);
//     const [addressFormFields, setAddressFormFields] = useState({
//       fullName: "",
//       phoneNumber: "",
//       email: "",
//       streetAddress: "",
//       apartmentSuite: "",
//       city: "",
//       stateProvince: "",
//       postalCode: "",
//       country: "",
//       isDefault: false,
//     });
//     const [addressMsg, setAddressMsg] = useState({ text: "", type: "" });

//     React.useEffect(() => {
//       if (userProfile) {
//         setProfileForm({
//           name: userProfile.name || "",
//           email: userProfile.email || "",
//           phoneNumber: userProfile.phoneNumber || "",
//         });
//       }
//     }, [userProfile]);

//     const loadAddresses = async () => {
//       try {
//         const shipRes = await makeAuthRequest("http://localhost:8080/api/addresses/shipping");
//         if (shipRes.ok) {
//           const data = await shipRes.json();
//           setShippingAddresses(data);
//         }
//         const billRes = await makeAuthRequest("http://localhost:8080/api/addresses/billing");
//         if (billRes.ok) {
//           const data = await billRes.json();
//           setBillingAddresses(data);
//         }
//       } catch (err) {
//         console.error("Failed to load addresses:", err);
//       }
//     };

//     React.useEffect(() => {
//       loadAddresses();
//     }, []);

//     const handleUpdateProfile = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setProfileMsg({ text: "", type: "" });
//       try {
//         const res = await makeAuthRequest(
//           "http://localhost:8080/api/users/me",
//           "PUT",
//           profileForm
//         );
//         const data = await res.json();
//         if (res.ok) {
//           setUserProfile(data); // update top level state instantly!
//           setIsEditing(false);
//           setProfileMsg({ text: "Profile updated successfully!", type: "success" });
//         } else {
//           setProfileMsg({ text: data.message || "Failed to update profile", type: "error" });
//         }
//       } catch (err) {
//         setProfileMsg({ text: "Network error occurred", type: "error" });
//       }
//     };

//     const handleUpdatePassword = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setPasswordMsg({ text: "", type: "" });
//       if (passwordForm.newPassword.length < 6) {
//         setPasswordMsg({ text: "New password must be at least 6 characters", type: "error" });
//         return;
//       }
//       try {
//         const res = await makeAuthRequest(
//           "http://localhost:8080/api/users/change-password",
//           "PUT",
//           passwordForm
//         );
//         if (res.ok) {
//           setPasswordForm({ currentPassword: "", newPassword: "" });
//           setPasswordMsg({ text: "Password changed successfully!", type: "success" });
//         } else {
//           const data = await res.json().catch(() => ({ message: "Incorrect password" }));
//           setPasswordMsg({ text: data.message || "Failed to change password", type: "error" });
//         }
//       } catch (err) {
//         setPasswordMsg({ text: "Network error occurred", type: "error" });
//       }
//     };

//     const handleAddressSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();
//       setAddressMsg({ text: "", type: "" });
//       const url = editingAddress
//         ? `http://localhost:8080/api/addresses/${addressTab}/${editingAddress.id}`
//         : `http://localhost:8080/api/addresses/${addressTab}`;
//       const method = editingAddress ? "PUT" : "POST";

//       try {
//         const res = await makeAuthRequest(url, method, addressFormFields);
//         if (res.ok) {
//           await loadAddresses();
//           setShowAddressForm(false);
//           setEditingAddress(null);
//           setAddressMsg({ text: "Address saved successfully!", type: "success" });
//         } else {
//           const data = await res.json();
//           setAddressMsg({ text: data.message || "Failed to save address", type: "error" });
//         }
//       } catch (err) {
//         setAddressMsg({ text: "Network error occurred", type: "error" });
//       }
//     };

//     const handleSetDefaultAddress = async (addr: any) => {
//       try {
//         const updated = { ...addr, isDefault: true };
//         const res = await makeAuthRequest(
//           `http://localhost:8080/api/addresses/${addressTab}/${addr.id}`,
//           "PUT",
//           updated
//         );
//         if (res.ok) {
//           await loadAddresses();
//         }
//       } catch (err) {
//         console.error("Failed to set default address:", err);
//       }
//     };

//     const handleDeleteAddress = async (id: number) => {
//       if (!confirm("Are you sure you want to delete this address?")) return;
//       try {
//         const res = await makeAuthRequest(
//           `http://localhost:8080/api/addresses/${addressTab}/${id}`,
//           "DELETE"
//         );
//         if (res.ok) {
//           await loadAddresses();
//         }
//       } catch (err) {
//         console.error("Failed to delete address:", err);
//       }
//     };

//     const startAddAddress = () => {
//       setEditingAddress(null);
//       setAddressFormFields({
//         fullName: "",
//         phoneNumber: "",
//         email: "",
//         streetAddress: "",
//         apartmentSuite: "",
//         city: "",
//         stateProvince: "",
//         postalCode: "",
//         country: "",
//         isDefault: false,
//       });
//       setShowAddressForm(true);
//     };

//     const startEditAddress = (addr: any) => {
//       setEditingAddress(addr);
//       setAddressFormFields({
//         fullName: addr.fullName || "",
//         phoneNumber: addr.phoneNumber || "",
//         email: addr.email || "",
//         streetAddress: addr.streetAddress || "",
//         apartmentSuite: addr.apartmentSuite || "",
//         city: addr.city || "",
//         stateProvince: addr.stateProvince || "",
//         postalCode: addr.postalCode || "",
//         country: addr.country || "",
//         isDefault: addr.isDefault || false,
//       });
//       setShowAddressForm(true);
//     };

//     const addresses = addressTab === "shipping" ? shippingAddresses : billingAddresses;

//     return (
//       <div className="space-y-8">
//         {/* PROFILE INFO & SECURITY GRID */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* USER INFO CARD */}
//           <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
//             <div className="flex justify-between items-center pb-4 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
//                   <User size={22} />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg text-gray-800">Personal Profile</h3>
//                   <p className="text-sm text-gray-400">Manage your credentials</p>
//                 </div>
//               </div>
//               {!isEditing && userProfile && (
//                 <button
//                   onClick={() => setIsEditing(true)}
//                   className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-4 py-1.5 rounded-lg text-sm transition"
//                 >
//                   Edit Profile
//                 </button>
//               )}
//             </div>

//             {profileMsg.text && (
//               <div
//                 className={`p-3.5 rounded-lg text-sm ${
//                   profileMsg.type === "success"
//                     ? "bg-green-50 text-green-700 border border-green-200"
//                     : "bg-red-50 text-red-700 border border-red-200"
//                 }`}
//               >
//                 {profileMsg.text}
//               </div>
//             )}

//             {!userProfile ? (
//               <div className="py-6 text-center text-gray-400">Loading profile details...</div>
//             ) : !isEditing ? (
//               <div className="space-y-4">
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
//                   <span className="text-gray-400 text-sm">Full Name</span>
//                   <span className="font-medium text-gray-800">{userProfile.name}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
//                   <span className="text-gray-400 text-sm">Email Address</span>
//                   <span className="font-medium text-gray-800">{userProfile.email}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
//                   <span className="text-gray-400 text-sm">Phone Number</span>
//                   <span className="font-medium text-gray-800">{userProfile.phoneNumber || "Not provided"}</span>
//                 </div>
//                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
//                   <span className="text-gray-400 text-sm">Account Role</span>
//                   <span className="inline-flex px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full uppercase">
//                     {userProfile.role}
//                   </span>
//                 </div>
//               </div>
//             ) : (
//               <form onSubmit={handleUpdateProfile} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={profileForm.name}
//                     onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
//                   <input
//                     type="email"
//                     required
//                     value={profileForm.email}
//                     onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
//                   <input
//                     type="text"
//                     value={profileForm.phoneNumber}
//                     onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
//                     className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div className="flex gap-2 pt-2">
//                   <button
//                     type="submit"
//                     className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition text-sm"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setIsEditing(false);
//                       setProfileForm({
//                         name: userProfile.name,
//                         email: userProfile.email,
//                         phoneNumber: userProfile.phoneNumber || "",
//                       });
//                     }}
//                     className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg transition text-sm"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             )}
//           </div>

//           {/* CHANGE PASSWORD CARD */}
//           <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
//             <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
//               <div className="bg-stone-100 text-stone-800 p-2.5 rounded-lg">
//                 <Lock size={22} />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-800">Security Setting</h3>
//                 <p className="text-sm text-gray-400">Change your password</p>
//               </div>
//             </div>

//             {passwordMsg.text && (
//               <div
//                 className={`p-3.5 rounded-lg text-sm ${
//                   passwordMsg.type === "success"
//                     ? "bg-green-50 text-green-700 border border-green-200"
//                     : "bg-red-50 text-red-700 border border-red-200"
//                 }`}
//               >
//                 {passwordMsg.text}
//               </div>
//             )}

//             <form onSubmit={handleUpdatePassword} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
//                 <input
//                   type="password"
//                   required
//                   value={passwordForm.currentPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
//                 <input
//                   type="password"
//                   required
//                   value={passwordForm.newPassword}
//                   onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
//                   className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                 />
//               </div>
//               <div className="pt-2">
//                 <button
//                   type="submit"
//                   className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2 rounded-lg transition text-sm"
//                 >
//                   Update Password
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         {/* ADDRESS BOOK SECTION */}
//         <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-4">
//             <div className="flex items-center gap-3">
//               <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
//                 <MapPin size={22} />
//               </div>
//               <div>
//                 <h3 className="font-semibold text-lg text-gray-800">My Address Book</h3>
//                 <p className="text-sm text-gray-400">Manage billing and delivery destinations</p>
//               </div>
//             </div>
//             {!showAddressForm && (
//               <button
//                 onClick={startAddAddress}
//                 className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
//               >
//                 <Plus size={16} />
//                 Add New Address
//               </button>
//             )}
//           </div>

//           {addressMsg.text && (
//             <div
//               className={`p-3.5 rounded-lg text-sm ${
//                 addressMsg.type === "success"
//                   ? "bg-green-50 text-green-700 border border-green-200"
//                   : "bg-red-50 text-red-700 border border-red-200"
//               }`}
//             >
//               {addressMsg.text}
//             </div>
//           )}

//           {/* TAB TOGGLE */}
//           <div className="flex gap-2 p-1 bg-gray-50 rounded-xl w-fit">
//             <button
//               onClick={() => {
//                 setAddressTab("shipping");
//                 setShowAddressForm(false);
//               }}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                 addressTab === "shipping"
//                   ? "bg-white text-stone-900 shadow"
//                   : "text-gray-500 hover:text-stone-900"
//               }`}
//             >
//               Shipping Address
//             </button>
//             <button
//               onClick={() => {
//                 setAddressTab("billing");
//                 setShowAddressForm(false);
//               }}
//               className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
//                 addressTab === "billing"
//                   ? "bg-white text-stone-900 shadow"
//                   : "text-gray-500 hover:text-stone-900"
//               }`}
//             >
//               Billing Address
//             </button>
//           </div>

//           {/* ADDRESS FORM OR LIST */}
//           {showAddressForm ? (
//             <form onSubmit={handleAddressSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-150 space-y-6">
//               <h4 className="font-semibold text-gray-800 text-base">
//                 {editingAddress ? "Edit Address Details" : "Add New Address"}
//               </h4>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.fullName}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, fullName: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.phoneNumber}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, phoneNumber: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Email Address (Optional)</label>
//                   <input
//                     type="email"
//                     value={addressFormFields.email}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, email: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Street Address</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.streetAddress}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, streetAddress: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Apartment, Suite, Unit, etc. (Optional)</label>
//                   <input
//                     type="text"
//                     value={addressFormFields.apartmentSuite}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, apartmentSuite: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.city}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, city: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">State / Province</label>
//                   <input
//                     type="text"
//                     value={addressFormFields.stateProvince}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, stateProvince: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Postal / ZIP Code</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.postalCode}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, postalCode: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
//                   <input
//                     type="text"
//                     required
//                     value={addressFormFields.country}
//                     onChange={(e) => setAddressFormFields({ ...addressFormFields, country: e.target.value })}
//                     className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
//                   />
//                 </div>
//                 <div className="flex items-center pt-6">
//                   <label className="flex items-center gap-2 cursor-pointer select-none">
//                     <input
//                       type="checkbox"
//                       checked={addressFormFields.isDefault}
//                       onChange={(e) => setAddressFormFields({ ...addressFormFields, isDefault: e.target.checked })}
//                       className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 h-4.5 w-4.5"
//                     />
//                     <span className="text-sm font-medium text-gray-600">Set as Default Address</span>
//                   </label>
//                 </div>
//               </div>

//               <div className="flex gap-2 pt-2">
//                 <button
//                   type="submit"
//                   className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition text-sm"
//                 >
//                   Save Address
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowAddressForm(false)}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg transition text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {addresses.length === 0 ? (
//                 <div className="col-span-full py-8 text-center text-gray-400">
//                   No addresses found. Add one to get started!
//                 </div>
//               ) : (
//                 addresses.map((addr) => (
//                   <div
//                     key={addr.id}
//                     className={`p-5 rounded-xl border relative flex flex-col justify-between h-full bg-white transition duration-300 hover:shadow-md ${
//                       addr.isDefault
//                         ? "border-amber-500 ring-1 ring-amber-500 shadow-sm"
//                         : "border-gray-200"
//                     }`}
//                   >
//                     <div>
//                       <div className="flex justify-between items-start mb-3 gap-2">
//                         <h5 className="font-semibold text-gray-800">{addr.fullName}</h5>
//                         {addr.isDefault && (
//                           <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full">
//                             Default
//                           </span>
//                         )}
//                       </div>

//                       <div className="text-sm text-gray-500 space-y-1.5 mb-4">
//                         <p>{addr.streetAddress}{addr.apartmentSuite ? `, ${addr.apartmentSuite}` : ""}</p>
//                         <p>{addr.city}, {addr.stateProvince ? `${addr.stateProvince}, ` : ""}{addr.postalCode}</p>
//                         <p>{addr.country}</p>
//                         <p className="pt-1.5 border-t border-gray-50 text-[13px]">📞 {addr.phoneNumber}</p>
//                         {addr.email && <p className="text-[13px]">✉️ {addr.email}</p>}
//                       </div>
//                     </div>

//                     <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
//                       <div className="flex gap-3">
//                         <button
//                           onClick={() => startEditAddress(addr)}
//                           className="text-stone-600 hover:text-stone-900 font-semibold text-xs flex items-center gap-1 transition"
//                         >
//                           <Edit3 size={12} />
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeleteAddress(addr.id)}
//                           className="text-red-500 hover:text-red-700 font-semibold text-xs flex items-center gap-1 transition"
//                         >
//                           <Trash2 size={12} />
//                           Delete
//                         </button>
//                       </div>
//                       {!addr.isDefault && (
//                         <button
//                           onClick={() => handleSetDefaultAddress(addr)}
//                           className="text-amber-600 hover:text-amber-700 font-semibold text-xs transition"
//                         >
//                           Set Default
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* ================= SIDEBAR ================= */}
//       <aside className="w-72 bg-gray-900 text-white flex flex-col font-sans">
//         {/* BRAND */}
//         <div className="p-6 text-xl font-bold border-b border-gray-800">
//           MyStore
//         </div>

//         {/* LOGGED IN USER SUMMARY IN SIDEBAR */}
//         {userProfile && (
//           <div className="p-4 mx-3 mt-4 bg-gray-850 rounded-xl border border-gray-800/80 flex items-center gap-3">
//             <div className="bg-amber-500 text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-lg uppercase shadow">
//               {userProfile.name ? userProfile.name.charAt(0) : "U"}
//             </div>
//             <div className="overflow-hidden">
//               <p className="font-semibold text-sm text-gray-100 truncate">{userProfile.name}</p>
//               <p className="text-[11px] text-gray-400 truncate">{userProfile.email}</p>
//             </div>
//           </div>
//         )}

//         <nav className="flex-1 overflow-y-auto p-3 space-y-6">
//           {/* ACCOUNT SECTION */}
//           <Section title="ACCOUNT">
//             <Item
//               icon={<LayoutDashboard size={18} />}
//               label="Overview"
//               active={panel === "overview"}
//               onClick={() => setPanel("overview")}
//             />
//             <Item
//               icon={<User size={18} />}
//               label="Profile"
//               active={panel === "profile"}
//               onClick={() => setPanel("profile")}
//             />
//             <Item
//               icon={<ShoppingCart size={18} />}
//               label="Orders"
//               active={panel === "orders"}
//               onClick={() => setPanel("orders")}
//             />
//             <Item
//               icon={<Heart size={18} />}
//               label="Wishlist"
//               active={panel === "wishlist"}
//               onClick={() => setPanel("wishlist")}
//             />
//             <Item
//               icon={<Wrench size={18} />}
//               label="Services"
//               active={panel === "services"}
//               onClick={() => setPanel("services")}
//             />
//           </Section>

//           {/* SHOP SECTION */}
//           <Section title="SHOP">
//             <Item
//               icon={<PackageSearch size={18} />}
//               label="Browse Products"
//               active={false}
//               onClick={() => navigate("/user/category")}
//             />
//             <Item
//               icon={<Tags size={18} />}
//               label="Cart"
//               active={false}
//               onClick={() => navigate("/addtocart")}
//             />
//           </Section>

//           {/* SUPPORT */}
//           <Section title="SUPPORT">
//             <Item
//               icon={<MessageCircle size={18} />}
//               label="Messages"
//               active={panel === "messages"}
//               onClick={() => setPanel("messages")}
//             />
//             <Item
//               icon={<Bell size={18} />}
//               label="Notifications"
//               active={panel === "notifications"}
//               onClick={() => setPanel("notifications")}
//             />
//           </Section>
//         </nav>

//         {/* LOGOUT */}
//         <div className="p-4 border-t border-gray-800">
//           <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-red-500 transition">
//             <LogOut size={18} />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         {/* HEADER */}
//         <div className="mb-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold capitalize text-gray-800">
//               {panel}
//             </h1>
//             <p className="text-gray-500">
//               Manage your account and shopping experience
//             </p>
//           </div>
//           {userProfile && (
//             <div className="text-right hidden sm:block">
//               <p className="font-medium text-gray-800">Welcome back, {userProfile.name}!</p>
//               <p className="text-xs text-gray-400">Role: <span className="uppercase font-semibold">{userProfile.role}</span></p>
//             </div>
//           )}
//         </div>

//         {/* CONTENT AREA */}
//         <div className="bg-gray-50 rounded-xl shadow p-6 border text-gray-700">
//           {panel === "overview" && <Overview />}
//           {panel === "profile" && <Profile />}
//           {panel === "orders" && <p>Order history list</p>}
//           {panel === "wishlist" && <p>Saved products</p>}
//           {panel === "services" && <p>Service requests</p>}

//           {panel === "products" && (
//             <div>
//               <h2 className="text-lg font-semibold mb-3">Browse Products</h2>
//               <p>Product grid + search + filters will be here</p>
//             </div>
//           )}

//           {panel === "categories" && (
//             <div>
//               <h2 className="text-lg font-semibold mb-3">Categories</h2>
//               <p>Filter products by category (Sofas, Chairs, etc.)</p>
//             </div>
//           )}

//           {panel === "messages" && <p>Chat with support/seller</p>}
//           {panel === "notifications" && <p>System notifications</p>}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ================= SIDEBAR COMPONENTS ================= */

// function Section({ title, children }: any) {
//   return (
//     <div>
//       <p className="text-xs text-gray-400 px-4 mb-2 tracking-wider">{title}</p>
//       <div className="space-y-1">{children}</div>
//     </div>
//   );
// }

// function Item({ icon, label, active, onClick }: any) {
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition
//       ${
//         active
//           ? "bg-yellow-500 text-black"
//           : "hover:bg-yellow-500 hover:text-black"
//       }`}
//     >
//       {icon}
//       {label}
//     </button>
//   );
// }


import React, { useState } from "react";

import {
  LayoutDashboard,
  User,
  ShoppingCart,
  Heart,
  Wrench,
  PackageSearch,
  Tags,
  Bell,
  MessageCircle,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  MapPin,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router";

type Panel =
  | "overview"
  | "profile"
  | "orders"
  | "wishlist"
  | "services"
  | "products"
  | "categories"
  | "messages"
  | "notifications";

type ServiceRequest = {
  id: number;
  referenceNumber?: string;
  status: string;
};

type Order = {
  id: number;
  orderNumber?: string;
  status: string;
  totalAmount?: number;
  price?: number;
};

type WishlistItem = {
  id: number;
  productName?: string;
};

type AddressResponse = {
  id: number;
  fullName: string;
  phoneNumber: string;
  email?: string;
  streetAddress: string;
  apartmentSuite?: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

export default function UserDashboard() {
  const [panel, setPanel] = useState<Panel>("overview");
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  // Helper to make API requests with automatic token sanitization (stripping outer quotes)
  const makeAuthRequest = async (url: string, method = "GET", body: any = null) => {
    let token = localStorage.getItem("token");
    if (token) {
      // 1. Strip double quotes if stored as a stringified string
      if (token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }
      // 2. Parse if stored as a stringified object (e.g. {"token": "..."})
      if (token.startsWith("{")) {
        try {
          const parsed = JSON.parse(token);
          if (parsed.token) {
            token = parsed.token;
          } else if (parsed.accessToken) {
            token = parsed.accessToken;
          }
        } catch (e) {
          // ignore parsing error
        }
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const config: RequestInit = { method, headers };
    if (body) {
      config.body = JSON.stringify(body);
    }
    return fetch(url, config);
  };

  const loadUserProfile = async () => {
    try {
      const res = await makeAuthRequest("http://localhost:8080/api/users/me");
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Failed to load user profile at dashboard level:", err);
    }
  };

  React.useEffect(() => {
    loadUserProfile();
  }, []);

  function Overview() {
    const [stats, setStats] = React.useState([
      { label: "Total Orders", value: 0 },
      { label: "Pending Orders", value: 0 },
      { label: "Wishlist Items", value: 0 },
      { label: "Services", value: 0 },
    ]);

    const [orders, setOrders] = React.useState<Order[]>([]);
    const [wishlist, setWishlist] = React.useState<WishlistItem[]>([]);
    const [services, setServices] = React.useState<ServiceRequest[]>([]);

    React.useEffect(() => {
      loadData();
    }, []);

    const authFetch = async (url) => {
      let token = localStorage.getItem("token");
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.slice(1, -1);
      }
      return fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };

    const loadData = async () => {
      try {
        // Stats
        const statsRes = await authFetch(
          "http://localhost:8080/api/dashboard/overview",
        );
        const statsData = await statsRes.json();

        setStats([
          { label: "Total Orders", value: statsData.totalOrders || 0 },
          { label: "Pending Orders", value: statsData.pendingOrders || 0 },
          { label: "Wishlist Items", value: statsData.wishlistCount || 0 },
          { label: "Services", value: statsData.serviceCount || 0 },
        ]);

        // Recent Orders
        const orderRes = await authFetch(
          "http://localhost:8080/api/orders/recent",
        );
        const orderData = await orderRes.json();
        setOrders(orderData || []);

        // Wishlist
        const wishRes = await authFetch("http://localhost:8080/api/wishlist");
        const wishData = await wishRes.json();
        setWishlist(wishData || []);

        // Services
        const serviceRes = await authFetch(
          "http://localhost:8080/api/service-requests",
        );
        const serviceData: ServiceRequest[] = await serviceRes.json();
        setServices(serviceData);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    };

    return (
      <div className="space-y-6">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 border">
              <p className="text-gray-500 text-sm">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </div>
          ))}
        </div>

        {/* ================= RECENT ORDERS ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-4">Recent Orders</h2>

          <div className="space-y-3">
            {orders.length === 0 && <p>No recent orders</p>}

            {orders.map((o) => (
              <div key={o.id} className="flex justify-between border-b pb-2">
                <span>Order #{o.orderNumber || o.id}</span>
                <span className="text-gray-500">{o.status}</span>
                <span className="font-bold">
                  LKR {o.totalAmount || o.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ================= WISHLIST ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-3">Wishlist Preview</h2>

          <div className="flex gap-3 flex-wrap">
            {wishlist.length === 0 && <p>No wishlist items</p>}

            {wishlist.map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm"
              >
                {item.productName || "Item"}
              </span>
            ))}
          </div>
        </div>

        {/* ================= SERVICES ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="font-semibold mb-4">Service Requests</h2>

          {services.length === 0 && <p>No service requests</p>}

          {services.map((s) => (
            <div key={s.id} className="flex justify-between py-2 border-b">
              <span>Request #{s.referenceNumber || s.id}</span>
              <span className="text-yellow-600">{s.status}</span>
            </div>
          ))}
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/user/category")}
            className="bg-amber-50 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md shadow-amber-500/30"
          >
            🛍️ Browse Products
          </button>
          <button
            onClick={() => navigate("/addtocart")}
            className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2.5 rounded-lg"
          >
            View Cart
          </button>
          <button
            onClick={() => setPanel("orders")}
            className="bg-stone-200 hover:bg-stone-300 px-5 py-2.5 rounded-lg"
          >
            My Orders
          </button>
        </div>
      </div>
    );
  }

  function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState({
      name: userProfile?.name || "",
      email: userProfile?.email || "",
      phoneNumber: userProfile?.phoneNumber || "",
    });
    const [profileMsg, setProfileMsg] = useState({ text: "", type: "" });

    const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
    const [passwordMsg, setPasswordMsg] = useState({ text: "", type: "" });

    const [shippingAddresses, setShippingAddresses] = useState<AddressResponse[]>([]);
    const [billingAddresses, setBillingAddresses] = useState<AddressResponse[]>([]);
    const [addressTab, setAddressTab] = useState<"shipping" | "billing">("shipping");

    // Address form state
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState<any>(null);
    const [addressFormFields, setAddressFormFields] = useState({
      fullName: "",
      phoneNumber: "",
      email: "",
      streetAddress: "",
      apartmentSuite: "",
      city: "",
      stateProvince: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
    const [addressMsg, setAddressMsg] = useState({ text: "", type: "" });

    React.useEffect(() => {
      if (userProfile) {
        setProfileForm({
          name: userProfile.name || "",
          email: userProfile.email || "",
          phoneNumber: userProfile.phoneNumber || "",
        });
      }
    }, [userProfile]);

    const loadAddresses = async () => {
      try {
        const shipRes = await makeAuthRequest("http://localhost:8080/api/addresses/shipping");
        if (shipRes.ok) {
          const data = await shipRes.json();
          setShippingAddresses(data);
        }
        const billRes = await makeAuthRequest("http://localhost:8080/api/addresses/billing");
        if (billRes.ok) {
          const data = await billRes.json();
          setBillingAddresses(data);
        }
      } catch (err) {
        console.error("Failed to load addresses:", err);
      }
    };

    React.useEffect(() => {
      loadAddresses();
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      setProfileMsg({ text: "", type: "" });
      try {
        const res = await makeAuthRequest(
          "http://localhost:8080/api/users/me",
          "PUT",
          profileForm
        );
        const data = await res.json();
        if (res.ok) {
          setUserProfile(data); // update top level state instantly!
          setIsEditing(false);
          setProfileMsg({ text: "Profile updated successfully!", type: "success" });
        } else {
          setProfileMsg({ text: data.message || "Failed to update profile", type: "error" });
        }
      } catch (err) {
        setProfileMsg({ text: "Network error occurred", type: "error" });
      }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setPasswordMsg({ text: "", type: "" });
      if (passwordForm.newPassword.length < 6) {
        setPasswordMsg({ text: "New password must be at least 6 characters", type: "error" });
        return;
      }
      try {
        const res = await makeAuthRequest(
          "http://localhost:8080/api/users/change-password",
          "PUT",
          passwordForm
        );
        if (res.ok) {
          setPasswordForm({ currentPassword: "", newPassword: "" });
          setPasswordMsg({ text: "Password changed successfully!", type: "success" });
        } else {
          const data = await res.json().catch(() => ({ message: "Incorrect password" }));
          setPasswordMsg({ text: data.message || "Failed to change password", type: "error" });
        }
      } catch (err) {
        setPasswordMsg({ text: "Network error occurred", type: "error" });
      }
    };

    const handleAddressSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAddressMsg({ text: "", type: "" });
      const url = editingAddress
        ? `http://localhost:8080/api/addresses/${addressTab}/${editingAddress.id}`
        : `http://localhost:8080/api/addresses/${addressTab}`;
      const method = editingAddress ? "PUT" : "POST";

      try {
        const res = await makeAuthRequest(url, method, addressFormFields);
        if (res.ok) {
          await loadAddresses();
          setShowAddressForm(false);
          setEditingAddress(null);
          setAddressMsg({ text: "Address saved successfully!", type: "success" });
        } else {
          const data = await res.json();
          setAddressMsg({ text: data.message || "Failed to save address", type: "error" });
        }
      } catch (err) {
        setAddressMsg({ text: "Network error occurred", type: "error" });
      }
    };

    const handleSetDefaultAddress = async (addr: any) => {
      try {
        const updated = { ...addr, isDefault: true };
        const res = await makeAuthRequest(
          `http://localhost:8080/api/addresses/${addressTab}/${addr.id}`,
          "PUT",
          updated
        );
        if (res.ok) {
          await loadAddresses();
        }
      } catch (err) {
        console.error("Failed to set default address:", err);
      }
    };

    const handleDeleteAddress = async (id: number) => {
      if (!confirm("Are you sure you want to delete this address?")) return;
      try {
        const res = await makeAuthRequest(
          `http://localhost:8080/api/addresses/${addressTab}/${id}`,
          "DELETE"
        );
        if (res.ok) {
          await loadAddresses();
        }
      } catch (err) {
        console.error("Failed to delete address:", err);
      }
    };

    const startAddAddress = () => {
      setEditingAddress(null);
      setAddressFormFields({
        fullName: "",
        phoneNumber: "",
        email: "",
        streetAddress: "",
        apartmentSuite: "",
        city: "",
        stateProvince: "",
        postalCode: "",
        country: "",
        isDefault: false,
      });
      setShowAddressForm(true);
    };

    const startEditAddress = (addr: any) => {
      setEditingAddress(addr);
      setAddressFormFields({
        fullName: addr.fullName || "",
        phoneNumber: addr.phoneNumber || "",
        email: addr.email || "",
        streetAddress: addr.streetAddress || "",
        apartmentSuite: addr.apartmentSuite || "",
        city: addr.city || "",
        stateProvince: addr.stateProvince || "",
        postalCode: addr.postalCode || "",
        country: addr.country || "",
        isDefault: addr.isDefault || false,
      });
      setShowAddressForm(true);
    };

    const addresses = addressTab === "shipping" ? shippingAddresses : billingAddresses;

    return (
      <div className="space-y-8">
        {/* PROFILE INFO & SECURITY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* USER INFO CARD */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
                  <User size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">Personal Profile</h3>
                  <p className="text-sm text-gray-400">Manage your credentials</p>
                </div>
              </div>
              {!isEditing && userProfile && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-medium px-4 py-1.5 rounded-lg text-sm transition"
                >
                  Edit Profile
                </button>
              )}
            </div>

            {profileMsg.text && (
              <div
                className={`p-3.5 rounded-lg text-sm ${
                  profileMsg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {profileMsg.text}
              </div>
            )}

            {!userProfile ? (
              <div className="py-6 text-center text-gray-400">Loading profile details...</div>
            ) : !isEditing ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 text-sm">Full Name</span>
                  <span className="font-medium text-gray-800">{userProfile.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 text-sm">Email Address</span>
                  <span className="font-medium text-gray-800">{userProfile.email}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-50">
                  <span className="text-gray-400 text-sm">Phone Number</span>
                  <span className="font-medium text-gray-800">{userProfile.phoneNumber || "Not provided"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2">
                  <span className="text-gray-400 text-sm">Account Role</span>
                  <span className="inline-flex px-2.5 py-0.5 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full uppercase">
                    {userProfile.role}
                  </span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2 rounded-lg transition text-sm"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileForm({
                        name: userProfile.name,
                        email: userProfile.email,
                        phoneNumber: userProfile.phoneNumber || "",
                      });
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-2 rounded-lg transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* CHANGE PASSWORD CARD */}
          <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="bg-stone-100 text-stone-800 p-2.5 rounded-lg">
                <Lock size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">Security Setting</h3>
                <p className="text-sm text-gray-400">Change your password</p>
              </div>
            </div>

            {passwordMsg.text && (
              <div
                className={`p-3.5 rounded-lg text-sm ${
                  passwordMsg.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold px-5 py-2 rounded-lg transition text-sm"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ADDRESS BOOK SECTION */}
        <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-gray-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
                <MapPin size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-800">My Address Book</h3>
                <p className="text-sm text-gray-400">Manage billing and delivery destinations</p>
              </div>
            </div>
            {!showAddressForm && (
              <button
                onClick={startAddAddress}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2 rounded-lg text-sm transition flex items-center gap-2"
              >
                <Plus size={16} />
                Add New Address
              </button>
            )}
          </div>

          {addressMsg.text && (
            <div
              className={`p-3.5 rounded-lg text-sm ${
                addressMsg.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {addressMsg.text}
            </div>
          )}

          {/* TAB TOGGLE */}
          <div className="flex gap-2 p-1 bg-gray-50 rounded-xl w-fit">
            <button
              onClick={() => {
                setAddressTab("shipping");
                setShowAddressForm(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                addressTab === "shipping"
                  ? "bg-white text-stone-900 shadow"
                  : "text-gray-500 hover:text-stone-900"
              }`}
            >
              Shipping Address
            </button>
            <button
              onClick={() => {
                setAddressTab("billing");
                setShowAddressForm(false);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                addressTab === "billing"
                  ? "bg-white text-stone-900 shadow"
                  : "text-gray-500 hover:text-stone-900"
              }`}
            >
              Billing Address
            </button>
          </div>

          {/* ADDRESS FORM OR LIST */}
          {showAddressForm ? (
            <form onSubmit={handleAddressSubmit} className="bg-gray-50 p-6 rounded-xl border border-gray-150 space-y-6">
              <h4 className="font-semibold text-gray-800 text-base">
                {editingAddress ? "Edit Address Details" : "Add New Address"}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={addressFormFields.fullName}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, fullName: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={addressFormFields.phoneNumber}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, phoneNumber: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    value={addressFormFields.email}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, email: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={addressFormFields.streetAddress}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, streetAddress: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Apartment, Suite, Unit, etc. (Optional)</label>
                  <input
                    type="text"
                    value={addressFormFields.apartmentSuite}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, apartmentSuite: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={addressFormFields.city}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, city: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={addressFormFields.stateProvince}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, stateProvince: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Postal / ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={addressFormFields.postalCode}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, postalCode: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                  <input
                    type="text"
                    required
                    value={addressFormFields.country}
                    onChange={(e) => setAddressFormFields({ ...addressFormFields, country: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addressFormFields.isDefault}
                      onChange={(e) => setAddressFormFields({ ...addressFormFields, isDefault: e.target.checked })}
                      className="rounded border-gray-300 text-amber-500 focus:ring-amber-500 h-4.5 w-4.5"
                    />
                    <span className="text-sm font-medium text-gray-600">Set as Default Address</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-2 rounded-lg transition text-sm"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2 rounded-lg transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addresses.length === 0 ? (
                <div className="col-span-full py-8 text-center text-gray-400">
                  No addresses found. Add one to get started!
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={`p-5 rounded-xl border relative flex flex-col justify-between h-full bg-white transition duration-300 hover:shadow-md ${
                      addr.isDefault
                        ? "border-amber-500 ring-1 ring-amber-500 shadow-sm"
                        : "border-gray-200"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <h5 className="font-semibold text-gray-800">{addr.fullName}</h5>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase rounded-full">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 space-y-1.5 mb-4">
                        <p>{addr.streetAddress}{addr.apartmentSuite ? `, ${addr.apartmentSuite}` : ""}</p>
                        <p>{addr.city}, {addr.stateProvince ? `${addr.stateProvince}, ` : ""}{addr.postalCode}</p>
                        <p>{addr.country}</p>
                        <p className="pt-1.5 border-t border-gray-50 text-[13px]">📞 {addr.phoneNumber}</p>
                        {addr.email && <p className="text-[13px]">✉️ {addr.email}</p>}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEditAddress(addr)}
                          className="text-stone-600 hover:text-stone-900 font-semibold text-xs flex items-center gap-1 transition"
                        >
                          <Edit3 size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs flex items-center gap-1 transition"
                        >
                          <Trash2 size={12} />
                          Delete
                        </button>
                      </div>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr)}
                          className="text-amber-600 hover:text-amber-700 font-semibold text-xs transition"
                        >
                          Set Default
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function OrdersList() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const loadOrders = async () => {
      try {
        const res = await makeAuthRequest("http://localhost:8080/api/orders/my-orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    };

    React.useEffect(() => {
      loadOrders();
    }, []);

    const toggleExpand = (orderId: number) => {
      setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    const getStatusColor = (status: string) => {
      switch (status.toUpperCase()) {
        case "COMPLETED":
          return "bg-green-100 text-green-800 border-green-200";
        case "PENDING":
          return "bg-amber-100 text-amber-800 border-amber-200";
        case "SHIPPED":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "CANCELLED":
          return "bg-red-100 text-red-800 border-red-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div className="bg-white rounded-xl shadow border border-gray-100 p-6 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
          <div className="bg-amber-100 text-amber-800 p-2.5 rounded-lg">
            <ShoppingCart size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">My Orders</h3>
            <p className="text-sm text-gray-400">View and track your order history</p>
          </div>
        </div>

        {loading ? (
          <div className="py-8 text-center text-gray-400">Loading order history...</div>
        ) : orders.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            You haven't placed any orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow transition"
              >
                {/* Order Summary Header */}
                <div
                  onClick={() => toggleExpand(order.id)}
                  className="bg-gray-50/50 p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800 text-sm md:text-base">
                      Order #{order.orderNumber || order.id}
                    </p>
                    <p className="text-xs text-gray-400">
                      Total Items: {order.items ? order.items.length : 0}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <p className="text-xs text-gray-400">Total Amount</p>
                      <p className="font-bold text-gray-800">LKR {order.totalAmount}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full border uppercase ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                      <span className="text-gray-450 text-sm select-none">
                        {expandedOrder === order.id ? "▲" : "▼"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded items section */}
                {expandedOrder === order.id && (
                  <div className="p-5 bg-white border-t border-gray-50 space-y-4">
                    <h4 className="font-semibold text-xs text-gray-700 uppercase tracking-wider">
                      Items Ordered
                    </h4>
                    <div className="divide-y divide-gray-100">
                      {order.items && order.items.map((item: any) => (
                        <div
                          key={item.id}
                          className="py-3 flex justify-between items-center text-sm"
                        >
                          <div className="space-y-0.5">
                            <p className="font-medium text-gray-800">{item.productName}</p>
                            <p className="text-xs text-gray-450">
                              Qty: {item.quantity} × LKR {item.unitPrice}
                            </p>
                          </div>
                          <p className="font-bold text-gray-805">LKR {item.subtotal}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-gray-900 text-white flex flex-col font-sans">
        {/* BRAND */}
        <div className="p-6 text-xl font-bold border-b border-gray-800">
          MyStore
        </div>

        {/* LOGGED IN USER SUMMARY IN SIDEBAR */}
        {userProfile && (
          <div className="p-4 mx-3 mt-4 bg-gray-850 rounded-xl border border-gray-800/80 flex items-center gap-3">
            <div className="bg-amber-500 text-black font-bold h-10 w-10 rounded-full flex items-center justify-center text-lg uppercase shadow">
              {userProfile.name ? userProfile.name.charAt(0) : "U"}
            </div>
            <div className="overflow-hidden">
              <p className="font-semibold text-sm text-gray-100 truncate">{userProfile.name}</p>
              <p className="text-[11px] text-gray-400 truncate">{userProfile.email}</p>
            </div>
          </div>
        )}

        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* ACCOUNT SECTION */}
          <Section title="ACCOUNT">
            <Item
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              active={panel === "overview"}
              onClick={() => setPanel("overview")}
            />
            <Item
              icon={<User size={18} />}
              label="Profile"
              active={panel === "profile"}
              onClick={() => setPanel("profile")}
            />
            <Item
              icon={<ShoppingCart size={18} />}
              label="Orders"
              active={panel === "orders"}
              onClick={() => setPanel("orders")}
            />
            <Item
              icon={<Heart size={18} />}
              label="Wishlist"
              active={panel === "wishlist"}
              onClick={() => setPanel("wishlist")}
            />
            <Item
              icon={<Wrench size={18} />}
              label="Services"
              active={panel === "services"}
              onClick={() => setPanel("services")}
            />
          </Section>

          {/* SHOP SECTION */}
          <Section title="SHOP">
            <Item
              icon={<PackageSearch size={18} />}
              label="Browse Products"
              active={false}
              onClick={() => navigate("/user/category")}
            />
            <Item
              icon={<Tags size={18} />}
              label="Cart"
              active={false}
              onClick={() => navigate("/addtocart")}
            />
          </Section>

          {/* SUPPORT */}
          <Section title="SUPPORT">
            <Item
              icon={<MessageCircle size={18} />}
              label="Messages"
              active={panel === "messages"}
              onClick={() => setPanel("messages")}
            />
            <Item
              icon={<Bell size={18} />}
              label="Notifications"
              active={panel === "notifications"}
              onClick={() => setPanel("notifications")}
            />
          </Section>
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-2 w-full px-4 py-3 rounded-lg hover:bg-red-500 transition">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* HEADER */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold capitalize text-gray-800">
              {panel}
            </h1>
            <p className="text-gray-500">
              Manage your account and shopping experience
            </p>
          </div>
          {userProfile && (
            <div className="text-right hidden sm:block">
              <p className="font-medium text-gray-800">Welcome back, {userProfile.name}!</p>
              <p className="text-xs text-gray-400">Role: <span className="uppercase font-semibold">{userProfile.role}</span></p>
            </div>
          )}
        </div>

        {/* CONTENT AREA */}
        <div className="bg-gray-50 rounded-xl shadow p-6 border text-gray-700">
          {panel === "overview" && <Overview />}
          {panel === "profile" && <Profile />}
          {panel === "orders" && <OrdersList />}
          {panel === "wishlist" && <p>Saved products</p>}
          {panel === "services" && <p>Service requests</p>}

          {panel === "products" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Browse Products</h2>
              <p>Product grid + search + filters will be here</p>
            </div>
          )}

          {panel === "categories" && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Categories</h2>
              <p>Filter products by category (Sofas, Chairs, etc.)</p>
            </div>
          )}

          {panel === "messages" && <p>Chat with support/seller</p>}
          {panel === "notifications" && <p>System notifications</p>}
        </div>
      </main>
    </div>
  );
}

/* ================= SIDEBAR COMPONENTS ================= */

function Section({ title, children }: any) {
  return (
    <div>
      <p className="text-xs text-gray-400 px-4 mb-2 tracking-wider">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function Item({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition
      ${
        active
          ? "bg-yellow-500 text-black"
          : "hover:bg-yellow-500 hover:text-black"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type Promotion = {
  id: number;
  product: string;
  category: string;
  discount: number;
  offerType: string;
  featured: boolean;
  description: string;
};
function SellerPromotions() {
  const [promotions, setPromotions] = useState([
  {
    id: 1,
    product: "Luxury Leather Sofa",
    category: "Sofa",
    discount: 25,
    offerType: "Discount",
    featured: true,
    description: "Premium leather sofa with modern design and high comfort",
  },
  {
    id: 2,
    product: "Wooden Dining Table Set",
    category: "Table",
    discount: 15,
    offerType: "Special Offer",
    featured: false,
    description: "6-seater dining table made with high-quality teak wood",
  },
  {
    id: 3,
    product: "Office Chair",
    category: "Chair",
    discount: 10,
    offerType: "Discount",
    featured: false,
    description: "Ergonomic chair perfect for long working hours",
  },
  {
    id: 4,
    product: "King Size Bed",
    category: "Bed",
    discount: 30,
    offerType: "Discount",
    featured: true,
    description: "Spacious king-size bed with strong wooden frame",
  },
  {
    id: 5,
    product: "Modern Cupboard",
    category: "Cupboard",
    discount: 20,
    offerType: "Special Offer",
    featured: false,
    description: "Large storage cupboard with stylish finish",
  },
  {
    id: 6,
    product: "Dining Chairs Set (Buy 1 Get 1)",
    category: "Chair",
    discount: 50,
    offerType: "Buy 1 Get 1",
    featured: true,
    description: "Buy one chair and get another absolutely free",
  },
]);
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("Sofa");
  const [discount, setDiscount] = useState(0);
  const [offerType, setOfferType] = useState("Discount");
  const [featured, setFeatured] = useState(false);
  const [description, setDescription] = useState("");

  const handleAddPromotion = () => {
    const newPromo: Promotion = {
      id: Date.now(),
      product,
      category,
      discount,
      offerType,
      featured,
      description,
    };

    setPromotions([...promotions, newPromo]);

    setProduct("");
    setDiscount(0);
    setDescription("");
    setFeatured(false);
  };
  const [sidebaropen, setsidebar] = useState<boolean>(false);
  const [darkmode, setdarkmode] = useState<boolean>(false);
  const navigate = useNavigate();

  const sideBarItems = [
    { name: "Dashboard", icon: "/images/dashboard.png", path: "/dashboard" },
    { name: "Products", icon: "/images/products.png", path: "/products" },
    { name: "Orders", icon: "/images/orders.png", path: "/orders" },
    {
      name: "Customer Details",
      icon: "/images/Details.png",
      path: "/customers",
    },
    { name: "Promotions", icon: "/images/promotion.png", path: "/promotions" },
    { name: "Messages", icon: "/images/msg.png", path: "/messages" },
    { name: "Profile", icon: "/images/profile.png", path: "/profile" },
  ];
  return (
    <div
      className={`bg-gray-100 min-h-screen font-sans ${darkmode ? "dark" : ""} flex`}
    >
      <aside
        className={`bg-white w-64 h-screen dark:bg-gray-900 fixed shadow-lg border-r border-gray-200 dark:border-gray-800 z-20 ${
          sidebaropen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0 lg:static transition-all duration-300 flex flex-col`}
      >
        <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
          <img src="/images/logo.png" alt="Logo" className="h-12 w-12" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Seller Dashboard
          </span>
          <button
            className="ml-auto lg:hidden"
            onClick={() => setsidebar(false)}
          >
            <img src="/images/close.png" alt="close" className="h-8 w-8 p-1" />
          </button>
        </div>
        <nav className="flex-1 mt-6">
          {sideBarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path!}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition font-medium mb-2"
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-3 mt-2">
          <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition">
            Logout
          </button>
        </div>
        <div className="mt-auto flex justify-center items-center p-4 border-t border-gray-200 dark:border-gray-800">
          <button
            className="bg-gray-200 dark:bg-gray-700 p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={() => setdarkmode(!darkmode)}
            aria-label="Toggle dark mode"
          >
            {darkmode ? (
              <img src="/images/moon.png" alt="moon" className="w-6 h-6" />
            ) : (
              <img src="/images/sun.png" alt="sun" className="w-6 h-6" />
            )}
          </button>
        </div>
      </aside>
      <main
        className={`flex-1 h-screen p-6  overflow-y-auto ${darkmode ? "dark bg-gray-900" : "bg-gray-100"}`}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Furniture Promotions 🪑
        </h2>

    
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
          <input
            type="text"
            placeholder="Product Name (e.g., Luxury Sofa)"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
            <option>Sofa</option>
            <option>Chair</option>
            <option>Table</option>
            <option>Bed</option>
            <option>Cupboard</option>
          </select>

          
          <select
            value={offerType}
            onChange={(e) => setOfferType(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          >
            <option>Discount</option>
            <option>Special Offer</option>
            <option>Buy 1 Get 1</option>
          </select>

          
          <input
            type="number"
            placeholder="Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
            className="w-full border p-2 rounded mb-3"
          />

          
          <textarea
            placeholder="Promotion description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded mb-3"
          />

          
          <label className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            Feature on Homepage
          </label>

          <button
            onClick={handleAddPromotion}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Promotion
          </button>
        </div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

  {promotions.length === 0 && (
    <p className="text-gray-500">No active promotions yet</p>
  )}

  {promotions.map((promo) => (
    <div
      key={promo.id}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
    >

    
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white"> 
          {promo.product}
        </h3>

        {promo.featured && (
          <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      
      <p className="text-sm text-gray-500 mb-2">
        {promo.category} • {promo.offerType}
      </p>

      
      <p className="text-2xl font-bold text-blue-600 mb-2">
        {promo.discount}% OFF
      </p>

      
      <p className="text-gray-600 text-sm mb-4">
        {promo.description}
      </p>

      
      <div className="flex justify-between">

        <button
          className="text-sm bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
          onClick={() => navigate(`/editpromotions/${promo.id}`)}
        >
          Edit
        </button>

        <button
          className="text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
          onClick={() =>
            setPromotions(promotions.filter((p) => p.id !== promo.id))
          }
        >
          Delete
        </button>

      </div>

    </div>
  ))}

</div>
      </main>
    </div>
  );
}

export default SellerPromotions;

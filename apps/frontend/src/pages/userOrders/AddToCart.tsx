import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { authFetch } from "../../utils/api";
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
  originalPrice: number;
  sku?: string;
};
const AddToCart = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);

  // ================= FETCH PRODUCT =================
  useEffect(() => {
    authFetch(`http://localhost:8080/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct({
          id: data.id,
          name: data.name,
          price: data.finalPrice ?? data.price,
          originalPrice: data.price,
          description: data.description,
          sku: data.sku,
          image: data.image
            ? `http://localhost:8080/uploads/${data.image}`
            : "/placeholder.png",
        });
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ================= ADD TO LOCAL CART =================
  const handleAddToCart = () => {
    if (!product) return;

    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      qty: qty,
    };

    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id);

      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, qty: p.qty + qty } : p
        );
      }

      return [...prev, item];
    });

    alert("Added to cart!");
  };

  // ================= LOADING =================
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading product...
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* PRODUCT IMAGE */}
        <div className="bg-white border rounded-xl p-4">
          <img
            src={product.image}
            className="w-full h-[400px] object-cover rounded-xl"
            alt={product.name}
          />
        </div>

        {/* PRODUCT DETAILS */}
        <div className="bg-white border rounded-xl p-6">

          <h1 className="text-3xl font-bold">{product.name}</h1>

          <p className="text-gray-500 text-sm mt-2">
            SKU: {product.sku}
          </p>

          <p className="mt-4 text-gray-600">
            {product.description}
          </p>

          {/* PRICE */}
          <div className="mt-6">
            <p className="line-through text-gray-400">
              LKR {product.originalPrice}
            </p>

            <p className="text-2xl font-bold text-green-600">
              LKR {product.price}
            </p>
          </div>

          {/* QTY */}
          <div className="flex items-center gap-4 mt-5">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              -
            </button>

            <span className="text-lg">{qty}</span>

            <button
              onClick={() => setQty((q) => q + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              +
            </button>
          </div>

          {/* BUTTON */}
          <button
            onClick={handleAddToCart}
            className="w-full mt-6 bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* LOCAL CART PREVIEW */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4">Cart Preview (Frontend Only)</h2>

        {cart.length === 0 ? (
          <p className="text-gray-500">Cart is empty</p>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white border p-4 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.qty}
                    </p>
                  </div>
                </div>

                <p className="font-bold text-green-600">
                  LKR {item.price * item.qty}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddToCart;
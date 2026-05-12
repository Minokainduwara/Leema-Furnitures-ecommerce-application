import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { authFetch } from "../../utils/api";

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 safe image builder
  const getImage = (img?: string) =>
    img ? `http://localhost:8080/${img.replace(/^\/+/, "")}` : "/placeholder.png";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        // ================= MAIN PRODUCT =================
        const res1 = await authFetch(
          `http://localhost:8080/api/products/${id}`
        );

        if (!res1.ok) throw new Error("Product fetch failed");

        const data = await res1.json();

        setProduct({
          id: data.id,
          name: data.name,
          price: data.finalPrice ?? data.price,
          originalPrice: data.price,
          description:
            data.description ||
            "Premium quality furniture designed for modern living spaces.",
          sku: data.sku || "N/A",
          image: getImage(data.image),
        });

        // ================= RELATED PRODUCTS =================
        const res2 = await authFetch(
          `http://localhost:8080/api/products/${id}/related`
        );

        if (!res2.ok) throw new Error("Related fetch failed");

        const relatedData = await res2.json();

        const formatted = relatedData.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: item.finalPrice ?? item.price,
          image: getImage(item.image),
        }));

        setRelated(formatted);
      } catch (err) {
        console.error("Product detail error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    window.scrollTo(0, 0);
  }, [id]);

  // ================= LOADING =================
  if (loading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading product...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO */}
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* IMAGE */}
        <div className="bg-white rounded-2xl shadow-sm border p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[450px] object-cover rounded-xl"
          />
        </div>

        {/* INFO */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col justify-between">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {product.name}
            </h1>

            <p className="text-gray-500 mt-2 text-sm">
              SKU: {product.sku}
            </p>

            <p className="mt-6 text-gray-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* PRICE */}
          <div className="mt-8 border-t pt-6">
            <p className="text-gray-400 line-through">
              LKR {product.originalPrice}
            </p>

            <p className="text-3xl font-bold text-green-600 mt-1">
              LKR {product.price}
            </p>

            <button className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition">
              Add to Cart
            </button>

            <button className="mt-3 w-full border border-black py-3 rounded-xl hover:bg-black hover:text-white transition">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* INFO BOXES */}
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h3 className="font-semibold">Delivery</h3>
          <p className="text-sm text-gray-600 mt-2">
            Free delivery within selected areas
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h3 className="font-semibold">Warranty</h3>
          <p className="text-sm text-gray-600 mt-2">
            10-year product warranty included
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <h3 className="font-semibold">Return Policy</h3>
          <p className="text-sm text-gray-600 mt-2">
            7-day return if product is damaged
          </p>
        </div>
      </div>

      {/* RELATED */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pb-16">

          <h2 className="text-2xl font-bold text-center mb-8">
            Related Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {related.map((p) => (
              <Link to={`/product/${p.id}`} key={p.id}>
                <div className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden">

                  <img
                    src={p.image}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800">
                      {p.name}
                    </h3>

                    <p className="text-green-600 font-bold mt-2">
                      LKR {p.price}
                    </p>
                  </div>

                </div>
              </Link>
            ))}

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
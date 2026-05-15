import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { authFetch } from "../../utils/api";

const ProductDetail = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState<any>(null);

  const [related, setRelated] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  
  const getImage = (img?: string) =>
    img
      ? `http://localhost:8080/${img.replace(/^\/+/, "")}`
      : "/placeholder.png";

  const handleAddToCart = async () => {

    try {

      console.log(product);

      const response = await authFetch(
        "http://localhost:8080/api/cart/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            productId: Number(product.id),

            
            quantity: quantity,

            addedPrice: Number(product.price),
          }),
        }
      );

      if (!response.ok) {

        const errorText = await response.text();

        console.log(errorText);

        throw new Error("Failed to add to cart");
      }

      navigate("/addtocart");

    } catch (error) {

      console.error(error);
    }
  };

  useEffect(() => {

    const loadData = async () => {

      setLoading(true);

      try {

       

        const res1 = await authFetch(
          `http://localhost:8080/api/products/${id}`
        );

        if (!res1.ok)
          throw new Error("Product fetch failed");

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

         
          stock: data.stock,

          image: getImage(data.image),
        });

        

        const res2 = await authFetch(
          `http://localhost:8080/api/products/${id}/related`
        );

        if (!res2.ok)
          throw new Error("Related fetch failed");

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

            {/* ✅ STOCK */}

            <div className="mt-5">

              {product.stock > 0 ? (

                <div className="flex items-center gap-2">

                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>

                  <p className="text-green-600 font-semibold">
                    In Stock ({product.stock} available)
                  </p>

                </div>

              ) : (

                <div className="flex items-center gap-2">

                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>

                  <p className="text-red-500 font-semibold">
                    Out of Stock
                  </p>

                </div>

              )}

            </div>

            {/* ✅ QUANTITY */}

            {product.stock > 0 && (

              <div className="mt-6 flex items-center gap-4">

                <p className="font-semibold text-gray-700">
                  Quantity
                </p>

                <div className="flex items-center border rounded-xl overflow-hidden">

                  <button
                    onClick={() =>
                      setQuantity((prev: number) =>
                        prev > 1 ? prev - 1 : 1
                      )
                    }
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-700 text-white"
                  >
                    -
                  </button>

                  <div className="px-6 py-2 font-bold text-gray-700">
                    {quantity}
                  </div>

                  <button
                    onClick={() =>
                      setQuantity((prev: number) =>
                        prev < product.stock
                          ? prev + 1
                          : prev
                      )
                    }
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-700 text-white"
                  >
                    +
                  </button>

                </div>

              </div>

            )}

            {/* ✅ BUTTONS */}

            {product.stock > 0 ? (

              <>

                <button
                  onClick={handleAddToCart}
                  className="mt-6 w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
                >
                  Add to Cart
                </button>

                <button className="mt-3 w-full border text-gray-700 border-black py-3 rounded-xl hover:bg-black hover:text-white transition font-semibold">
                  Buy Now
                </button>

              </>

            ) : (

              <button
                disabled
                className="mt-6 w-full bg-gray-300 text-gray-600 py-3 rounded-xl cursor-not-allowed font-semibold"
              >
                Out of Stock
              </button>

            )}

          </div>

        </div>

      </div>

      {/* INFO BOXES */}

      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">

        <div className="bg-white p-5 rounded-xl border shadow-sm">

          <h3 className="font-semibold">
            Delivery
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            Free delivery within selected areas
          </p>

        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">

          <h3 className="font-semibold">
            Warranty
          </h3>

          <p className="text-sm text-gray-600 mt-2">
            10-year product warranty included
          </p>

        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">

          <h3 className="font-semibold">
            Return Policy
          </h3>

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

              <Link
                to={`/product/details/${p.id}`}
                key={p.id}
              >

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
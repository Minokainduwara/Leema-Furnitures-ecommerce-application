import React from "react";
import { X, ShoppingCart, Plus, Minus, Trash2, } from "lucide-react";
import { useCart } from "../hooks/CartContext";
import { useNavigate } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
}) => {

  const navigate = useNavigate();

  const {
    items,
    total,
    updateQuantity,
    removeItem,
  } = useCart();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/40
            backdrop-blur-sm
          "
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 z-50
          h-full w-full sm:w-[420px]
          bg-white shadow-2xl
          transition-transform duration-300
          flex flex-col

          ${
            open
              ? "translate-x-0"
              : "translate-x-full"
          }
        `}
      >

        {/* Header */}
        <div
          className="
            px-6 py-5
            border-b border-stone-200
            flex items-center justify-between
            bg-linear-to-r
            from-emerald-600
            to-green-500
            text-white
          "
        >
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} />

            <div>
              <h2 className="font-bold text-lg">
                Your Cart
              </h2>

              <p className="text-sm text-white/80">
                {items.length} items
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
              p-2 rounded-lg
              hover:bg-white/10
              transition
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div
            className="
              flex-1 flex flex-col
              items-center justify-center
              text-center px-6
            "
          >
            <ShoppingCart
              size={70}
              className="text-stone-300 mb-5"
            />

            <h3 className="text-xl font-bold text-stone-800">
              Your cart is empty
            </h3>

            <p className="text-stone-500 mt-2">
              Add beautiful furniture to begin shopping.
            </p>
          </div>
        )}

        {/* Items */}
        {items.length > 0 && (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

              {items.map((item) => (
                <div
                  key={item.productId}
                  className="
                    border border-stone-200
                    rounded-2xl
                    p-4
                    bg-stone-50
                  "
                >

                  <div className="flex gap-4">

                    {/* Product Image */}
                    <div
                      className="
                        w-24 h-24
                        rounded-xl
                        overflow-hidden
                        bg-stone-200
                        shrink-0
                      "
                    >
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="
                          w-full h-full
                          object-cover
                        "
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">

                      <div className="flex justify-between gap-2">

                        <div>
                          <h3 className="font-semibold text-stone-800">
                            {item.productName}
                          </h3>

                          <p className="text-sm text-stone-500 mt-1">
                            Rs. {item.price}
                          </p>
                        </div>

                        <button
                          onClick={() =>
                            removeItem(item.productId)
                          }
                          className="
                            text-red-500
                            hover:text-red-600
                          "
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Quantity */}
                      <div
                        className="
                          mt-4
                          flex items-center justify-between
                        "
                      >

                        <div
                          className="
                            flex items-center
                            border border-stone-300
                            rounded-xl overflow-hidden
                          "
                        >

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="
                              px-3 py-2
                              text-stone-700
                              hover:bg-stone-200
                              transition
                            "
                          >
                            <Minus size={16} />
                          </button>

                          <span
                            className="
                              px-4
                              text-stone-700
                              text-sm font-medium
                            "
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity + 1
                              )
                            }
                            className="
                              px-3 py-2
                              text-stone-700
                              hover:bg-stone-200
                              transition
                            "
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <p className="font-bold text-stone-800">
                          Rs. {item.lineTotal}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* Footer */}
            <div
              className="
                border-t border-stone-200
                p-5
                bg-white
              "
            >

              <div
                className="
                  flex items-center justify-between
                  mb-5
                "
              >
                <span className="text-stone-600">
                  Total
                </span>

                <span
                  className="
                    text-2xl font-black
                    text-emerald-700
                  "
                >
                  Rs. {total}
                </span>
              </div>

              <button onClick={() => { onClose(); navigate("/user/checkout")}}
                className="
                  w-full
                  bg-orange-500
                  hover:bg-orange-600
                  text-white
                  font-bold
                  py-3 rounded-2xl
                  transition
                "
              >
                Proceed to Checkout
              </button>

            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
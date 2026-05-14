import { 
  createContext, 
  useContext, 
  useEffect, 
  useState, 
  type ReactNode, 
} from "react";

import { useAuth } from "./AuthContext";
import api from "../api/client";

// =====================================================
// TYPES
// =====================================================

export interface CartItem {
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface CartResponse {
  cartId: number;
  items: CartItem[];
  total: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;

  addToCart: (
    productId: number,
    quantity?: number
  ) => Promise<void>;

  updateQuantity: (
    productId: number,
    quantity: number
  ) => Promise<void>;

  removeItem: (
    productId: number
  ) => Promise<void>;
}

// =====================================================
// CONTEXT
// =====================================================

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

// =====================================================
// PROVIDER
// =====================================================

export const CartProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // =====================================================
  // FETCH CART
  // =====================================================

  const fetchCart = async () => {
    try {
      setIsLoading(true);

      const response = await api
        .get("cart")
        .json<CartResponse>();

      setItems(response.items || []);
      setTotal(response.total || 0);

    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // ADD TO CART
  // =====================================================

  const addToCart = async (
    productId: number,
    quantity = 1
  ) => {
    try {
      await api.post("cart/add", {
        json: {
          productId,
          quantity,
        },
      });

      await fetchCart();

    } catch (error) {
      console.error("Failed to add to cart", error);
    }
  };

  // =====================================================
  // UPDATE QUANTITY
  // =====================================================

  const updateQuantity = async (
    productId: number,
    quantity: number
  ) => {
    try {
      await api.put("cart/update", {
        json: {
          productId,
          quantity,
        },
      });

      await fetchCart();

    } catch (error) {
      console.error("Failed to update cart", error);
    }
  };

  // =====================================================
  // REMOVE ITEM
  // =====================================================

  const removeItem = async (
    productId: number
  ) => {
    try {
      await api.delete("cart/item", {
        json: {
          productId,
        },
      });

      await fetchCart();

    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
      setTotal(0);
    }

  }, [user]);

  // =====================================================
  // ITEM COUNT
  // =====================================================

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        itemCount,
        isLoading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// =====================================================
// HOOK
// =====================================================

export const useCart = () => {

  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used within CartProvider"
    );
  }

  return context;
};
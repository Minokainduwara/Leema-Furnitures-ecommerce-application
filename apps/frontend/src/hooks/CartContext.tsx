import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import api from "../api/client";

export interface CartItem {
  productId: number;
  productName: string;
  productImage?: string | null;
  quantity: number;
  price: number;
  lineTotal: number;
}

interface CartResponse {
  items: CartItem[];
  total: number;
}

interface CartContextType {
  items: CartItem[];
  total: number;
  count: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (productId: number, quantity: number) => Promise<void>;
  removeItem: (productId: number) => Promise<void>;
  clearLocal: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

const isLoggedIn = () =>
  Boolean(localStorage.getItem("token") || localStorage.getItem("accessToken"));

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn()) {
      setItems([]);
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get("cart").json<CartResponse>();
      setItems(data.items || []);
      setTotal(Number(data.total || 0));
    } catch {
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (productId: number, quantity: number = 1) => {
      const data = await api
        .post("cart/add", { json: { productId, quantity } })
        .json<CartResponse>();
      setItems(data.items || []);
      setTotal(Number(data.total || 0));
    },
    [],
  );

  const updateItem = useCallback(
    async (productId: number, quantity: number) => {
      const data = await api
        .put("cart/update", { json: { productId, quantity } })
        .json<CartResponse>();
      setItems(data.items || []);
      setTotal(Number(data.total || 0));
    },
    [],
  );

  const removeItem = useCallback(async (productId: number) => {
    const data = await api
      .delete("cart/item", { json: { productId } })
      .json<CartResponse>();
    setItems(data.items || []);
    setTotal(Number(data.total || 0));
  }, []);

  const clearLocal = useCallback(() => {
    setItems([]);
    setTotal(0);
  }, []);

  // Initial load + re-fetch whenever auth changes
  useEffect(() => {
    fetchCart();
    const handler = () => fetchCart();
    window.addEventListener("leema:auth-changed", handler);
    return () => window.removeEventListener("leema:auth-changed", handler);
  }, [fetchCart]);

  const count = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        total,
        count,
        loading,
        fetchCart,
        addToCart,
        updateItem,
        removeItem,
        clearLocal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

const STORAGE_KEY = "leema_cart";
const EVENT_NAME = "leema:cart-updated";

const read = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const write = (items: CartItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
};

export const getCart = (): CartItem[] => read();

export const getCartCount = (): number =>
  read().reduce((sum, it) => sum + it.qty, 0);

export const getCartTotal = (): number =>
  read().reduce((sum, it) => sum + it.price * it.qty, 0);

export const addToCart = (item: Omit<CartItem, "qty">, qty = 1) => {
  const items = read();
  const existing = items.find((it) => it.id === item.id);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ ...item, qty });
  }
  write(items);
};

export const updateQty = (id: number, qty: number) => {
  const items = read();
  const target = items.find((it) => it.id === id);
  if (!target) return;
  if (qty <= 0) {
    write(items.filter((it) => it.id !== id));
    return;
  }
  target.qty = qty;
  write(items);
};

export const removeFromCart = (id: number) => {
  write(read().filter((it) => it.id !== id));
};

export const clearCart = () => write([]);

export const subscribeCart = (cb: () => void): (() => void) => {
  const handler = () => cb();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
};

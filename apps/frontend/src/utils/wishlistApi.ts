import { authFetch } from "./api";

export const addToWishlist = async (productId: number) => {
  return authFetch(`${import.meta.env.VITE_API_URL}/api/wishlist/add/${productId}`, {
    method: "POST",
  });
};

export const removeFromWishlist = async (productId: number) => {
  return authFetch(`${import.meta.env.VITE_API_URL}/api/wishlist/remove/${productId}`, {
    method: "DELETE",
  });
};
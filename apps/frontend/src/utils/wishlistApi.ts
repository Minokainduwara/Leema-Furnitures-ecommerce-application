import { authFetch } from "./api";

export const addToWishlist = async (productId: number) => {
  return authFetch(`http://localhost:8080/api/wishlist/add/${productId}`, {
    method: "POST",
  });
};

export const removeFromWishlist = async (productId: number) => {
  return authFetch(`http://localhost:8080/api/wishlist/remove/${productId}`, {
    method: "DELETE",
  });
};
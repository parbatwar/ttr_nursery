import { request } from "../lib/axios";
import { cartStorage } from "../lib/storage";

// Guests have no account, so this token tells the backend which cart is theirs.
export function cartHeaders() {
  const token = cartStorage.getToken();
  return token ? { "X-Cart-Token": token } : {};
}

function saveCartToken(cart) {
  if (cart.token) {
    cartStorage.setToken(cart.token);
  } else if (cart.id) {
    cartStorage.clear();
  }

  return cart;
}

export const getCart = () =>
  request("/cart/", { headers: cartHeaders() }).then(saveCartToken);

export const addToCart = (product, quantity = 1, variant = null) =>
  request("/cart/items/", {
    method: "POST",
    headers: cartHeaders(),
    body: JSON.stringify({ product, quantity, variant }),
  }).then(saveCartToken);

export const updateCartItem = (id, quantity) =>
  request(`/cart/items/${id}/`, {
    method: "PATCH",
    headers: cartHeaders(),
    body: JSON.stringify({ quantity }),
  }).then(saveCartToken);

export const removeCartItem = (id) =>
  request(`/cart/items/${id}/remove/`, {
    method: "DELETE",
    headers: cartHeaders(),
  }).then(saveCartToken);

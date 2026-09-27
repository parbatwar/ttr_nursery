import { request } from "../lib/axios";

export const getCart = () => request("/cart/");

export const addToCart = (product, quantity = 1) =>
  request("/cart/items/", {
    method: "POST",
    body: JSON.stringify({ product, quantity }),
  });

export const updateCartItem = (id, quantity) =>
  request(`/cart/items/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });

export const removeCartItem = (id) =>
  request(`/cart/items/${id}/remove/`, {
    method: "DELETE",
  });
import { request } from "../lib/axios";
import { cartHeaders } from "./cart";

export const createOrder = (details) =>
  request("/orders/", {
    method: "POST",
    headers: cartHeaders(),
    body: JSON.stringify(details),
  });

export const getOrderStatus = (accessToken, options = {}) =>
  request(`/orders/track/${accessToken}/`, { ...options, auth: false });

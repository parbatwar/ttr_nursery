import { request } from "../lib/axios";

export const getProducts = (query = "") =>
  request(`/products/${query}`);

export const getProduct = (slug) =>
  request(`/products/${slug}/`);

export const getCategories = () =>
  request("/categories/");
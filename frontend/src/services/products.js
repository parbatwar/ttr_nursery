import { request } from "../lib/axios";

export const getProducts = (query = "", options = {}) =>
  request(`/products/${query ? `?${String(query).replace(/^\?/, "")}` : ""}`, { ...options, auth: false });

export const getProduct = (slug, options = {}) =>
  request(`/products/${slug}/`, { ...options, auth: false });

export const getCategories = (options = {}) =>
  request("/categories/", { ...options, auth: false });

export const getCatalogFilters = (options = {}) =>
  request("/catalog-filters/", { ...options, auth: false });

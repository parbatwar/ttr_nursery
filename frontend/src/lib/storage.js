export const tokenStorage = {
  getAccess() {
    return localStorage.getItem("access");
  },

  getRefresh() {
    return localStorage.getItem("refresh");
  },

  setTokens(access, refresh) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
  },

  clear() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  },

  isAuthenticated() {
    return !!localStorage.getItem("access");
  },
};

const CART_TOKEN_KEY = "cart_token";

export const cartStorage = {
  getToken() {
    return localStorage.getItem(CART_TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(CART_TOKEN_KEY, token);
  },

  clear() {
    localStorage.removeItem(CART_TOKEN_KEY);
  },
};

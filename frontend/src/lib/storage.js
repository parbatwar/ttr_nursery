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
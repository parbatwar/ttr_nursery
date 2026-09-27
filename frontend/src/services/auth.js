import { request } from "../lib/axios";
import { tokenStorage } from "../lib/storage";

export async function login(email, password) {
  const data = await request("/auth/login/", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  tokenStorage.setTokens(data.access, data.refresh);
  return data;
}

export async function register({ email, password }) {
  return request("/auth/register/", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export async function getCurrentUser() {
  try {
    return await request("/auth/me/");
  } catch (error) {
    const refresh = tokenStorage.getRefresh();
    if (error.status !== 401 || !refresh) throw error;
    const data = await request("/auth/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh }),
    });
    // Do not restore credentials if the user logged out during this request.
    if (tokenStorage.getRefresh() !== refresh) throw error;
    tokenStorage.setTokens(data.access, data.refresh || refresh);
    return request("/auth/me/");
  }
}

export function logout() {
  tokenStorage.clear();
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

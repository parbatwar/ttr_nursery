import { tokenStorage } from "./storage";

const BASE_URL = "http://127.0.0.1:8000/api";

export async function request(endpoint, options = {}) {
  const access = tokenStorage.getAccess();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(access && !["/auth/login/", "/auth/register/", "/auth/refresh/"].includes(endpoint)
        ? { Authorization: `Bearer ${access}` }
        : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(
      data.detail ||
      data.error ||
      "Something went wrong."
    );
    error.status = res.status;
    throw error;
  }

  return data;
}

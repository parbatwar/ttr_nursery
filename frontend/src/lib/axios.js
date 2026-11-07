import { tokenStorage } from "./storage";

const BASE_URL = "http://127.0.0.1:8000/api";
const AUTH_ENDPOINTS = ["/auth/login/", "/auth/register/", "/auth/refresh/"];

async function refreshAccessToken() {
  const refresh = tokenStorage.getRefresh();
  if (!refresh) return false;

  const res = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  if (!res.ok) return false;

  const data = await res.json();
  tokenStorage.setTokens(data.access, data.refresh || refresh);
  return true;
}

function send(endpoint, { auth, ...fetchOptions }) {
  const access = tokenStorage.getAccess();
  const useToken = auth && access && !AUTH_ENDPOINTS.includes(endpoint);

  return fetch(`${BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(useToken ? { Authorization: `Bearer ${access}` } : {}),
      ...(fetchOptions.headers || {}),
    },
  });
}

function getErrorMessage(data) {
  if (data.detail || data.error) return data.detail || data.error;

  // Form errors arrive as { field: ["message"] }, so show the first one.
  const firstField = Object.values(data)[0];
  if (Array.isArray(firstField)) return firstField[0];
  if (typeof firstField === "string") return firstField;

  return "Something went wrong.";
}

export async function request(endpoint, options = {}) {
  const { auth = true, ...fetchOptions } = options;
  const hadToken = auth && Boolean(tokenStorage.getAccess());

  let res = await send(endpoint, { auth, ...fetchOptions });

  // An old sign-in should never stop someone from shopping as a guest.
  if (res.status === 401 && hadToken && !AUTH_ENDPOINTS.includes(endpoint)) {
    const refreshed = await refreshAccessToken().catch(() => false);
    if (!refreshed) tokenStorage.clear();
    res = await send(endpoint, { auth, ...fetchOptions });
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(getErrorMessage(data));
    error.status = res.status;
    error.fields = data;
    throw error;
  }

  return data;
}

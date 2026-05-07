import { getToken, clearAuth } from "../utils/auth";

export const BASE = import.meta.env.VITE_API_URL !== undefined
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "http://localhost:3001";

export async function api(endpoint, { method = "GET", body, params, multipart = false, signal } = {}) {
  let url = BASE + endpoint;
  if (params) {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ""))
    ).toString();
    if (qs) url += "?" + qs;
  }
  const token = getToken();
  const headers = {};
  if (!multipart) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const opts = { method, headers, ...(signal ? { signal } : {}) };
  if (body !== undefined) opts.body = multipart ? body : JSON.stringify(body);

  try {
    const res = await fetch(url, opts);

    if (res.status === 401 && token) {
      clearAuth();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return { success: false, message: "Session expired. Please log in again.", status: 401 };
    }

    try {
      return await res.json();
    } catch {
      return { success: false, message: "Invalid response from server", status: res.status };
    }
  } catch (err) {
    if (err.name === "AbortError") throw err;
    return { success: false, message: "Network error. Please check your connection.", status: 0 };
  }
}

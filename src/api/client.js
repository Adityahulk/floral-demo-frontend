import { getToken } from "../utils/auth";

const BASE = import.meta.env.VITE_API_URL !== undefined
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
  const res = await fetch(url, opts);
  return res.json();
}

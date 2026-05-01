const SECRET = import.meta.env.VITE_CRYPTO_SECRET || "floral-studio-s3cr3t-k3y-2024";

function encrypt(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
  }
  return btoa(result);
}

function decrypt(encoded) {
  try {
    const text = atob(encoded);
    let result = "";
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length));
    }
    return result;
  } catch {
    return null;
  }
}

const K_TOKEN = encrypt("token");
const K_ROLE  = encrypt("role");

export function setAuth({ token, role }) {
  localStorage.setItem(K_TOKEN, encrypt(token));
  localStorage.setItem(K_ROLE,  encrypt(role));
}

export function clearAuth() {
  localStorage.removeItem(K_TOKEN);
  localStorage.removeItem(K_ROLE);
}

export function getToken() {
  const enc = localStorage.getItem(K_TOKEN);
  return enc ? decrypt(enc) : null;
}

export function isAuthenticated() {
  return !!getToken();
}

export function isAdmin() {
  const enc = localStorage.getItem(K_ROLE);
  if (!enc) return false;
  return decrypt(enc) === "admin";
}

export function getTokenPayload() {
  const token = getToken();
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function authFetch(url, options = {}) {
  const token = getToken();
  const { headers, ...rest } = options;
  return fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
}

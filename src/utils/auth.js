// utils/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

export const isAdmin = () => {
  return localStorage.getItem("role") === "admin";
};
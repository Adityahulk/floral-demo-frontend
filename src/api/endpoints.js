export const API = {
  auth: {
    login:           "/api/auth/login",
    register:        "/api/auth/register",
    sendSignupOtp:   "/api/auth/send-signup-otp",
    verifySignupOtp: "/api/auth/verify-signup-otp",
    forgotPassword:  "/api/auth/forgot-password",
    verifyOtp:       "/api/auth/verify-otp",
    resetPassword:   "/api/auth/reset-password",
    me:              "/api/auth/me",
    profile:         "/api/auth/profile",
    adminUsers:      "/api/auth/admin/users",
    adminUserStatus: (id) => `/api/auth/admin/users/${id}/status`,
  },
  products: {
    list:       "/api/products",
    adminAll:   "/api/products/admin/all",
    byCategory: (categoryId) => `/api/products/category/${categoryId}`,
    detail:     (id) => `/api/products/${id}`,
    create:     "/api/product",
    update:     (id) => `/api/products/${id}`,
    delete:     (id) => `/api/products/${id}`,
  },
  categories: {
    list:   "/api/categories",
    detail: (id) => `/api/categories/${id}`,
  },
  orders: {
    create:      "/api/orders",
    initiate:    "/api/orders/initiate",
    confirm:     "/api/orders/confirm",
    userOrders:  "/api/orders/user",
    detail:      (id) => `/api/orders/${id}`,
    cancel:      (id) => `/api/orders/${id}/cancel`,
    adminAll:    "/api/admin/orders",
    adminStatus: (id) => `/api/admin/orders/${id}/status`,
  },
  reviews: {
    list:   (productId) => `/api/products/${productId}/reviews`,
    create: (productId) => `/api/products/${productId}/reviews`,
    update: (id) => `/api/reviews/${id}`,
    delete: (id) => `/api/reviews/${id}`,
  },
  contact: {
    submit: "/api/contact",
    list:   "/api/contact",
    update: (id) => `/api/contact/${id}`,
    delete: (id) => `/api/contact/${id}`,
  },
  search: {
    query: "/api/search",
  },
  announcement: {
    get:    "/api/announcement",
    update: "/api/announcement",
  },
  todaysPick: {
    get:    "/api/todayspick",
    update: "/api/todayspick",
  },
  recommendations: {
    get:    "/api/recommendations",
    update: "/api/recommendations",
  },
  banners: {
    get:    "/api/banners",
    update: "/api/banners",
  },
  analytics: {
    kpi:       "/api/admin/analytics/kpi",
    dashboard: "/api/admin/analytics/dashboard",
    products:  "/api/admin/analytics/products",
  },
  upload: {
    image: "/api/upload",
  },
};

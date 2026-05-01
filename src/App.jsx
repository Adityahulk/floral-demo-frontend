// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Footer from "./components/Footer";
// import Home from "./pages/Home";
// import AnnouncementBar from "./components/AnnouncementBar";
// import Header from "./components/Header";
// import AboutPage from "./pages/AboutPage";
// import ContactPage from "./pages/ContactPage";
// import OrdersPage from "./pages/OrdersPage";
// import OrderDetail from "./pages/OrderDetail";
// import AdminPanel from "./pages/AdminSection/AdminPanel";
// import CheckoutPage from "./pages/CheckoutPage";
// import PrivacyPolicy from "./pages/PolicyPages/PrivacyPolicy";
// import TermsConditions from "./pages/PolicyPages/TermsConditions";
// import CookiePolicy from "./pages/PolicyPages/CookiePolicy";
// import ProfilePage from "./pages/ProfileSection/ProfilePage";
// import ProductDetail from "./pages/ProductSection/ProductDetail";
// import CategoryPage from "./pages/ProductSection/CategoryPage";
// import CategoryProductsPage from "./pages/ProductSection/CategoryProductsPage";
// import MainLayout from "./layouts/MainLayout";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* ✅ Normal pages with header/footer */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<AboutPage />} />
//           <Route path="/contact" element={<ContactPage />} />
          // <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          // <Route path="/terms-conditions" element={<TermsConditions />} />
          // <Route path="/cookie-policy" element={<CookiePolicy />} />
//           <Route path="/category" element={<CategoryPage />} />
//           <Route path="/category/:id" element={<CategoryProductsPage />} />
//           <Route path="/category/:id/:productId" element={<ProductDetail />} />
//           <Route path="/product/:id" element={<ProductDetail />} />
//           <Route path="/orders" element={<OrdersPage />} />
//           <Route path="/orders/:id" element={<OrderDetail />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="/cart" element={<CheckoutPage />} />
//         </Route>

//         {/* ❌ No header/footer */}
//         <Route path="/admin" element={<AdminPanel />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetail from "./pages/OrderDetail";
import AdminPanel from "./pages/AdminSection/AdminPanel";
import CheckoutPage from "./pages/CheckoutPage";
import PrivacyPolicy from "./pages/PolicyPages/PrivacyPolicy";
import TermsConditions from "./pages/PolicyPages/TermsConditions";
import CookiePolicy from "./pages/PolicyPages/CookiePolicy";
import ProfilePage from "./pages/ProfileSection/ProfilePage";
import ProductDetail from "./pages/ProductSection/ProductDetail";
import CategoryPage from "./pages/ProductSection/CategoryPage";
import CategoryProductsPage from "./pages/ProductSection/CategoryProductsPage";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminRoute from "./routes/AdminRoute";
import AuthPage from "./pages/Auth/AuthPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🌍 PUBLIC ROUTES */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:categoryId" element={<CategoryProductsPage />} />
          <Route path="/category/:categoryId/:productId" element={<ProductDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/cart" element={<CheckoutPage />} />
        </Route>

        {/* 🔒 PROTECTED USER ROUTES */}
        <Route element={<MainLayout />}>
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 🔑 AUTH ROUTES */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />

        {/* 🛑 ADMIN ROUTES (no header/footer) */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin/*" element={<AdminPanel />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
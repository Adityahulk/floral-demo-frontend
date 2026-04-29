import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AnnouncementBar from "./components/AnnouncementBar";
import Header from "./components/Header";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetail from "./pages/OrderDetail";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminSection/AdminPanel";
import CheckoutPage from "./pages/CheckoutPage";
import PrivacyPolicy from "./pages/PolicyPages/PrivacyPolicy";
import TermsConditions from "./pages/PolicyPages/TermsConditions";
import CookiePolicy from "./pages/PolicyPages/CookiePolicy";
// import CookiePolicy from "./pages/PolicyPages/CookiePolicy";
export default function App() {

  return (
    <BrowserRouter>
    <AnnouncementBar/>
      <Header cartCount={3} wishCount={6} onCartOpen={()=>{}}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/orders" element={<OrdersPage />}/>
        <Route path="/orders/:id" element={<OrderDetail />}/>
        <Route path="/profile" element={<ProfilePage />}/>
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
        <Route path="/cart" element={<CheckoutPage />}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy />}/>
        <Route path="/terms-conditions" element={<TermsConditions />}/>
        <Route path="/cookie-policy" element={<CookiePolicy />}/>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
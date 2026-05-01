import { useState } from "react";
import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false);
  const { totalItems } = useCart();

  return (
    <>
      <AnnouncementBar />
      <Header cartCount={totalItems} wishCount={0} onCartOpen={() => setCartOpen(true)} />
      <Outlet />
      <Footer />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}

// layouts/MainLayout.jsx

import { Outlet } from "react-router-dom";
import AnnouncementBar from "../components/AnnouncementBar";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <AnnouncementBar />
      <Header cartCount={3} wishCount={6} onCartOpen={() => {}} />
      <Outlet />
      <Footer />
    </>
  );
}
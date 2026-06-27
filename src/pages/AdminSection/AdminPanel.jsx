import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTokenPayload, clearAuth } from "../../utils/auth";
import {
  LayoutDashboard, Users, BarChart2, Package, Eye,
  Star, Bell, Menu, Home, LogOut, Image, Sparkles, Crown, Mail, Megaphone, Layers, Send,
} from "lucide-react";
import TechComputerLogo from "../../assets/tech-computer-logo.jpeg";
import AddProductForm from "./AddProductForm";
import Dashboard from "./AdminTabs/DashboardTab";
import CustomersTab from "./AdminTabs/CustomersTab";
import AnalyticsTab from "./AdminTabs/AnalyticsTab";
import ProductsTab from "./AdminTabs/ProductsTab";
import AdminOrdersTab from "./AdminTabs/OrdersTab";
import ReviewsTab from "./AdminTabs/ReviewsTab";
import BannersTab from "./AdminTabs/BannersTab";
import TodaysPickTab from "./AdminTabs/TodaysPickTab";
import RecommendationsTab from "./AdminTabs/RecommendationsTab";
import ContactsTab from "./AdminTabs/ContactsTab";
import AnnouncementTab from "./AdminTabs/AnnouncementTab";
import CategoriesTab from "./AdminTabs/CategoriesTab";
import NewsletterTab from "./AdminTabs/NewsletterTab";

const NAV = [
  { id:"dashboard",      icon:<LayoutDashboard size={18}/>, label:"Dashboard"     },
  { id:"customers",      icon:<Users size={18}/>,           label:"Customers"     },
  { id:"analytics",      icon:<BarChart2 size={18}/>,       label:"Analytics"     },
  { id:"orders",         icon:<Package size={18}/>,         label:"Orders"        },
  { id:"products",       icon:<Eye size={18}/>,             label:"Products"      },
  { id:"categories",     icon:<Layers size={18}/>,          label:"Categories"    },
  { id:"reviews",        icon:<Star size={18}/>,            label:"Reviews"       },
  { id:"banners",        icon:<Image size={18}/>,           label:"Banners"       },
  { id:"todayspick",     icon:<Crown size={18}/>,           label:"Today's Pick"  },
  { id:"recommendations", icon:<Sparkles size={18}/>,       label:"Recommendations" },
  { id:"contacts",        icon:<Mail size={18}/>,            label:"Contacts"        },
  { id:"announcement",    icon:<Megaphone size={18}/>,       label:"Announcement"    },
  { id:"newsletter",      icon:<Send size={18}/>,            label:"Newsletter"      },
];

export default function AdminPanel() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [addingProduct,  setAddingProduct]  = useState(false);

  // Derive active tab from URL: /admin → dashboard, /admin/customers → customers …
  const seg = pathname.split("/")[2] || "";
  const urlTab = seg || "dashboard";
  // "add-product" is internal-only; nav highlight stays on "products"
  const tab = addingProduct ? "add-product" : urlTab;
  const activeNav = addingProduct ? "products" : urlTab;

  const payload      = getTokenPayload();
  const adminName    = payload?.name || payload?.email || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  function navTo(id) {
    setAddingProduct(false);
    setSidebarOpen(false);
    navigate(id === "dashboard" ? "/admin" : `/admin/${id}`);
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setAddingProduct(true);
  }

  function handleEditSuccess() {
    setEditingProduct(null);
    setAddingProduct(false);
    navigate("/admin/products");
  }

  const headerLabel = tab === "dashboard"
    ? `Good Morning, ${adminName.split(" ")[0]}`
    : tab === "add-product"
      ? (editingProduct ? "Edit Product" : "Add Product")
      : NAV.find(n => n.id === tab)?.label ?? "";

  const PAGES = {
    dashboard:       <Dashboard />,
    customers:       <CustomersTab />,
    analytics:       <AnalyticsTab />,
    orders:          <AdminOrdersTab />,
    products:        <ProductsTab onEdit={handleEdit} />,
    categories:      <CategoriesTab />,
    reviews:         <ReviewsTab />,
    banners:         <BannersTab />,
    todayspick:      <TodaysPickTab />,
    recommendations: <RecommendationsTab />,
    contacts:        <ContactsTab />,
    announcement:    <AnnouncementTab />,
    newsletter:      <NewsletterTab />,
    "add-product":   <AddProductForm key={editingProduct?._id ?? "new"} initialData={editingProduct} onSuccess={handleEditSuccess} />,
  };

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }} className="flex">

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0"
        style={{
          width:"220px",
          background:"var(--color-charcoal)",
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}>
        <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor:"var(--color-charcoal)" }}>
          <img src={TechComputerLogo} alt="Tech Computer" className="w-12 h-12 object-contain bg-white" style={{ border:"2px solid var(--color-charcoal)" }} />
          <div>
            <p style={{ fontFamily:"Georgia, serif", color:"var(--color-beige)" }} className="font-bold leading-none">Tech Computer</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">Admin Panel</p>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(({ id, icon, label }) => (
            <button key={id} onClick={() => navTo(id)}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all text-left"
              style={{
                color:      activeNav === id ? "var(--color-beige)" : "var(--color-olive)",
                background: activeNav === id ? "rgba(217,119,6,0.12)" : "transparent",
                borderLeft: activeNav === id ? "3px solid var(--color-olive)" : "3px solid transparent",
              }}>
              <span style={{ color: activeNav === id ? "var(--color-olive)" : "var(--color-olive)" }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t" style={{ borderColor:"var(--color-charcoal)" }}>
          <div className="flex items-center gap-2 mb-3">
            <div style={{ background:"var(--color-olive)" }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
              {adminInitial}
            </div>
            <div className="min-w-0">
              <p style={{ color:"var(--color-beige)" }} className="text-xs font-semibold truncate">{adminName}</p>
              <p style={{ color:"var(--color-olive)" }} className="text-xs">Admin</p>
            </div>
          </div>
          <button onClick={() => { clearAuth(); navigate("/login"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium hover:opacity-70"
            style={{ color:"var(--color-olive)" }}>
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft:"220px" }}>

        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
          style={{ background:"white", borderColor:"var(--color-border)" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="lg:hidden p-1.5 rounded-lg hover:opacity-70"
              style={{ color:"var(--color-charcoal)" }}>
              <Menu size={20}/>
            </button>
            <div>
              <h1 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold capitalize">
                {headerLabel}
              </h1>
              <p style={{ color:"var(--color-olive)" }} className="text-xs">
                {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* <button className="relative p-2 rounded-full hover:opacity-70" style={{ color:"var(--color-charcoal)" }}>
              <Bell size={18}/>
              <span style={{ background:"#dc2626" }} className="absolute top-1 right-1 w-2 h-2 rounded-full" />
            </button> */}
            <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}>
              <Home size={13}/> View Store
            </a>
          </div>
        </header>

        <main className="flex-1 p-6">
          {PAGES[tab]}
        </main>
      </div>
    </div>
  );
}

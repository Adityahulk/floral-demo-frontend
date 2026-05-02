import { useState, useEffect } from "react";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Gift } from "lucide-react";
import Hero from "../components/Hero";
import CartDrawer from "../components/CartDrawer";
import Testimonials from "../components/Testimonials";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PromoBanner from "../components/PromoBanner";

const BASE = "http://localhost:3001";

function FeaturesBar() {
  const items = [
    { icon: <Truck size={20} />, title: "Free Delivery", sub: "On orders above ₹999" },
    { icon: <RefreshCw size={20} />, title: "Easy Returns", sub: "7-day return policy" },
    { icon: <ShieldCheck size={20} />, title: "100% Fresh", sub: "Quality guaranteed" },
    { icon: <Gift size={20} />, title: "Gift Wrapping", sub: "Complimentary service" },
  ];
  return (
    <section style={{ background: "#4a3728" }} className="py-5">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3" style={{ color: "#f5e6d3" }}>
            <div className="opacity-80 shrink-0">{icon}</div>
            <div>
              <p className="font-semibold text-sm">{title}</p>
              <p className="text-xs opacity-60">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border animate-pulse" style={{ borderColor: "#f0e4d8" }}>
      <div className="bg-stone-200" style={{ aspectRatio: "4/5" }} />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-stone-200 rounded w-1/3" />
        <div className="h-4 bg-stone-200 rounded w-3/4" />
        <div className="h-3 bg-stone-200 rounded w-1/2" />
        <div className="h-4 bg-stone-200 rounded w-1/4 mt-2" />
      </div>
    </div>
  );
}

function Products({ products = [], tabs = ["All"], loading = false, error = false, wished, onWish, onCart }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("All");
  const filtered = tab === "All"
    ? products
    : products.filter(p => p.category?.name === tab);

  return (
    <section className="py-16 bg-white" id="shop">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-2">
              Hand-Picked For You
            </p>
            <h2
              style={{ fontFamily: "Georgia,serif", color: "#3a2416" }}
              className="text-3xl sm:text-4xl font-bold"
            >
              Featured Flowers
            </h2>
          </div>
          <a
            onClick={() => navigate("/products")}
            style={{ color: "#c97d5b" }}
            className="text-sm font-semibold flex items-center gap-1 cursor-pointer"
          >
            View All <ArrowRight size={14} />
          </a>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-1.5 rounded-full text-sm font-medium border transition-all"
              style={
                tab === t
                  ? { background: "#4a3728", color: "white", borderColor: "#4a3728" }
                  : { borderColor: "#e8d5c4", color: "#7a5c4a" }
              }
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array(8).fill(null).map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : error ? (
          <p style={{ color: "#9c7a62" }} className="text-center py-12">Unable to load products. Please try again later.</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#9c7a62" }} className="text-center py-12">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map(p => (
              <ProductCard
                key={p._id}
                p={p}
                wished={wished.has(p._id)}
                onWish={onWish}
                onCart={onCart}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section style={{ background: "#fdf8f3" }} className="py-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        <span className="text-4xl block mb-4">💌</span>
        <h2 style={{ fontFamily: "Georgia,serif", color: "#3a2416" }} className="text-3xl font-bold mb-3">Stay In Bloom</h2>
        <p style={{ color: "#7a5c4a" }} className="mb-8">
          Subscribe for seasonal offers & floral inspiration. Get 10% off your first order.
        </p>
        {done ? (
          <p style={{ color: "#c97d5b" }} className="font-semibold">🌸 Thank you! Check your inbox for a special welcome gift.</p>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full border text-sm outline-none"
              style={{ borderColor: "#e8d5c4" }}
            />
            <button
              onClick={() => email && setDone(true)}
              style={{ background: "#c97d5b" }}
              className="text-white px-7 py-3 rounded-full font-semibold text-sm hover:opacity-90 whitespace-nowrap"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  const { addToCart } = useCart();
  const [wished, setWished] = useState(new Set());
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/products`).then(r => r.json()),
      fetch(`${BASE}/api/categories`).then(r => r.json()),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const todaysPick = products.length > 0
    ? products.reduce((best, p) =>
        (p.rating?.average ?? 0) > (best.rating?.average ?? 0) ? p : best,
        products[0]
      )
    : null;

  const tabs = ["All", ...categories.map(c => c.name)];

  function handleWish(id) {
    setWished(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  }

  function handleCart(p) {
    addToCart(p, 1);
    setCartOpen(true);
  }

  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#fdf8f3" }}>
      <Hero todaysPick={todaysPick} />
      <FeaturesBar />
      <Categories categories={categories} loading={loading} />
      <Products
        products={products}
        tabs={tabs}
        loading={loading}
        error={error}
        wished={wished}
        onWish={handleWish}
        onCart={handleCart}
      />
      <PromoBanner />
      <Testimonials />
      <Newsletter />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

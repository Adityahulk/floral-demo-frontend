# Home Page Dynamic Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all hardcoded static data on the Home page with live data from the backend API, so real products and categories added via the Admin panel appear on the homepage.

**Architecture:** `Home.jsx` fetches `/api/products` and `/api/categories` in parallel on mount, derives `todaysPick` (highest-rated product) and `tabs` (category names) from responses, and passes them as props to child components. `CartDrawer` already reads from `CartContext` — `Home.jsx` calls `addToCart` from that context instead of managing a local cart array.

**Tech Stack:** React 18, Vite, React Router v6, Tailwind CSS, backend at `http://localhost:3001`

---

## Files Changed

| File | Change |
|---|---|
| `src/components/ProductCard.jsx` | Fix `p.id → p._id`, `p.rating → p.rating?.average`, `p.category → p.category?.name` |
| `src/components/Categories.jsx` | Accept `categories` + `loading` props; remove StaticVariables import; add skeleton |
| `src/components/Hero.jsx` | Accept `todaysPick` prop; replace hardcoded card with real data |
| `src/pages/Home.jsx` | Fetch APIs, derive todaysPick + tabs, use CartContext, pass all props down |

---

### Task 1: Fix ProductCard field mapping

ProductCard has three field references that match the old static shape. Fix them before wiring up the API data so ProductCard works correctly with real product objects.

**Files:**
- Modify: `src/components/ProductCard.jsx`

- [ ] **Step 1: Replace ProductCard.jsx with the corrected version**

```jsx
import { useState } from "react";
import { Heart, ShoppingCart } from "react-feather";
import { Star } from "lucide-react";
import { BADGE_STYLES, fmt } from "../constants/StaticVariables";
import { useNavigate } from "react-router-dom";

function Stars({ n, size = 12 }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size}
          className={i <= Math.round(n) ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"} />
      ))}
    </span>
  );
}

export default function ProductCard({ p, wished, onWish, onCart }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const disc = p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer"
      style={{
        borderColor: "#f0e4d8",
        boxShadow: hovered ? "0 20px 40px rgba(58,36,22,0.12)" : "0 2px 8px rgba(58,36,22,0.06)",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: "4/5" }}>
        <img
          src={p?.images?.[0]}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
        {p?.badge && (
          <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-0.5 rounded-full ${BADGE_STYLES[p.badge]}`}>
            {p.originalPrice ? `-${disc}%` : p.badge}
          </span>
        )}
        <button
          onClick={() => onWish(p._id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow hover:scale-110 transition-transform"
        >
          <Heart size={14} className={wished ? "fill-rose-500 text-rose-500" : "text-stone-400"} />
        </button>
        <div
          className="absolute inset-x-0 bottom-0 transition-transform duration-300"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)" }}
        >
          <button
            onClick={() => onCart(p)}
            style={{ background: "#4a3728" }}
            className="w-full py-3 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4">
        <p style={{ color: "#9c7a62" }} className="text-xs mb-1">
          {p.category?.name ?? ""}
        </p>
        <h3
          style={{ fontFamily: "Georgia,serif", color: "#3a2416" }}
          className="font-semibold text-sm mb-2 truncate"
        >
          {p.name}
        </h3>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars n={p.rating?.average ?? 0} size={12} />
          <span style={{ color: "#9c7a62" }} className="text-xs">({p.reviews ?? 0})</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span style={{ color: "#c97d5b" }} className="font-bold">{fmt(p.price)}</span>
            {p.originalPrice && (
              <span className="text-xs text-stone-400 line-through">{fmt(p.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={() => onCart(p)}
            style={{ background: "#f5e6d3" }}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <ShoppingCart size={14} style={{ color: "#c97d5b" }} />
          </button>
        </div>
        <button
          onClick={() => navigate(`/category/${p.category?._id}/${p._id}`)}
          style={{ background: "#4a3728" }}
          className="w-full py-2 my-2 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90"
        >
          View Details
        </button>
      </div>
    </div>
  );
}
```

> **Note:** `Stars` is defined locally here because `lucide-react` does not export a `Stars` component — only `Star`. The old import `import { Stars } from "lucide-react"` was silently broken.

- [ ] **Step 2: Commit**

```bash
git add src/components/ProductCard.jsx
git commit -m "fix: update ProductCard fields for API shape (_id, rating.average, category.name)"
```

---

### Task 2: Update Categories component to accept props

Remove the hardcoded `CATEGORIES` import and accept real data via props. Add a loading skeleton.

**Files:**
- Modify: `src/components/Categories.jsx`

- [ ] **Step 1: Replace Categories.jsx**

```jsx
export default function Categories({ categories = [], loading = false }) {
  if (loading) {
    return (
      <section style={{ background: "#fdf8f3" }} className="py-16" id="collections">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-2">Browse By Type</p>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#3a2416" }} className="text-3xl sm:text-4xl font-bold">Our Collections</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(5).fill(null).map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse bg-stone-200" style={{ aspectRatio: "3/4" }} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section style={{ background: "#fdf8f3" }} className="py-16" id="collections">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <p style={{ color: "#c97d5b" }} className="text-xs uppercase tracking-widest font-semibold mb-2">Browse By Type</p>
          <h2 style={{ fontFamily: "Georgia,serif", color: "#3a2416" }} className="text-3xl sm:text-4xl font-bold">Our Collections</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map(({ _id, name, img }) => (
            <a key={_id} href="#" className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ aspectRatio: "3/4" }}>
              <img src={img} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(58,36,22,0.8), transparent)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p style={{ fontFamily: "Georgia,serif" }} className="text-white font-semibold text-sm">{name}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Categories.jsx
git commit -m "feat: Categories accepts props from API, removes static import, adds loading skeleton"
```

---

### Task 3: Update Hero to show real "Today's Pick"

Accept a `todaysPick` prop and display its name and price in the floating card. Show `—` while data is loading.

**Files:**
- Modify: `src/components/Hero.jsx`

- [ ] **Step 1: Replace Hero.jsx**

```jsx
import { ArrowRight } from "lucide-react";
import { fmt } from "../constants/StaticVariables";

export default function Hero({ todaysPick = null }) {
  return (
    <section style={{ background: "#fdf8f3" }} className="overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 items-center min-h-screen py-12 gap-10">
          <div className="order-2 lg:order-1">
            <span
              style={{ background: "#f5e6d3", color: "#c97d5b" }}
              className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-5"
            >
              ✨ New Collection 2025
            </span>
            <h1
              style={{ fontFamily: "Georgia,serif", color: "#3a2416" }}
              className="text-5xl xl:text-6xl font-bold leading-tight mb-5"
            >
              Flowers That<br />
              <span style={{ color: "#c97d5b" }} className="italic">Tell Your</span><br />
              Story
            </h1>
            <p style={{ color: "#7a5c4a" }} className="text-lg leading-relaxed mb-8 max-w-md">
              Handcrafted bouquets & floral arrangements delivered fresh to your doorstep. Because every moment deserves beauty.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#shop"
                style={{ background: "#c97d5b" }}
                className="inline-flex items-center gap-2 text-white px-7 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
              >
                Shop Now <ArrowRight size={16} />
              </a>
              <a
                href="#collections"
                style={{ border: "2px solid #c97d5b", color: "#c97d5b" }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold hover:opacity-70 transition-opacity"
              >
                Our Collections
              </a>
            </div>
            <div className="flex gap-8 pt-8 border-t" style={{ borderColor: "#e8d5c4" }}>
              {[["2K+", "Happy Customers"], ["500+", "Flower Varieties"], ["4.9★", "Avg Rating"]].map(([n, l]) => (
                <div key={l}>
                  <p style={{ fontFamily: "Georgia,serif", color: "#4a3728" }} className="text-2xl font-bold">{n}</p>
                  <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">{l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2 relative flex justify-center">
            <div className="relative w-72 h-80 sm:w-96 sm:h-[28rem]">
              <div style={{ background: "#f5e6d3" }} className="absolute inset-6 rounded-full" />
              <img
                src="https://flowergiftkorea.com/wp-content/uploads/2016/05/ADB42A7F-D38F-4A75-80DE-6F10E4844B26.jpg"
                alt="Bouquet"
                className="relative z-10 w-full h-full object-cover"
                style={{ borderRadius: "40% 60% 60% 40% / 50% 40% 60% 50%" }}
              />
              <div className="absolute top-4 -right-2 z-20 bg-white rounded-2xl shadow-xl p-3 w-36">
                <p style={{ color: "#9c7a62" }} className="text-xs">Today's Pick</p>
                <p
                  style={{ fontFamily: "Georgia,serif", color: "#4a3728" }}
                  className="font-bold text-sm truncate"
                >
                  {todaysPick ? todaysPick.name : "—"}
                </p>
                <p style={{ color: "#c97d5b" }} className="font-semibold text-sm">
                  {todaysPick ? fmt(todaysPick.price) : ""}
                </p>
              </div>
              <div className="absolute -bottom-2 -left-2 z-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2 w-40">
                <div
                  style={{ background: "#f5e6d3" }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0"
                >
                  🚚
                </div>
                <div>
                  <p style={{ color: "#9c7a62" }} className="text-xs">Same Day</p>
                  <p style={{ color: "#4a3728" }} className="text-xs font-bold">Free Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.jsx
git commit -m "feat: Hero Today's Pick card driven by todaysPick prop"
```

---

### Task 4: Wire up Home.jsx — fetch APIs, pass everything down

This is the main integration step. `Home.jsx` fetches both APIs in parallel, derives `todaysPick` and `tabs`, connects to `CartContext` (replaces the old local cart array), and passes all data to children.

**Important context:**
- `CartDrawer` already reads from `CartContext` (`useCart`) — it ignores any `cart` / `onRemove` props. The local `cart` state and `handleRemove` in the old `Home.jsx` were dead code.
- `CartContext.addToCart(product, qty)` already uses `product._id` and `product.images?.[0]` — no changes needed to context.
- API shapes: `GET /api/products` → `{ data: [...] }`, `GET /api/categories` → `{ data: [...] }`

**Files:**
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Replace Home.jsx**

```jsx
import { useState, useEffect } from "react";
import { ArrowRight, Truck, RefreshCw, ShieldCheck, Gift } from "lucide-react";
import Hero from "../components/Hero";
import CartDrawer from "../components/CartDrawer";
import Testimonials from "../components/Testimonials";
import ProductCard from "../components/ProductCard";
import Categories from "../components/Categories";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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

function Products({ products = [], tabs = ["All"], loading = false, wished, onWish, onCart }) {
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

function PromoBanner() {
  return (
    <section style={{ background: "#fdf8f3" }} className="py-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        {[
          { label: "Special Event", title: "Wedding Florals", img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80", btn: "Explore" },
          { label: "Long Lasting", title: "Dried Flower Art", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80", btn: "Discover" },
        ].map(({ label, title, img, btn }) => (
          <div key={title} className="group relative rounded-3xl overflow-hidden h-64 sm:h-72 cursor-pointer">
            <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0" style={{ background: "rgba(58,36,22,0.5)" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span style={{ color: "#f5c8a8" }} className="text-xs uppercase tracking-widest font-semibold mb-2">{label}</span>
              <h3 style={{ fontFamily: "Georgia,serif" }} className="text-white text-2xl font-bold mb-4">{title}</h3>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full text-sm font-semibold w-fit hover:opacity-90 transition-opacity"
                style={{ color: "#4a3728" }}
              >
                {btn} <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}
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

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/products`).then(r => r.json()),
      fetch(`${BASE}/api/categories`).then(r => r.json()),
    ])
      .then(([productsRes, categoriesRes]) => {
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      })
      .catch(() => {})
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
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: Home page fetches live products and categories, passes dynamic data to all sections"
```

---

### Task 5: Verify in browser

- [ ] **Step 1: Make sure backend is running**

The backend must be running at `http://localhost:3001`. Start it if needed:

```bash
cd "../backend" && node index.js
```

- [ ] **Step 2: Start the frontend dev server**

```bash
npm run dev
```

- [ ] **Step 3: Open the home page and check each section**

Open `http://localhost:5173` (or the port Vite prints).

Check these in order:

1. **Categories section** — should show real DB categories with correct images, no count text. During load: 5 grey skeleton blocks animate in.
2. **Product tabs** — should show "All" + real category names from DB. Clicking a tab should filter correctly.
3. **Featured Products grid** — real products with correct images, names, prices, badges. During load: 8 skeleton cards.
4. **Hero "Today's Pick" card** — shows the name and price of the highest-rated product (not "Rose Bouquet" unless that's actually in the DB).
5. **Wishlist** — clicking the heart on a product highlights it and does not throw a console error.
6. **Add to Cart** — clicking "Add to Cart" opens the cart drawer with the correct product (real name, image, price).
7. **View Details** — clicking "View Details" navigates to `/category/<categoryId>/<productId>` without crashing.

- [ ] **Step 4: Check browser console**

No `undefined` field warnings, no React key warnings, no 404 errors for API calls.

# Dynamic PromoBanner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Home page PromoBanner section dynamic — admin picks 2 categories from the admin panel, those categories render as banners on the frontend.

**Architecture:** A singleton `BannerConfig` MongoDB document stores 2 category IDs. `GET /api/banners` returns the 2 populated categories. The frontend `PromoBanner.jsx` fetches this endpoint and renders category image/name/desc. Admin panel gets a new "Banners" tab with 2 select dropdowns and a save button.

**Tech Stack:** React 18, Vite, Tailwind CSS, Express, Mongoose, MongoDB. Backend at `http://localhost:3001`. Both repos in same monorepo: backend at `c:\projects\fl\Floral Studio\backend`, frontend at `c:\projects\fl\Floral Studio\frontend`.

---

## Files

| File | Type |
|---|---|
| `backend/models/banner.model.js` | Create |
| `backend/controllers/banner.controllers.js` | Create |
| `backend/routes/banner.routes.js` | Create |
| `backend/index.js` | Modify |
| `src/components/PromoBanner.jsx` | Create |
| `src/pages/Home.jsx` | Modify |
| `src/pages/AdminSection/AdminTabs/BannersTab.jsx` | Create |
| `src/pages/AdminSection/AdminPanel.jsx` | Modify |

---

### Task 1: Backend — BannerConfig model, controllers, routes, register

Create the full backend stack for banner config in one commit. All 4 files go together.

**Files:**
- Create: `c:\projects\fl\Floral Studio\backend\models\banner.model.js`
- Create: `c:\projects\fl\Floral Studio\backend\controllers\banner.controllers.js`
- Create: `c:\projects\fl\Floral Studio\backend\routes\banner.routes.js`
- Modify: `c:\projects\fl\Floral Studio\backend\index.js`

- [ ] **Step 1: Create `backend/models/banner.model.js`**

```js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  banners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
}, { timestamps: true });

export default mongoose.model("BannerConfig", bannerSchema);
```

- [ ] **Step 2: Create `backend/controllers/banner.controllers.js`**

```js
import BannerConfig from "../models/banner.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getBanners = asyncHandler(async (req, res) => {
  const config = await BannerConfig.findOne().populate("banners", "_id name img desc color");
  if (!config || config.banners.length === 0) {
    return res.status(200).json({ success: true, data: [] });
  }
  res.status(200).json({ success: true, data: config.banners });
});

export const updateBanners = asyncHandler(async (req, res) => {
  const { banners } = req.body;
  if (!Array.isArray(banners) || banners.length !== 2 || banners.some(id => !id)) {
    return res.status(400).json({ success: false, message: "Exactly 2 category IDs are required" });
  }
  const config = await BannerConfig.findOneAndUpdate(
    {},
    { banners },
    { upsert: true, new: true }
  ).populate("banners", "_id name img desc color");
  res.status(200).json({ success: true, data: config.banners });
});
```

- [ ] **Step 3: Create `backend/routes/banner.routes.js`**

```js
import express from "express";
import { getBanners, updateBanners } from "../controllers/banner.controllers.js";

const router = express.Router();

router.get("/banners", getBanners);
router.put("/banners", updateBanners);

export default router;
```

- [ ] **Step 4: Register banner routes in `backend/index.js`**

Add these two lines. First line goes with the other imports at the top, second line goes after `app.use("/api", reviewRoutes);`:

```js
// Add to imports (after reviewRoutes import):
import bannerRoutes from './routes/banner.routes.js';

// Add to route registrations (after app.use("/api", reviewRoutes);):
app.use("/api", bannerRoutes);
```

The full updated imports + registrations block in `backend/index.js` should look like:

```js
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import categoryRoutes from './routes/catrgory.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import orderRoutes from './routes/order.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import reviewRoutes from './routes/review.routes.js';
import bannerRoutes from './routes/banner.routes.js';
```

```js
app.use('/api/auth', authRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", uploadRoutes);
app.use("/api", orderRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", reviewRoutes);
app.use("/api", bannerRoutes);
```

- [ ] **Step 5: Test the endpoints manually**

Restart the backend server, then run:

```bash
# GET should return empty array (no config yet)
curl http://localhost:3001/api/banners
# Expected: {"success":true,"data":[]}

# PUT with 2 real category IDs from your DB (replace the IDs below)
curl -X PUT http://localhost:3001/api/banners \
  -H "Content-Type: application/json" \
  -d "{\"banners\":[\"CATEGORY_ID_1\",\"CATEGORY_ID_2\"]}"
# Expected: {"success":true,"data":[{...category1...},{...category2...}]}

# GET again — should now return the 2 populated categories
curl http://localhost:3001/api/banners
# Expected: {"success":true,"data":[{name,img,desc,...},{name,img,desc,...}]}
```

- [ ] **Step 6: Commit**

```bash
cd "c:/projects/fl/Floral Studio/backend"
git add models/banner.model.js controllers/banner.controllers.js routes/banner.routes.js index.js
git commit -m "feat: add BannerConfig model, GET/PUT /api/banners endpoints"
```

---

### Task 2: Frontend — PromoBanner.jsx component

Extract PromoBanner from Home.jsx into its own file and make it fetch from the API.

**Files:**
- Create: `c:\projects\fl\Floral Studio\frontend\src\components\PromoBanner.jsx`

- [ ] **Step 1: Create `src/components/PromoBanner.jsx`**

```jsx
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const BASE = "http://localhost:3001";

export default function PromoBanner() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BASE}/api/banners`)
      .then(r => r.json())
      .then(res => setBanners(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section style={{ background: "#fdf8f3" }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl animate-pulse bg-stone-200 h-64 sm:h-72" />
          <div className="rounded-3xl animate-pulse bg-stone-200 h-64 sm:h-72" />
        </div>
      </section>
    );
  }

  if (banners.length === 0) return null;

  return (
    <section style={{ background: "#fdf8f3" }} className="py-16">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-6">
        {banners.map(category => (
          <div key={category._id} className="group relative rounded-3xl overflow-hidden h-64 sm:h-72 cursor-pointer">
            <img
              src={category.img}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0" style={{ background: "rgba(58,36,22,0.5)" }} />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <span style={{ color: "#f5c8a8" }} className="text-xs uppercase tracking-widest font-semibold mb-2 line-clamp-1">
                {category.desc}
              </span>
              <h3 style={{ fontFamily: "Georgia,serif" }} className="text-white text-2xl font-bold mb-4">
                {category.name}
              </h3>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full text-sm font-semibold w-fit hover:opacity-90 transition-opacity"
                style={{ color: "#4a3728" }}
              >
                Explore <ArrowRight size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/components/PromoBanner.jsx
git commit -m "feat: add PromoBanner component that fetches banners from API"
```

---

### Task 3: Frontend — Update Home.jsx

Remove the inline static `PromoBanner` function from `Home.jsx` and import the new component.

**Files:**
- Modify: `c:\projects\fl\Floral Studio\frontend\src\pages\Home.jsx`

- [ ] **Step 1: Add PromoBanner import at the top of Home.jsx**

Add this import after the existing imports (around line 9, after the `useCart` import):

```js
import PromoBanner from "../components/PromoBanner";
```

- [ ] **Step 2: Remove the inline PromoBanner function**

Find and delete the entire `PromoBanner` function block in `Home.jsx`. It looks like this (approximately lines 124–152):

```jsx
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
```

Delete this entire block. The `<PromoBanner />` usage in the JSX return stays unchanged.

- [ ] **Step 3: Verify `ArrowRight` import**

After removing the inline PromoBanner, check if `ArrowRight` is still used elsewhere in `Home.jsx` (it is — in the Products "View All" link). If it is still used, keep the import. It should remain in the existing lucide-react import line.

- [ ] **Step 4: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/Home.jsx
git commit -m "refactor: replace inline PromoBanner with imported dynamic component"
```

---

### Task 4: Admin — BannersTab component

Create the admin tab where the admin selects 2 categories as banners and saves.

**Files:**
- Create: `c:\projects\fl\Floral Studio\frontend\src\pages\AdminSection\AdminTabs\BannersTab.jsx`

- [ ] **Step 1: Create `src/pages/AdminSection/AdminTabs/BannersTab.jsx`**

```jsx
import { useState, useEffect } from "react";
import { Image, Save } from "lucide-react";
import { BASE } from "./shared";

export default function BannersTab() {
  const [categories, setCategories] = useState([]);
  const [banner1, setBanner1] = useState("");
  const [banner2, setBanner2] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/api/categories`).then(r => r.json()),
      fetch(`${BASE}/api/banners`).then(r => r.json()),
    ]).then(([catsRes, bannersRes]) => {
      const cats = Array.isArray(catsRes.data) ? catsRes.data : [];
      const current = Array.isArray(bannersRes.data) ? bannersRes.data : [];
      setCategories(cats);
      if (current[0]) setBanner1(current[0]._id);
      if (current[1]) setBanner2(current[1]._id);
    }).catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const isDuplicate = banner1 && banner2 && banner1 === banner2;

  async function handleSave() {
    if (isDuplicate) return;
    if (!banner1 || !banner2) {
      setError("Please select both banners");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`${BASE}/api/banners`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ banners: [banner1, banner2] }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 rounded-full animate-spin"
          style={{ borderColor: "#c97d5b", borderTopColor: "transparent" }} />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <div className="bg-white rounded-2xl border p-6" style={{ borderColor: "#e8d5c4" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "#f5e6d3" }}>
            <Image size={18} style={{ color: "#c97d5b" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#3a2416" }} className="font-bold">Banner Collection</h2>
            <p style={{ color: "#9c7a62" }} className="text-xs">Choose 2 categories to feature on the home page</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: "Banner 1", value: banner1, onChange: setBanner1 },
            { label: "Banner 2", value: banner2, onChange: setBanner2 },
          ].map(({ label, value, onChange }) => (
            <div key={label}>
              <label style={{ color: "#5c4033" }} className="block text-sm font-medium mb-1.5">
                {label}
              </label>
              <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#e8d5c4", color: "#3a2416", background: "#fdf8f3" }}
              >
                <option value="">— Select a category —</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {isDuplicate && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#c97d5b" }}>
            Please select two different categories
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>
        )}

        {success && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#16a34a" }}>
            ✓ Banners updated successfully
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || isDuplicate || !banner1 || !banner2}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: "#c97d5b", opacity: (saving || isDuplicate || !banner1 || !banner2) ? 0.5 : 1 }}
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Banners"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/AdminSection/AdminTabs/BannersTab.jsx
git commit -m "feat: add BannersTab admin UI to select and save 2 banner categories"
```

---

### Task 5: Admin — Wire BannersTab into AdminPanel

Add the Banners nav item and page to the admin panel.

**Files:**
- Modify: `c:\projects\fl\Floral Studio\frontend\src\pages\AdminSection\AdminPanel.jsx`

- [ ] **Step 1: Add BannersTab import**

At the top of `AdminPanel.jsx`, add after the existing tab imports:

```js
import BannersTab from "./AdminTabs/BannersTab";
```

- [ ] **Step 2: Add `Image` to lucide-react import**

Find the existing lucide-react import line:
```js
import {
  LayoutDashboard, Users, BarChart2, Package, Eye,
  Star, Bell, Menu, Home, LogOut,
} from "lucide-react";
```

Add `Image` to it:
```js
import {
  LayoutDashboard, Users, BarChart2, Package, Eye,
  Star, Bell, Menu, Home, LogOut, Image,
} from "lucide-react";
```

- [ ] **Step 3: Add Banners to the NAV array**

Find the `NAV` array. Add the banners entry after reviews:

```js
const NAV = [
  { id:"dashboard", icon:<LayoutDashboard size={18}/>, label:"Dashboard" },
  { id:"customers", icon:<Users size={18}/>,           label:"Customers" },
  { id:"analytics", icon:<BarChart2 size={18}/>,       label:"Analytics" },
  { id:"orders",    icon:<Package size={18}/>,         label:"Orders"    },
  { id:"products",  icon:<Eye size={18}/>,             label:"Products"  },
  { id:"reviews",   icon:<Star size={18}/>,            label:"Reviews"   },
  { id:"banners",   icon:<Image size={18}/>,           label:"Banners"   },
];
```

- [ ] **Step 4: Add banners to the PAGES object**

Find the `PAGES` object. Add banners entry after reviews:

```js
const PAGES = {
  dashboard:     <Dashboard />,
  customers:     <CustomersTab />,
  analytics:     <AnalyticsTab />,
  orders:        <AdminOrdersTab />,
  products:      <ProductsTab onEdit={handleEdit} />,
  reviews:       <ReviewsTab />,
  banners:       <BannersTab />,
  "add-product": <AddProductForm key={editingProduct?._id ?? "new"} initialData={editingProduct} onSuccess={handleEditSuccess} />,
};
```

- [ ] **Step 5: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/AdminSection/AdminPanel.jsx
git commit -m "feat: add Banners tab to admin panel sidebar and routing"
```

---

### Task 6: Verify end-to-end

- [ ] **Step 1: Restart backend**

```bash
cd "c:/projects/fl/Floral Studio/backend"
node index.js
```

Confirm in console: `Server is running on port 3001` with no import errors.

- [ ] **Step 2: Start frontend**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
npm run dev
```

- [ ] **Step 3: Admin flow — set banners**

1. Open `http://localhost:5173/admin/banners`
2. "Banners" appears in the sidebar
3. Both dropdowns show real categories from DB
4. Select two different categories
5. Click "Save Banners" — button shows "Saving..." then success message "✓ Banners updated successfully"
6. Refresh the page — the saved categories are pre-selected in the dropdowns

- [ ] **Step 4: Frontend — verify banner renders**

1. Open `http://localhost:5173`
2. PromoBanner section shows the 2 selected categories with their real images and names
3. Loading: 2 grey skeleton blocks animate while fetching
4. Try selecting different categories in admin and refreshing the home page — banners update

- [ ] **Step 5: Edge cases**

1. Select same category twice → "Please select two different categories" warning appears, Save button is disabled
2. Leave one dropdown unselected → Save button is disabled
3. If backend is down → PromoBanner section renders nothing (no crash)

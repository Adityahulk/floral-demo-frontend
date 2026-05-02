# Today's Pick & Recommendations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin picks 1 product as "Today's Pick" (shown in Hero with real image) and up to 4 products as Recommendations (shown in "You May Also Like" on product detail page, current product excluded).

**Architecture:** Two MongoDB singleton configs (`PickConfig`, `RecommendationsConfig`) with GET+PUT routes. Same pattern as existing `BannerConfig` — `configType` discriminator, `findOneAndUpdate` upsert, `asyncHandler` wrapper. Frontend fetches from these APIs; admin manages via two new tabs.

**Tech Stack:** React 18, Vite, Tailwind CSS, Express, Mongoose, MongoDB. Backend at `http://localhost:3001`. Frontend repo: `c:\projects\fl\Floral Studio\frontend`. Backend repo: `c:\projects\fl\Floral Studio\backend`.

---

## Files

| File | Type |
|---|---|
| `backend/models/pick.model.js` | Create |
| `backend/models/recommendations.model.js` | Create |
| `backend/controllers/pick.controllers.js` | Create |
| `backend/controllers/recommendations.controllers.js` | Create |
| `backend/routes/pick.routes.js` | Create |
| `backend/routes/recommendations.routes.js` | Create |
| `backend/index.js` | Modify — register 2 new route sets |
| `src/components/Hero.jsx` | Modify — use todaysPick.images[0] |
| `src/pages/Home.jsx` | Modify — fetch /api/todayspick, remove reduce |
| `src/pages/ProductSection/ProductDetail.jsx` | Modify — fetch /api/recommendations, filter, render |
| `src/pages/AdminSection/AdminTabs/TodaysPickTab.jsx` | Create |
| `src/pages/AdminSection/AdminTabs/RecommendationsTab.jsx` | Create |
| `src/pages/AdminSection/AdminPanel.jsx` | Modify — add 2 nav entries + pages |

---

### Task 1: Backend — Today's Pick API

**Files:**
- Create: `c:\projects\fl\Floral Studio\backend\models\pick.model.js`
- Create: `c:\projects\fl\Floral Studio\backend\controllers\pick.controllers.js`
- Create: `c:\projects\fl\Floral Studio\backend\routes\pick.routes.js`
- Modify: `c:\projects\fl\Floral Studio\backend\index.js`

- [ ] **Step 1: Create `backend/models/pick.model.js`**

```js
import mongoose from "mongoose";

const pickSchema = new mongoose.Schema({
  configType: { type: String, default: "todayspick" },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
}, { timestamps: true });

export default mongoose.model("PickConfig", pickSchema);
```

- [ ] **Step 2: Create `backend/controllers/pick.controllers.js`**

```js
import mongoose from "mongoose";
import PickConfig from "../models/pick.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getTodaysPick = asyncHandler(async (req, res) => {
  const config = await PickConfig.findOne({ configType: "todayspick" })
    .populate("product", "_id name price images rating");
  if (!config || !config.product) {
    return res.status(200).json({ success: true, data: null });
  }
  res.status(200).json({ success: true, data: config.product });
});

export const updateTodaysPick = asyncHandler(async (req, res) => {
  const { product } = req.body;
  if (!product || !mongoose.isValidObjectId(product)) {
    return res.status(400).json({ success: false, message: "A valid product ID is required" });
  }
  const config = await PickConfig.findOneAndUpdate(
    { configType: "todayspick" },
    { product },
    { upsert: true, new: true, runValidators: true }
  ).populate("product", "_id name price images rating");
  res.status(200).json({ success: true, data: config.product });
});
```

- [ ] **Step 3: Create `backend/routes/pick.routes.js`**

```js
import express from "express";
import { getTodaysPick, updateTodaysPick } from "../controllers/pick.controllers.js";

const router = express.Router();
router.get("/todayspick", getTodaysPick);
router.put("/todayspick", updateTodaysPick);
export default router;
```

- [ ] **Step 4: Register in `backend/index.js`**

Add import after the `bannerRoutes` import line:
```js
import pickRoutes from './routes/pick.routes.js';
```

Add route registration after `app.use("/api", bannerRoutes);` and before `app.use(errorHandler);`:
```js
app.use("/api", pickRoutes);
```

- [ ] **Step 5: Test endpoints**

Restart backend, then:
```bash
# GET — no config yet
curl http://localhost:3001/api/todayspick
# Expected: {"success":true,"data":null}

# PUT with a real product _id from your DB
curl -X PUT http://localhost:3001/api/todayspick \
  -H "Content-Type: application/json" \
  -d "{\"product\":\"REAL_PRODUCT_ID\"}"
# Expected: {"success":true,"data":{name,price,images,...}}

# GET again — should return the product
curl http://localhost:3001/api/todayspick
# Expected: {"success":true,"data":{_id,name,price,images,rating}}
```

- [ ] **Step 6: Commit**

```bash
cd "c:/projects/fl/Floral Studio/backend"
git add models/pick.model.js controllers/pick.controllers.js routes/pick.routes.js index.js
git commit -m "feat: add PickConfig model and GET/PUT /api/todayspick endpoints"
```

---

### Task 2: Backend — Recommendations API

**Files:**
- Create: `c:\projects\fl\Floral Studio\backend\models\recommendations.model.js`
- Create: `c:\projects\fl\Floral Studio\backend\controllers\recommendations.controllers.js`
- Create: `c:\projects\fl\Floral Studio\backend\routes\recommendations.routes.js`
- Modify: `c:\projects\fl\Floral Studio\backend\index.js`

- [ ] **Step 1: Create `backend/models/recommendations.model.js`**

```js
import mongoose from "mongoose";

const recommendationsSchema = new mongoose.Schema({
  configType: { type: String, default: "recommendations" },
  products: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    validate: {
      validator: v => v.length <= 4,
      message: "Maximum 4 recommended products allowed",
    },
  },
}, { timestamps: true });

export default mongoose.model("RecommendationsConfig", recommendationsSchema);
```

- [ ] **Step 2: Create `backend/controllers/recommendations.controllers.js`**

```js
import mongoose from "mongoose";
import RecommendationsConfig from "../models/recommendations.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.js";

export const getRecommendations = asyncHandler(async (req, res) => {
  const config = await RecommendationsConfig.findOne({ configType: "recommendations" })
    .populate("products", "_id name price images rating");
  if (!config || config.products.length === 0) {
    return res.status(200).json({ success: true, data: [] });
  }
  res.status(200).json({ success: true, data: config.products });
});

export const updateRecommendations = asyncHandler(async (req, res) => {
  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0 || products.length > 4) {
    return res.status(400).json({ success: false, message: "1 to 4 product IDs are required" });
  }
  if (products.some(id => !mongoose.isValidObjectId(id))) {
    return res.status(400).json({ success: false, message: "All product IDs must be valid" });
  }
  const unique = new Set(products);
  if (unique.size !== products.length) {
    return res.status(400).json({ success: false, message: "Duplicate product IDs are not allowed" });
  }
  const config = await RecommendationsConfig.findOneAndUpdate(
    { configType: "recommendations" },
    { products },
    { upsert: true, new: true, runValidators: true }
  ).populate("products", "_id name price images rating");
  res.status(200).json({ success: true, data: config.products });
});
```

- [ ] **Step 3: Create `backend/routes/recommendations.routes.js`**

```js
import express from "express";
import { getRecommendations, updateRecommendations } from "../controllers/recommendations.controllers.js";

const router = express.Router();
router.get("/recommendations", getRecommendations);
router.put("/recommendations", updateRecommendations);
export default router;
```

- [ ] **Step 4: Register in `backend/index.js`**

Add import after `pickRoutes` import:
```js
import recommendationsRoutes from './routes/recommendations.routes.js';
```

Add after `app.use("/api", pickRoutes);`:
```js
app.use("/api", recommendationsRoutes);
```

- [ ] **Step 5: Test endpoints**

```bash
# GET — empty
curl http://localhost:3001/api/recommendations
# Expected: {"success":true,"data":[]}

# PUT with 4 real product IDs
curl -X PUT http://localhost:3001/api/recommendations \
  -H "Content-Type: application/json" \
  -d "{\"products\":[\"ID1\",\"ID2\",\"ID3\",\"ID4\"]}"
# Expected: {"success":true,"data":[{...},{...},{...},{...}]}

# Duplicate test
curl -X PUT http://localhost:3001/api/recommendations \
  -H "Content-Type: application/json" \
  -d "{\"products\":[\"ID1\",\"ID1\"]}"
# Expected: {"success":false,"message":"Duplicate product IDs are not allowed"}
```

- [ ] **Step 6: Commit**

```bash
cd "c:/projects/fl/Floral Studio/backend"
git add models/recommendations.model.js controllers/recommendations.controllers.js routes/recommendations.routes.js index.js
git commit -m "feat: add RecommendationsConfig model and GET/PUT /api/recommendations endpoints"
```

---

### Task 3: Frontend — Fix Hero.jsx image

**Files:**
- Modify: `c:\projects\fl\Floral Studio\frontend\src\components\Hero.jsx`

The current Hero has a hardcoded image URL. Change it to use `todaysPick.images[0]` with the hardcoded URL as fallback.

- [ ] **Step 1: Read the file**

Read `src/components/Hero.jsx`. Find the `<img>` tag inside the `relative w-72 h-80` div. It currently looks like:
```jsx
<img
  src="https://flowergiftkorea.com/wp-content/uploads/2016/05/ADB42A7F-D38F-4A75-80DE-6F10E4844B26.jpg"
  alt="Bouquet"
  ...
/>
```

- [ ] **Step 2: Update the `src` attribute**

Change only the `src` attribute to use the todaysPick image with fallback:
```jsx
<img
  src={todaysPick?.images?.[0] ?? "https://flowergiftkorea.com/wp-content/uploads/2016/05/ADB42A7F-D38F-4A75-80DE-6F10E4844B26.jpg"}
  alt={todaysPick?.name ?? "Bouquet"}
  className="relative z-10 w-full h-full object-cover"
  style={{ borderRadius: "40% 60% 60% 40% / 50% 40% 60% 50%" }}
/>
```

No other changes to Hero.jsx.

- [ ] **Step 3: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/components/Hero.jsx
git commit -m "fix: use todaysPick product image in Hero, fall back to decorative image"
```

---

### Task 4: Frontend — Home.jsx fetches Today's Pick

**Files:**
- Modify: `c:\projects\fl\Floral Studio\frontend\src\pages\Home.jsx`

Currently Home.jsx derives `todaysPick` by `reduce` over products (highest rating). Replace this with a direct API fetch.

- [ ] **Step 1: Read the file**

Read `src/pages/Home.jsx`.

- [ ] **Step 2: Add `todaysPick` state**

In the `Home` component, find the existing state declarations:
```js
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
```

Add `todaysPick` state:
```js
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [todaysPick, setTodaysPick] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
```

- [ ] **Step 3: Add `/api/todayspick` to the Promise.all**

Find the existing `Promise.all` inside the `useEffect`:
```js
Promise.all([
  fetch(`${BASE}/api/products`, { signal: controller.signal }).then(r => r.json()),
  fetch(`${BASE}/api/categories`, { signal: controller.signal }).then(r => r.json()),
])
  .then(([productsRes, categoriesRes]) => {
    setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
    setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
  })
```

Replace with:
```js
Promise.all([
  fetch(`${BASE}/api/products`, { signal: controller.signal }).then(r => r.json()),
  fetch(`${BASE}/api/categories`, { signal: controller.signal }).then(r => r.json()),
  fetch(`${BASE}/api/todayspick`, { signal: controller.signal }).then(r => r.json()),
])
  .then(([productsRes, categoriesRes, pickRes]) => {
    setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
    setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
    setTodaysPick(pickRes.data ?? null);
  })
```

- [ ] **Step 4: Remove the `todaysPick` reduce derivation**

Find and delete this block (it appears after the `useEffect` closing brace):
```js
const todaysPick = products.length > 0
  ? products.reduce((best, p) =>
      (p.rating?.average ?? 0) > (best.rating?.average ?? 0) ? p : best,
      products[0]
    )
  : null;
```

The `todaysPick` variable is now state, so this derivation is no longer needed.

- [ ] **Step 5: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/Home.jsx
git commit -m "feat: fetch Today's Pick from /api/todayspick instead of deriving from products"
```

---

### Task 5: Frontend — ProductDetail.jsx dynamic recommendations

**Files:**
- Modify: `c:\projects\fl\Floral Studio\frontend\src\pages\ProductSection\ProductDetail.jsx`

Currently uses a hardcoded `RELATED` array with 3 fake products. Replace with real data from `/api/recommendations`, excluding the current product.

- [ ] **Step 1: Read the file**

Read `src/pages/ProductSection/ProductDetail.jsx`. Note:
- Line ~7: `import { useParams } from "react-router-dom"` — needs `useNavigate` added
- Lines ~40-44: `const RELATED = [...]` — this will be removed
- The component uses `productId` from `useParams()`
- The "You May Also Like" section maps over `RELATED` using `p.id`, `p.img`, `p.name`, `p.price`, `p.rating`

- [ ] **Step 2: Update react-router-dom import**

Find:
```js
import { useParams } from "react-router-dom";
```

Replace with:
```js
import { useParams, useNavigate } from "react-router-dom";
```

- [ ] **Step 3: Remove the `RELATED` constant**

Delete the entire `const RELATED = [...]` block (approximately lines 40-44).

- [ ] **Step 4: Add `useNavigate` and `recommendations` state inside the component**

At the top of the `ProductDetail` component function (after existing state declarations), add:
```js
const navigate = useNavigate();
const [recommendations, setRecommendations] = useState([]);
```

Make sure `useState` is already imported (it should be). If not, add it to the React import.

- [ ] **Step 5: Add recommendations fetch to the existing useEffect**

Find the existing `useEffect` that calls `getProductData()`:
```js
useEffect(() => {
  getProductData();
}, [productId]);
```

Replace with:
```js
useEffect(() => {
  getProductData();
  fetch("http://localhost:3001/api/recommendations")
    .then(r => r.json())
    .then(res => setRecommendations(Array.isArray(res.data) ? res.data : []))
    .catch(() => setRecommendations([]));
}, [productId]);
```

- [ ] **Step 6: Update the "You May Also Like" render**

Find the existing "You May Also Like" section. It currently maps over `RELATED` like:
```jsx
{RELATED.map(p => (
  <div key={p.id} className="group bg-white rounded-2xl ...">
    <div className="overflow-hidden aspect-square">
      <img src={p.img} alt={p.name} ... />
    </div>
    <div className="p-4">
      <p ...>{p.name}</p>
      <div ...>
        <span ...>{fmt(p.price)}</span>
        <Stars n={p.rating} size={12} />
      </div>
    </div>
  </div>
))}
```

Replace the entire map with:
```jsx
{recommendations
  .filter(p => p._id !== productId)
  .slice(0, 3)
  .map(p => (
    <div
      key={p._id}
      onClick={() => navigate(`/product/${p._id}`)}
      className="group bg-white rounded-2xl overflow-hidden border hover:shadow-lg transition-shadow cursor-pointer"
      style={{ borderColor: "#f0e4d8" }}
    >
      <div className="overflow-hidden aspect-square">
        <img
          src={p.images?.[0]}
          alt={p.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-4">
        <p style={{ color: "#3a2416", fontFamily: "Georgia, serif" }} className="font-semibold mb-1">{p.name}</p>
        <div className="flex items-center justify-between">
          <span style={{ color: "#c97d5b" }} className="font-bold">{fmt(p.price)}</span>
          <Stars n={p.rating?.average ?? 0} size={12} />
        </div>
      </div>
    </div>
  ))
}
```

Also add a guard: if `recommendations.filter(p => p._id !== productId).length === 0`, the whole section should not render. Wrap the entire "You May Also Like" `<div>` block:
```jsx
{recommendations.filter(p => p._id !== productId).length > 0 && (
  <div>
    <h2 ...>You May Also Like</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
      {/* map above */}
    </div>
  </div>
)}
```

- [ ] **Step 7: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/ProductSection/ProductDetail.jsx
git commit -m "feat: fetch You May Also Like from /api/recommendations, filter current product"
```

---

### Task 6: Admin — TodaysPickTab.jsx

**Files:**
- Create: `c:\projects\fl\Floral Studio\frontend\src\pages\AdminSection\AdminTabs\TodaysPickTab.jsx`

Reference: Read `src/pages/AdminSection/AdminTabs/BannersTab.jsx` to match the style patterns. Pattern: `BASE` from `./shared`, `authFetch` from `../../../utils/auth`, inline styles with `#3a2416`, `#9c7a62`, `#e8d5c4`, `#c97d5b`.

- [ ] **Step 1: Create the file**

```jsx
import { useState, useEffect, useRef } from "react";
import { Star, Save } from "lucide-react";
import { BASE } from "./shared";
import { authFetch } from "../../../utils/auth";

export default function TodaysPickTab() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const successTimerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`${BASE}/api/products`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${BASE}/api/todayspick`, { signal: controller.signal }).then(r => r.json()),
    ]).then(([productsRes, pickRes]) => {
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      if (pickRes.data?._id) setSelected(pickRes.data._id);
    }).catch(err => {
      if (err.name !== "AbortError") setError("Failed to load data");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => clearTimeout(successTimerRef.current);
  }, []);

  async function handleSave() {
    if (!selected) {
      setError("Please select a product");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await authFetch(`${BASE}/api/todayspick`, {
        method: "PUT",
        body: JSON.stringify({ product: selected }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");
      setSuccess(true);
      clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(false), 3000);
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
            <Star size={18} style={{ color: "#c97d5b" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#3a2416" }} className="font-bold">Today's Pick</h2>
            <p style={{ color: "#9c7a62" }} className="text-xs">Choose the featured product shown on the home page hero</p>
          </div>
        </div>

        <div>
          <label style={{ color: "#5c4033" }} className="block text-sm font-medium mb-1.5">
            Featured Product
          </label>
          <select
            value={selected}
            onChange={e => { setSelected(e.target.value); setError(""); }}
            className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
            style={{ borderColor: "#e8d5c4", color: "#3a2416", background: "#fdf8f3" }}
          >
            <option value="">— Select a product —</option>
            {products.map(p => (
              <option key={p._id} value={p._id}>{p.name} — ₹{p.price}</option>
            ))}
          </select>
        </div>

        {error && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>
        )}

        {success && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#16a34a" }}>
            ✓ Today's Pick updated successfully
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || !selected}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: "#c97d5b", opacity: (saving || !selected) ? 0.5 : 1 }}
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Pick"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/AdminSection/AdminTabs/TodaysPickTab.jsx
git commit -m "feat: add TodaysPickTab admin UI to select featured hero product"
```

---

### Task 7: Admin — RecommendationsTab.jsx

**Files:**
- Create: `c:\projects\fl\Floral Studio\frontend\src\pages\AdminSection\AdminTabs\RecommendationsTab.jsx`

Admin picks up to 4 products (4 slot dropdowns). Empty slots are allowed. Save filters out empty slots and sends only filled IDs. Duplicate guard: same product in 2+ slots → warning.

- [ ] **Step 1: Create the file**

```jsx
import { useState, useEffect, useRef } from "react";
import { Sparkles, Save } from "lucide-react";
import { BASE } from "./shared";
import { authFetch } from "../../../utils/auth";

const EMPTY = "";
const SLOTS = ["Slot 1", "Slot 2", "Slot 3", "Slot 4"];

export default function RecommendationsTab() {
  const [products, setProducts] = useState([]);
  const [slots, setSlots] = useState([EMPTY, EMPTY, EMPTY, EMPTY]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const successTimerRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    Promise.all([
      fetch(`${BASE}/api/products`, { signal: controller.signal }).then(r => r.json()),
      fetch(`${BASE}/api/recommendations`, { signal: controller.signal }).then(r => r.json()),
    ]).then(([productsRes, recsRes]) => {
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      const current = Array.isArray(recsRes.data) ? recsRes.data : [];
      setSlots([
        current[0]?._id ?? EMPTY,
        current[1]?._id ?? EMPTY,
        current[2]?._id ?? EMPTY,
        current[3]?._id ?? EMPTY,
      ]);
    }).catch(err => {
      if (err.name !== "AbortError") setError("Failed to load data");
    }).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  useEffect(() => {
    return () => clearTimeout(successTimerRef.current);
  }, []);

  const filled = slots.filter(Boolean);
  const hasDuplicate = filled.length !== new Set(filled).size;
  const hasNone = filled.length === 0;

  function updateSlot(index, value) {
    setSlots(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    setError("");
  }

  async function handleSave() {
    if (hasDuplicate || hasNone) return;
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await authFetch(`${BASE}/api/recommendations`, {
        method: "PUT",
        body: JSON.stringify({ products: filled }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Save failed");
      setSuccess(true);
      clearTimeout(successTimerRef.current);
      successTimerRef.current = setTimeout(() => setSuccess(false), 3000);
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
            <Sparkles size={18} style={{ color: "#c97d5b" }} />
          </div>
          <div>
            <h2 style={{ fontFamily: "Georgia,serif", color: "#3a2416" }} className="font-bold">Recommendations</h2>
            <p style={{ color: "#9c7a62" }} className="text-xs">Choose up to 4 products shown in "You May Also Like"</p>
          </div>
        </div>

        <div className="space-y-4">
          {SLOTS.map((label, i) => (
            <div key={label}>
              <label style={{ color: "#5c4033" }} className="block text-sm font-medium mb-1.5">
                {label}
              </label>
              <select
                value={slots[i]}
                onChange={e => updateSlot(i, e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                style={{ borderColor: "#e8d5c4", color: "#3a2416", background: "#fdf8f3" }}
              >
                <option value="">— Empty —</option>
                {products.map(p => (
                  <option key={p._id} value={p._id}>{p.name} — ₹{p.price}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {hasDuplicate && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>
            Please select different products in each slot
          </p>
        )}

        {hasNone && !hasDuplicate && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>
            Please select at least 1 product
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>
        )}

        {success && (
          <p className="mt-3 text-xs font-medium" style={{ color: "#16a34a" }}>
            ✓ Recommendations updated successfully
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving || hasDuplicate || hasNone}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity"
          style={{ background: "#c97d5b", opacity: (saving || hasDuplicate || hasNone) ? 0.5 : 1 }}
        >
          <Save size={14} />
          {saving ? "Saving..." : "Save Recommendations"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/AdminSection/AdminTabs/RecommendationsTab.jsx
git commit -m "feat: add RecommendationsTab admin UI to manage You May Also Like products"
```

---

### Task 8: Admin — Wire both tabs into AdminPanel.jsx

**Files:**
- Modify: `c:\projects\fl\Floral Studio\frontend\src\pages\AdminSection\AdminPanel.jsx`

- [ ] **Step 1: Read the file**

Read `src/pages/AdminSection/AdminPanel.jsx`. Note the current lucide-react import, NAV array, PAGES object, and existing tab imports.

- [ ] **Step 2: Add imports**

Add after the last tab import (after `import BannersTab from "./AdminTabs/BannersTab"`):
```js
import TodaysPickTab from "./AdminTabs/TodaysPickTab";
import RecommendationsTab from "./AdminTabs/RecommendationsTab";
```

- [ ] **Step 3: Add icons to lucide-react import**

Find the lucide-react import. Add `Star` and `Sparkles` if not already present:
```js
import {
  LayoutDashboard, Users, BarChart2, Package, Eye,
  Star, Bell, Menu, Home, LogOut, Image, Sparkles,
} from "lucide-react";
```

Note: `Star` may already be imported for the Reviews tab — check before adding to avoid duplicates.

- [ ] **Step 4: Add entries to NAV array**

After `{ id: "banners", icon: <Image size={18}/>, label: "Banners" }`, add:
```js
{ id: "todayspick",      icon: <Star size={18}/>,     label: "Today's Pick"    },
{ id: "recommendations", icon: <Sparkles size={18}/>, label: "Recommendations" },
```

- [ ] **Step 5: Add entries to PAGES object**

After `banners: <BannersTab />`, add:
```js
todayspick:      <TodaysPickTab />,
recommendations: <RecommendationsTab />,
```

- [ ] **Step 6: Commit**

```bash
cd "c:/projects/fl/Floral Studio/frontend"
git add src/pages/AdminSection/AdminPanel.jsx
git commit -m "feat: add Today's Pick and Recommendations tabs to admin panel"
```

---

### Task 9: End-to-end verification

- [ ] **Step 1: Restart backend, start frontend**

```bash
# Backend (in backend directory)
node index.js
# Confirm: "Server is running on port 3001" with no errors

# Frontend (in frontend directory)
npm run dev
```

- [ ] **Step 2: Admin — set Today's Pick**

1. Open `http://localhost:5173/admin/todayspick`
2. "Today's Pick" appears in sidebar
3. Dropdown shows all products with name + price
4. Select any product, click "Save Pick" → success message
5. Refresh page → selected product is pre-selected

- [ ] **Step 3: Verify Hero shows selected product**

1. Open `http://localhost:5173`
2. Hero section shows the selected product's real image (not the old hardcoded URL)
3. Floating card shows the product's real name and price

- [ ] **Step 4: Admin — set Recommendations**

1. Open `http://localhost:5173/admin/recommendations`
2. "Recommendations" appears in sidebar
3. 4 slot dropdowns, each with all products + "Empty" option
4. Select 4 different products, click "Save Recommendations" → success
5. Select same product in 2 slots → "Please select different products" warning, Save disabled
6. Clear all slots → "Please select at least 1 product", Save disabled
7. Refresh page → saved products are pre-selected

- [ ] **Step 5: Verify "You May Also Like" on product detail**

1. Open any product detail page
2. "You May Also Like" section shows the recommended products (excluding current product if it's in the list)
3. If current product is in recommendations: 3 cards shown
4. If current product is not in recommendations: all 4 cards... wait — `.slice(0, 3)` means max 3. Correct.
5. Clicking a product card navigates to that product's detail page

- [ ] **Step 6: Edge case — no config**

1. If Today's Pick is not set (GET returns null): Hero shows fallback decorative image, "—" placeholder text in card
2. If Recommendations are empty (GET returns []): "You May Also Like" section does not render at all

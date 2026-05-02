# Today's Pick & Recommendations Design

**Date:** 2026-05-02
**Status:** Approved

---

## Problem

1. Hero section shows a hardcoded bouquet image — the `todaysPick` product's real image is never displayed.
2. `todaysPick` is derived client-side (highest-rated product) — admin has no control over it.
3. "You May Also Like" in ProductDetail uses a hardcoded `RELATED` array — not connected to real products.

---

## Solution

Two new MongoDB singleton configs (same pattern as `BannerConfig`):
- `PickConfig` — stores 1 admin-selected product ID for "Today's Pick"
- `RecommendationsConfig` — stores up to 4 admin-selected product IDs for "You May Also Like"

Admin panel gets two new tabs. Frontend reads from these APIs instead of hardcoded data.

---

## Scope

**In scope:**
- Backend: PickConfig model + GET/PUT `/api/todayspick`
- Backend: RecommendationsConfig model + GET/PUT `/api/recommendations`
- Hero.jsx: use `todaysPick.images[0]` as the main bouquet image
- Home.jsx: fetch from `/api/todayspick` instead of deriving from products
- ProductDetail.jsx: fetch `/api/recommendations`, filter out current product, show up to 3
- Admin: TodaysPickTab (1 product select)
- Admin: RecommendationsTab (up to 4 product slots with duplicate guard)

**Out of scope:**
- Ordering recommendations (Slot 1 = first select)
- Showing recommendations outside ProductDetail
- Caching or pagination

---

## Backend

### Model: `backend/models/pick.model.js`

```js
{
  configType: { type: String, default: "todayspick" },
  product: { type: ObjectId, ref: "Product" }
}
// Singleton — one document, upserted on PUT
```

### Model: `backend/models/recommendations.model.js`

```js
{
  configType: { type: String, default: "recommendations" },
  products: [{ type: ObjectId, ref: "Product" }]
  // Schema validator: v.length <= 4
}
```

### Routes

```
GET  /api/todayspick       → getTodaysPick   (public)
PUT  /api/todayspick       → updateTodaysPick
GET  /api/recommendations  → getRecommendations (public)
PUT  /api/recommendations  → updateRecommendations
```

**GET `/api/todayspick`:** findOne + populate `_id name price images rating`. Returns `{ success, data: product | null }`.

**PUT `/api/todayspick`:** validate `product` is a valid ObjectId. Upsert with `configType: "todayspick"`. Return populated product.

**GET `/api/recommendations`:** findOne + populate `_id name price images rating`. Returns `{ success, data: [] }` if empty.

**PUT `/api/recommendations`:** validate array, 1–4 items, all valid ObjectIds, no duplicates. Upsert. Return populated array.

---

## Frontend

### Hero.jsx

Replace hardcoded `src="https://flowergiftkorea..."` with:
```jsx
src={todaysPick?.images?.[0] ?? "https://flowergiftkorea.com/..."}
```
Fallback keeps current decorative image when no pick is configured.

### Home.jsx

Add `todaysPick` to state. Add `GET /api/todayspick` to existing `Promise.all`. Remove the `reduce` derivation. Pass `todaysPick` to `<Hero>`.

### ProductDetail.jsx

Add `recommendations` state. Fetch `GET /api/recommendations` alongside existing product fetch. Filter out current `productId` → `shown = recommendations.filter(p => p._id !== productId).slice(0, 3)`. Replace `RELATED` render with real data. Click navigates to `/product/${p._id}`.

---

## Admin Tabs

### TodaysPickTab.jsx

Fetches products list + current pick. Single `<select>`. `PUT /api/todayspick`. Success/error states, authFetch for PUT.

### RecommendationsTab.jsx

Fetches products list + current recommendations. 4 labeled slots ("Slot 1"–"Slot 4"), each a `<select>` (empty option or product). Duplicate guard. Save filters empty slots → sends non-empty IDs. `PUT /api/recommendations`. authFetch for PUT.

---

## Files

| File | Type |
|---|---|
| `backend/models/pick.model.js` | New |
| `backend/models/recommendations.model.js` | New |
| `backend/controllers/pick.controllers.js` | New |
| `backend/controllers/recommendations.controllers.js` | New |
| `backend/routes/pick.routes.js` | New |
| `backend/routes/recommendations.routes.js` | New |
| `backend/index.js` | Modify |
| `src/components/Hero.jsx` | Modify |
| `src/pages/Home.jsx` | Modify |
| `src/pages/ProductSection/ProductDetail.jsx` | Modify |
| `src/pages/AdminSection/AdminTabs/TodaysPickTab.jsx` | New |
| `src/pages/AdminSection/AdminTabs/RecommendationsTab.jsx` | New |
| `src/pages/AdminSection/AdminPanel.jsx` | Modify |

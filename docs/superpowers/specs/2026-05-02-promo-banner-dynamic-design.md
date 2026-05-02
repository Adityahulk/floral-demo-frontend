# Dynamic PromoBanner Design

**Date:** 2026-05-02  
**Status:** Approved

---

## Problem

The PromoBanner section on the Home page shows two hardcoded banners ("Wedding Florals", "Dried Flower Art") with Unsplash images. Admin cannot change which categories are featured without editing code.

---

## Solution

A `BannerConfig` singleton document in MongoDB stores exactly 2 category IDs. The admin panel gets a "Banners" tab where the admin picks any 2 categories from the DB. The frontend fetches the populated category data and renders it in the PromoBanner section.

---

## Scope

**In scope:**
- Backend: BannerConfig model, GET + PUT endpoints
- Frontend: `PromoBanner.jsx` extracted component, fetches from API
- Admin: BannersTab with 2 category selects + save

**Out of scope:**
- Custom banner text (uses category `name` and `desc`)
- Banner link/navigation (button stays decorative for now)
- More than 2 banners
- Banner ordering (Banner 1 = first select, Banner 2 = second select)

---

## Backend

### Model: `backend/models/banner.model.js`

```js
{
  banners: [{ type: ObjectId, ref: "Category", required: true }]
  // Always exactly 2 items. Enforced in controller, not schema.
}
```

Singleton pattern: controller checks if a document exists and upserts it.

### Controller: `backend/controllers/banner.controllers.js`

**GET `/api/banners`** (public)
- Find the single BannerConfig document
- Populate both category IDs with full category data (`_id, name, img, desc, color`)
- Return `{ success: true, data: [category1, category2] }`
- If no config exists yet: return `{ success: true, data: [] }`

**PUT `/api/banners`** (admin, no auth middleware for now — consistent with existing pattern)
- Body: `{ banners: [categoryId1, categoryId2] }`
- Validate: array of exactly 2 non-empty strings
- Upsert: `BannerConfig.findOneAndUpdate({}, { banners }, { upsert: true, new: true })`
- Populate and return `{ success: true, data: [category1, category2] }`

### Routes: `backend/routes/banner.routes.js`

```
GET  /api/banners   → getBanners   (public)
PUT  /api/banners   → updateBanners (admin)
```

### Register in `backend/index.js`

```js
import bannerRoutes from './routes/banner.routes.js';
app.use("/api", bannerRoutes);
```

---

## Frontend — PromoBanner Component

### `src/components/PromoBanner.jsx` (new file)

- `useEffect` fetches `GET /api/banners` on mount
- State: `banners` (array), `loading` (bool)
- **Loading:** 2 skeleton blocks (rounded-3xl, h-64 sm:h-72, animate-pulse bg-stone-200)
- **Empty/error:** render nothing (`return null`)
- **Data:** map over 2 populated categories:
  - Background image: `category.img`
  - Label text (top): `category.desc` (truncated to ~30 chars) — replaces hardcoded "Special Event" / "Long Lasting"
  - Title: `category.name` — replaces hardcoded "Wedding Florals" / "Dried Flower Art"
  - Button: "Explore →" (static label, no navigation for now)

### `src/pages/Home.jsx`

- Remove the inline `PromoBanner` function component
- Add `import PromoBanner from "../components/PromoBanner";`
- Replace `<PromoBanner />` usage — same position in JSX, no props needed

---

## Frontend — Admin Banners Tab

### `src/pages/AdminSection/AdminTabs/BannersTab.jsx` (new file)

On mount:
1. Fetch `GET /api/categories` → build dropdown options
2. Fetch `GET /api/banners` → pre-select current banner category IDs

UI:
- Section heading "Banner Collection" styled consistently with other admin tabs
- Two labeled selects:
  - "Banner 1" — `<select>` with all categories as options
  - "Banner 2" — `<select>` with all categories as options
- "Save Banners" button → calls `PUT /api/banners` with `{ banners: [id1, id2] }`
- Success state: green confirmation message "Banners updated successfully"
- Error state: red error message
- Disable save button while request is in-flight
- Guard: if same category selected for both banners, show inline warning "Please select two different categories"

### `src/pages/AdminSection/AdminPanel.jsx`

- Add to `NAV` array: `{ id: "banners", icon: <Image size={18}/>, label: "Banners" }`
- Add to `PAGES` object: `banners: <BannersTab />`
- Import `BannersTab` and `Image` from lucide-react

---

## Data Flow

```
Admin selects category A + B → PUT /api/banners → BannerConfig saved in DB

Home page loads → GET /api/banners → populated [categoryA, categoryB]
               → PromoBanner renders with real category img + name
```

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| No banner config in DB yet | `GET /api/banners` returns `data: []`, PromoBanner renders null |
| API fetch fails (frontend) | PromoBanner renders null (no crash, no empty state shown) |
| Admin saves same category twice | Frontend shows inline warning, blocks PUT call |
| PUT fails (admin) | Red error message shown below save button |

---

## Files Summary

| File | Type | Change |
|---|---|---|
| `backend/models/banner.model.js` | New | BannerConfig mongoose model |
| `backend/controllers/banner.controllers.js` | New | GET + PUT handlers |
| `backend/routes/banner.routes.js` | New | Express routes |
| `backend/index.js` | Modify | Register banner routes |
| `src/components/PromoBanner.jsx` | New | Extracted + dynamic component |
| `src/pages/Home.jsx` | Modify | Remove inline PromoBanner, import component |
| `src/pages/AdminSection/AdminTabs/BannersTab.jsx` | New | Admin UI for selecting banners |
| `src/pages/AdminSection/AdminPanel.jsx` | Modify | Add Banners nav item + page |

# Home Page — Dynamic Data Design

**Date:** 2026-05-01  
**Status:** Approved

---

## Problem

The Home page fetches no data from the backend. Products, Categories, and Hero content are all hardcoded in `src/constants/StaticVariables.js`. Real products added via the Admin panel are not visible on the homepage.

---

## Scope

**In scope (make dynamic):**
- Categories section
- Product tabs (derived from categories)
- Featured Products grid
- Hero "Today's Pick" card (top-rated product)

**Out of scope (stay static):**
- PromoBanner — no backend model/route exists
- Newsletter form — no subscribe endpoint
- FeaturesBar — pure marketing copy, not data-driven

---

## Architecture

### Data fetching strategy: Single fetch in `Home.jsx`

`Home.jsx` fetches both `/api/products` and `/api/categories` in parallel on mount. It derives all child data from these two responses and passes down via props. This keeps one loading state, avoids duplicate calls, and fits the existing pattern where `Home` already owns cart/wish state.

```
Home.jsx
  ├── fetches GET /api/products    → products[]
  ├── fetches GET /api/categories  → categories[]
  ├── derives todaysPick           → highest rating.average product
  ├── derives tabs                 → ["All", ...category names]
  │
  ├── <Hero todaysPick={...} />
  ├── <Categories categories={categories} loading={loading} />
  └── <Products products={products} categories={categories} loading={loading} ... />
```

---

## API Response → Component Field Mapping

| Old (StaticVariables) | New (API) | Notes |
|---|---|---|
| `p.id` | `p._id` | MongoDB ObjectId |
| `p.img` | `p.images[0]` | First image in array |
| `p.rating` (number) | `p.rating.average` | Nested object |
| `p.reviews` (number) | `p.reviews` | Same field name |
| `p.original` | `p.originalPrice` | Renamed |
| `p.category` (string) | `p.category.name` | Populated from Category model |
| `p.category` (for nav) | `p.category._id` | For `/category/:id/:productId` route |

`GET /api/products` returns `{ success, count, data: [...] }` — use `data` array.  
`GET /api/categories` returns `{ success, data: [...] }` — use `data` array.

---

## Components Changed

### `Home.jsx`
- Add `useEffect` to fetch products + categories in parallel (`Promise.all`)
- Add `loading` and `error` state
- Derive `todaysPick` = product with highest `rating.average`
- Derive `tabs` = `["All", ...categories.map(c => c.name)]`
- Pass `todaysPick` to `<Hero>`
- Pass `categories` + `loading` to `<Categories>`
- Pass `products`, `tabs`, `loading` to `<Products>`

### `Hero.jsx`
- Accept `todaysPick` prop `{ name, price, images }`
- Replace hardcoded "Rose Bouquet / ₹1,299" with real values
- Show skeleton/dash when `todaysPick` is null

### `Categories.jsx`
- Accept `categories` + `loading` props instead of importing from StaticVariables
- Map over `categories` using `_id`, `name`, `img` fields
- Show skeleton cards while loading (5 placeholder blocks)
- Category `count` field doesn't exist in the model — remove it or fetch product count separately (decision: remove count for now, simplest)

### `Products` component (inside `Home.jsx`)
- Accept `products`, `tabs`, `loading` props
- Replace `PRODUCTS` and `TABS` imports
- Filter logic: `tab === "All" ? products : products.filter(p => p.category?.name === tab)`
- Show skeleton grid while loading (8 placeholder cards)

### `ProductCard.jsx`
- `onWish(p.id)` → `onWish(p._id)` (wish set uses `_id` not `id`)
- `p.category` text display → `p.category?.name ?? ""`
- `p.rating` Stars component → pass `p.rating?.average ?? 0`
- Navigate: already uses `p._id` and `p.category` — verify `p.category._id` is used correctly for route

---

## Loading States

- **Categories:** 5 skeleton blocks (same aspect ratio as real cards), animated pulse
- **Products:** 8 skeleton cards, animated pulse
- **Hero Today's Pick:** show "—" placeholder text, no spinner (hero is always visible)

---

## Error Handling

- If `/api/products` fails: show empty grid with "Unable to load products" message
- If `/api/categories` fails: show empty categories section silently (no crash)
- Products still render even if categories fail (tabs default to `["All"]`)

---

## Files Changed

| File | Change |
|---|---|
| `src/pages/Home.jsx` | Add fetch logic, derive todaysPick + tabs, pass props |
| `src/components/Hero.jsx` | Accept + display todaysPick prop |
| `src/components/Categories.jsx` | Accept categories prop, remove StaticVariables import |
| `src/components/ProductCard.jsx` | Fix `p.id` → `p._id`, `p.rating` → `p.rating.average`, `p.category` → `p.category.name` |

**Not changed:** `StaticVariables.js` (other pages may still use it), `Testimonials.jsx` (already dynamic), `PromoBanner`, `Newsletter`, `FeaturesBar`

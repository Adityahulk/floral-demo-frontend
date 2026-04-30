# Add Product Form — Schema-Aligned Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `AddProductForm.jsx` to align 1:1 with the mongoose product schema and POST to `localhost:3001/api/product`.

**Architecture:** Single file edit — all changes stay inside `AddProductForm.jsx`. New helper components (`DynamicListInput`, `ColorPickerInput`) are defined in the same file above the main export, matching the existing pattern. Category list is fetched from the API on mount.

**Tech Stack:** React 19, Vite, Tailwind (via inline styles), lucide-react, `fetch` API

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/pages/AdminSection/AddProductForm.jsx` | Modify | All changes: new components, state restructure, API wiring |

No new files. No other files touched.

---

### Task 1: Add `DynamicListInput` component

Reusable component for `care_instructions` and `what_included`. Renders one input per array item with add/remove controls.

**Files:**
- Modify: `src/pages/AdminSection/AddProductForm.jsx` — add component above `SectionCard`

- [ ] **Step 1: Add `DynamicListInput` component**

Find the line `function SectionCard(` and insert the following component **above** it:

```jsx
function DynamicListInput({ items, setItems, placeholder }) {
  function handleChange(index, value) {
    setItems(prev => prev.map((item, i) => i === index ? value : item));
  }

  function addItem() {
    setItems(prev => [...prev, ""]);
  }

  function removeItem(index) {
    setItems(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={e => handleChange(index, e.target.value)}
            placeholder={`${placeholder} ${index + 1}`}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={{ borderColor: "#e8d5c4", background: "white", color: "#3a2416" }}
            onFocus={e => e.target.style.borderColor = "#c97d5b"}
            onBlur={e => e.target.style.borderColor = "#e8d5c4"}
          />
          <button
            onClick={() => removeItem(index)}
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity"
            style={{ background: "#fee2e2" }}>
            <X size={13} style={{ color: "#dc2626" }} />
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border-2 border-dashed text-xs font-semibold hover:opacity-70 transition-opacity"
        style={{ borderColor: "#c97d5b", color: "#c97d5b" }}>
        <Plus size={13} /> Add Item
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and verify no crash**

```bash
npm run dev
```

Open `http://localhost:5173`, navigate to Admin → Add Product. Page must load without console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminSection/AddProductForm.jsx
git commit -m "feat: add DynamicListInput component for array fields"
```

---

### Task 2: Add `ColorPickerInput` component

Dynamic color picker where admin types a name and picks a hex color. Stores colors as `[name, hexCode]` pairs.

**Files:**
- Modify: `src/pages/AdminSection/AddProductForm.jsx` — add component below `DynamicListInput`

- [ ] **Step 1: Add `ColorPickerInput` component**

Insert the following directly below the `DynamicListInput` function:

```jsx
function ColorPickerInput({ colors, setColors }) {
  const [name,  setName]  = useState("");
  const [hex,   setHex]   = useState("#e53e3e");

  function addColor() {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (colors.some(c => c[0].toLowerCase() === trimmed.toLowerCase())) return;
    setColors(prev => [...prev, [trimmed, hex]]);
    setName("");
    setHex("#e53e3e");
  }

  function removeColor(index) {
    setColors(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {/* Added colors */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map(([colorName, colorHex], index) => (
            <span key={index}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2"
              style={{ borderColor: "#e8d5c4", color: "#3a2416" }}>
              <span className="w-3 h-3 rounded-full shrink-0 border border-white/50"
                style={{ background: colorHex }} />
              {colorName}
              <button onClick={() => removeColor(index)} className="hover:opacity-70">
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addColor()}
          placeholder="Color name (e.g. Red)"
          className="flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
          style={{ borderColor: "#e8d5c4", background: "white", color: "#3a2416" }}
          onFocus={e => e.target.style.borderColor = "#c97d5b"}
          onBlur={e => e.target.style.borderColor = "#e8d5c4"}
        />
        <div className="relative shrink-0">
          <input
            type="color"
            value={hex}
            onChange={e => setHex(e.target.value)}
            className="w-10 h-10 rounded-xl border-2 cursor-pointer p-0.5"
            style={{ borderColor: "#e8d5c4" }}
            title="Pick color"
          />
        </div>
        <button
          onClick={addColor}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
          style={{ background: "#c97d5b" }}>
          <Plus size={14} /> Add
        </button>
      </div>
      <p className="text-xs" style={{ color: "#9c7a62" }}>
        Type a name, pick a color, then click Add
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Verify dev server still loads with no errors**

Navigate to Admin → Add Product. No console errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/AdminSection/AddProductForm.jsx
git commit -m "feat: add ColorPickerInput component for dynamic color pairs"
```

---

### Task 3: Restructure form state to match schema

Replace the `INITIAL` constant and update `update`/`toggleMulti` helpers. Remove dead fields (`weight`, `occasions`, `isFeatured`). Rename fields to match schema.

**Files:**
- Modify: `src/pages/AdminSection/AddProductForm.jsx` — update `INITIAL`, state declarations

- [ ] **Step 1: Replace `INITIAL` constant**

Find and replace the entire `INITIAL` object:

```js
// OLD
const INITIAL = {
  title:         "",
  category:      "",
  description:   "",
  price:         "",
  originalPrice: "",
  stock:         "",
  badge:         "None",
  sizes:         [],
  colors:        [],
  occasions:     [],
  careInstructions: "",
  weight:        "",
  deliveryTime:  "Same Day",
  isActive:      true,
  isFeatured:    false,
  tags:          [],
};
```

```js
// NEW
const INITIAL = {
  name:               "",
  category:           "",
  description:        "",
  price:              "",
  originalPrice:      "",
  quantity:           "",
  badge:              "None",
  sizes:              [],
  colors:             [],
  delivery_time:      "Same Day",
  active:             true,
  tags:               [],
  care_instructions:  [],
  what_included:      [],
};
```

- [ ] **Step 2: Update state declarations in `AddProductForm`**

Inside `AddProductForm`, find the existing state block and replace:

```jsx
// OLD
const [form,   setForm]   = useState(INITIAL);
const [images, setImages] = useState([]);
const [errors, setErrors] = useState({});
const [saved,  setSaved]  = useState(false);
const [saving, setSaving] = useState(false);
```

```jsx
// NEW
const [form,       setForm]       = useState(INITIAL);
const [images,     setImages]     = useState([]);
const [errors,     setErrors]     = useState({});
const [saved,      setSaved]      = useState(false);
const [saving,     setSaving]     = useState(false);
const [saveError,  setSaveError]  = useState(null);
const [categories, setCategories] = useState([]);
const [catLoading, setCatLoading] = useState(true);
```

- [ ] **Step 3: Update `update` helper — no change needed**

The `update` helper is generic (`setForm(f => ({ ...f, [key]: val }))`), so it works for any key. No change required.

- [ ] **Step 4: Verify dev server still loads**

Navigate to Admin → Add Product. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AdminSection/AddProductForm.jsx
git commit -m "refactor: restructure form state to match product schema"
```

---

### Task 4: Fetch categories from API on mount

Add a `useEffect` that calls `GET localhost:3001/api/category` and stores the results.

**Files:**
- Modify: `src/pages/AdminSection/AddProductForm.jsx` — add `useEffect` inside `AddProductForm`

- [ ] **Step 1: Add `useEffect` import**

At the top of the file, the import line currently reads:
```js
import { useState, useRef } from "react";
```

Change it to:
```js
import { useState, useRef, useEffect } from "react";
```

- [ ] **Step 2: Add category fetch effect**

Inside `AddProductForm`, directly after the state declarations, add:

```jsx
useEffect(() => {
  fetch("http://localhost:3001/api/category")
    .then(r => r.json())
    .then(data => {
      // Support both { data: [...] } and plain array responses
      const list = Array.isArray(data) ? data : (data.data ?? []);
      setCategories(list);
    })
    .catch(() => setCategories([]))
    .finally(() => setCatLoading(false));
}, []);
```

- [ ] **Step 3: Update Category `Select` JSX**

Find the Category section in the JSX (currently uses static `CATEGORIES` array):

```jsx
// OLD
<Select value={form.category} onChange={v => update("category", v)}
  options={CATEGORIES} placeholder="Select a category"/>
```

Replace with:

```jsx
// NEW
{catLoading ? (
  <div className="px-4 py-3 rounded-xl border text-sm"
    style={{ borderColor: "#e8d5c4", color: "#9c7a62" }}>
    Loading categories...
  </div>
) : (
  <div className="relative">
    <select
      value={form.category}
      onChange={e => update("category", e.target.value)}
      className="w-full appearance-none px-4 py-3 rounded-xl border text-sm outline-none transition-all"
      style={{
        borderColor: errors.category ? "#dc2626" : "#e8d5c4",
        background: "white",
        color: form.category ? "#3a2416" : "#9c7a62",
      }}
      onFocus={e => e.target.style.borderColor = "#c97d5b"}
      onBlur={e => e.target.style.borderColor = errors.category ? "#dc2626" : "#e8d5c4"}>
      <option value="">Select a category</option>
      {categories.map(cat => (
        <option key={cat._id} value={cat._id}>{cat.name}</option>
      ))}
    </select>
    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: "#9c7a62" }} />
  </div>
)}
```

- [ ] **Step 4: Verify category dropdown loads (or shows loading state gracefully)**

If the backend is running, the dropdown should populate. If not running, it shows "Loading categories..." briefly then an empty select — no crash.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AdminSection/AddProductForm.jsx
git commit -m "feat: fetch categories from API on mount"
```

---

### Task 5: Update form sections — rename fields and add new sections

Update all JSX that references old field names. Add `what_included` section. Replace `careInstructions` textarea with `DynamicListInput`. Add `ColorPickerInput` for colors. Remove dead fields.

**Files:**
- Modify: `src/pages/AdminSection/AddProductForm.jsx` — JSX sections

- [ ] **Step 1: Rename `title` → `name` in Basic Information section**

```jsx
// OLD
<Label required>Product Title</Label>
<Input value={form.title} onChange={v => update("title", v)}
  placeholder="e.g. Rose Bliss Bouquet" error={errors.title}/>
```

```jsx
// NEW
<Label required>Product Name</Label>
<Input value={form.name} onChange={v => update("name", v)}
  placeholder="e.g. Rose Bliss Bouquet" error={errors.name}/>
```

- [ ] **Step 2: Replace `careInstructions` textarea with `DynamicListInput`**

```jsx
// OLD
<div>
  <Label>Care Instructions</Label>
  <Textarea value={form.careInstructions} onChange={v => update("careInstructions", v)}
    placeholder="e.g. Change water every 2 days. Keep away from direct sunlight. Trim stems at an angle."
    rows={3}/>
</div>
```

```jsx
// NEW
<div>
  <Label>Care Instructions</Label>
  <DynamicListInput
    items={form.care_instructions}
    setItems={v => update("care_instructions", v)}
    placeholder="Instruction"
  />
</div>
```

- [ ] **Step 3: Rename `stock` → `quantity` in Pricing & Stock section**

```jsx
// OLD
<Label required>Stock Quantity</Label>
<Input value={form.stock} onChange={v => update("stock", v)}
  type="number" placeholder="50" suffix="units" error={errors.stock}/>
{form.stock && Number(form.stock) < 10 && (
  <p className="text-xs mt-1 flex items-center gap-1" style={{ color:"#ca8a04" }}>
    <AlertCircle size={11}/> Low stock warning will show under 10 units
  </p>
)}
```

```jsx
// NEW
<Label required>Stock Quantity</Label>
<Input value={form.quantity} onChange={v => update("quantity", v)}
  type="number" placeholder="50" suffix="units" error={errors.quantity}/>
{form.quantity && Number(form.quantity) < 10 && (
  <p className="text-xs mt-1 flex items-center gap-1" style={{ color:"#ca8a04" }}>
    <AlertCircle size={11}/> Low stock warning will show under 10 units
  </p>
)}
```

- [ ] **Step 4: Remove `weight` field from Pricing & Stock section**

Delete the entire weight `<div>`:
```jsx
// DELETE this block
<div>
  <Label>Product Weight</Label>
  <Input value={form.weight} onChange={v => update("weight", v)}
    placeholder="500" suffix="grams"/>
</div>
```

Also change the surrounding grid from `sm:grid-cols-2` to a single column if weight was the second column item, or keep the single quantity field full-width.

The stock/quantity grid becomes:
```jsx
<div>
  <Label required>Stock Quantity</Label>
  <Input value={form.quantity} onChange={v => update("quantity", v)}
    type="number" placeholder="50" suffix="units" error={errors.quantity}/>
  {form.quantity && Number(form.quantity) < 10 && (
    <p className="text-xs mt-1 flex items-center gap-1" style={{ color:"#ca8a04" }}>
      <AlertCircle size={11}/> Low stock warning will show under 10 units
    </p>
  )}
</div>
```

- [ ] **Step 5: Replace static color chips with `ColorPickerInput`**

In the "Sizes & Colors" `SectionCard`, find the colors section:

```jsx
// OLD
<div>
  <Label>Available Colors</Label>
  <ChipGroup options={COLORS} selected={form.colors} onToggle={v => toggleMulti("colors", v)} color="#e11d48"/>
</div>
```

```jsx
// NEW
<div>
  <Label>Available Colors</Label>
  <ColorPickerInput
    colors={form.colors}
    setColors={v => update("colors", v)}
  />
</div>
```

- [ ] **Step 6: Rename `deliveryTime` → `delivery_time`**

```jsx
// OLD
<Select value={form.deliveryTime} onChange={v => update("deliveryTime", v)}
  options={["Same Day","Next Day","2-3 Days","3-5 Days"]}
  placeholder="Select delivery time"/>
```

```jsx
// NEW
<Select value={form.delivery_time} onChange={v => update("delivery_time", v)}
  options={["Same Day","Next Day","2-3 Days","3-5 Days"]}
  placeholder="Select delivery time"/>
```

- [ ] **Step 7: Add `what_included` section**

After the Delivery `SectionCard` and before the Visibility `SectionCard`, add:

```jsx
{/* What's Included */}
<SectionCard title="What's Included" icon={<Package size={16}/>} optional>
  <div>
    <Label hint="Items included with this product">Items</Label>
    <DynamicListInput
      items={form.what_included}
      setItems={v => update("what_included", v)}
      placeholder="Item"
    />
  </div>
</SectionCard>
```

- [ ] **Step 8: Remove `isFeatured` Toggle from Visibility section**

```jsx
// DELETE this block
<Toggle
  checked={form.isFeatured}
  onChange={v => update("isFeatured", v)}
  label="Featured Product"
  sub="Show in homepage and featured collections"/>
```

- [ ] **Step 9: Rename `isActive` → `active` in Visibility Toggle**

```jsx
// OLD
<Toggle
  checked={form.isActive}
  onChange={v => update("isActive", v)}
  label="Active / Published"
  sub="Customers can see and purchase this product"/>
```

```jsx
// NEW
<Toggle
  checked={form.active}
  onChange={v => update("active", v)}
  label="Active / Published"
  sub="Customers can see and purchase this product"/>
```

- [ ] **Step 10: Remove Occasions section entirely**

Delete the `ChipGroup` for occasions and its wrapping `div` inside the "Occasions & Tags" `SectionCard`. Rename the section card to just "Tags":

```jsx
// OLD
<SectionCard title="Occasions & Tags" icon={<Tag size={16}/>} optional>
  <div>
    <Label>Suitable Occasions</Label>
    <ChipGroup options={OCCASIONS} selected={form.occasions} onToggle={v => toggleMulti("occasions", v)} color="#7c3aed"/>
  </div>
  <div>
    <Label hint="Press Enter or comma to add">Search Tags</Label>
    ...
  </div>
</SectionCard>
```

```jsx
// NEW
<SectionCard title="Tags" icon={<Tag size={16}/>} optional>
  <div>
    <Label hint="Press Enter or comma to add">Search Tags</Label>
    <TagInput tags={form.tags} setTags={t => update("tags", t)}
      placeholder="Type a tag and press Enter... e.g. Romantic, Spring"/>
    <p style={{ color:"#9c7a62" }} className="text-xs mt-1">Tags help customers find your product in search</p>
  </div>
</SectionCard>
```

- [ ] **Step 11: Update `PreviewCard` — rename `form.title` → `form.name`**

Inside `PreviewCard` component, find:
```jsx
{form.title || <span style={{ color:"#b89c8a" }}>Product title...</span>}
```
Replace with:
```jsx
{form.name || <span style={{ color:"#b89c8a" }}>Product name...</span>}
```

Also find the stock display in `PreviewCard`:
```jsx
{form.stock ? `${form.stock} units` : "—"}
```
Replace with:
```jsx
{form.quantity ? `${form.quantity} units` : "—"}
```

- [ ] **Step 12: Verify dev server — all sections render, no console errors**

Navigate to Admin → Add Product. Check all sections visually: colors picker shows, care instructions has add/remove, what's included section appears.

- [ ] **Step 13: Commit**

```bash
git add src/pages/AdminSection/AddProductForm.jsx
git commit -m "feat: update form sections to match schema — rename fields, add new sections"
```

---

### Task 6: Update validation and wire real API POST

Update `validate()` for new field names. Replace the mock `setTimeout` in `handleSave` with a real `fetch` POST to `localhost:3001/api/product`.

**Files:**
- Modify: `src/pages/AdminSection/AddProductForm.jsx` — `validate()` and `handleSave()`

- [ ] **Step 1: Replace `validate()` function**

```jsx
// OLD
function validate() {
  const e = {};
  if (!form.title.trim())    e.title    = "Product title is required";
  if (!form.category)        e.category = "Please select a category";
  if (!form.description.trim()) e.description = "Description is required";
  if (!form.price)           e.price    = "Price is required";
  if (isNaN(form.price))     e.price    = "Enter a valid price";
  if (!form.stock)           e.stock    = "Stock quantity is required";
  if (images.length === 0)   e.images   = "Please add at least one image";
  return e;
}
```

```jsx
// NEW
function validate() {
  const e = {};
  if (!form.name.trim())           e.name        = "Product name is required";
  if (!form.category)              e.category    = "Please select a category";
  if (!form.description.trim())    e.description = "Description is required";
  if (!form.price)                 e.price       = "Price is required";
  if (isNaN(Number(form.price)))   e.price       = "Enter a valid price";
  if (!form.quantity)              e.quantity    = "Stock quantity is required";
  return e;
}
```

- [ ] **Step 2: Replace `handleSave()` with real API POST**

```jsx
// OLD
function handleSave(asDraft = false) {
  const e = validate();
  if (Object.keys(e).length > 0 && !asDraft) {
    setErrors(e);
    window.scrollTo({ top:0, behavior:"smooth" });
    return;
  }
  setSaving(true);
  setTimeout(() => {
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }, 1500);
}
```

```jsx
// NEW
async function handleSave(asDraft = false) {
  setSaveError(null);
  const e = validate();
  if (Object.keys(e).length > 0 && !asDraft) {
    setErrors(e);
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const payload = {
    name:               form.name.trim(),
    description:        form.description.trim(),
    sizes:              form.sizes,
    colors:             form.colors,
    delivery_time:      form.delivery_time,
    price:              Number(form.price),
    tags:               form.tags,
    quantity:           Number(form.quantity),
    category:           form.category,
    active:             asDraft ? false : form.active,
    care_instructions:  form.care_instructions.filter(s => s.trim()),
    what_included:      form.what_included.filter(s => s.trim()),
    images:             [],  // placeholder until upload API is provided
  };

  if (form.originalPrice) payload.originalPrice = Number(form.originalPrice);
  if (form.badge && form.badge !== "None") payload.badge = form.badge;

  setSaving(true);
  try {
    const res = await fetch("http://localhost:3001/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `Server error ${res.status}`);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    handleReset();
  } catch (err) {
    setSaveError(err.message || "Failed to save product. Please try again.");
  } finally {
    setSaving(false);
  }
}
```

- [ ] **Step 3: Add error toast JSX**

Below the existing success toast, add an error toast:

```jsx
{/* Error Toast */}
{saveError && (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl"
    style={{ background: "#dc2626" }}>
    <AlertCircle size={16} className="text-white shrink-0"/>
    <span className="text-white text-sm font-semibold">{saveError}</span>
    <button onClick={() => setSaveError(null)} className="ml-2 text-white hover:opacity-70">
      <X size={14}/>
    </button>
  </div>
)}
```

- [ ] **Step 4: Verify mock save no longer used — submit fires real fetch**

With backend running, click Publish. With backend down, click Publish — should show the red error toast with the network error message.

- [ ] **Step 5: Commit**

```bash
git add src/pages/AdminSection/AddProductForm.jsx
git commit -m "feat: wire real API POST to localhost:3001/api/product"
```

---

### Task 7: Update publishing checklist and remove unused constants

Update the checklist items to match new field names. Remove unused `CATEGORIES`, `OCCASIONS`, `COLORS` constants from the top of the file.

**Files:**
- Modify: `src/pages/AdminSection/AddProductForm.jsx` — constants and checklist array

- [ ] **Step 1: Remove unused top-level constants**

At the top of the file, delete these lines:

```js
// DELETE
const CATEGORIES = ["Bouquets", "Arrangements", "Wreaths", "Dried Flowers", "Plants", "Gift Hampers"];
const OCCASIONS  = ["Birthday", "Anniversary", "Wedding", "Romance", "Congratulations", "Sympathy", "Corporate", "Seasonal", "Gift", "Luxury"];
const COLORS     = ["Red", "Pink", "White", "Yellow", "Purple", "Orange", "Mixed", "Peach", "Blue", "Green"];
```

Keep `SIZES` and `BADGES` — they are still used.

- [ ] **Step 2: Update publishing checklist array**

Find the checklist array (inside the right-panel JSX):

```jsx
// OLD
{[
  ["Product title",   !!form.title.trim()],
  ["Category",        !!form.category],
  ["Description",     !!form.description.trim()],
  ["Selling price",   !!form.price],
  ["Stock quantity",  !!form.stock],
  ["Product images",  images.length > 0],
  ["Occasions",       form.occasions.length > 0],
  ["Sizes added",     form.sizes.length > 0],
].map(([label, done]) => (
```

```jsx
// NEW
{[
  ["Product name",    !!form.name.trim()],
  ["Category",        !!form.category],
  ["Description",     !!form.description.trim()],
  ["Selling price",   !!form.price],
  ["Stock quantity",  !!form.quantity],
  ["Colors added",    form.colors.length > 0],
  ["Sizes added",     form.sizes.length > 0],
  ["Care instructions", form.care_instructions.some(s => s.trim())],
].map(([label, done]) => (
```

- [ ] **Step 3: Update progress bar percentage calculation**

Find the two places where the completion percentage is calculated (label span and width style). Update both:

```jsx
// OLD — find both occurrences and replace
[
  !!form.title.trim(), !!form.category, !!form.description.trim(),
  !!form.price, !!form.stock, images.length>0,
  form.occasions.length>0, form.sizes.length>0
].filter(Boolean).length / 8
```

```jsx
// NEW — replace both occurrences with
[
  !!form.name.trim(), !!form.category, !!form.description.trim(),
  !!form.price, !!form.quantity, form.colors.length > 0,
  form.sizes.length > 0, form.care_instructions.some(s => s.trim()),
].filter(Boolean).length / 8
```

- [ ] **Step 4: Remove unused `disc` variable at bottom of `AddProductForm`**

The `disc` variable is defined in both `PreviewCard` (keep it there) and `AddProductForm` (delete from here):

```jsx
// DELETE from AddProductForm body (not from PreviewCard)
const disc = form.price && form.originalPrice
  ? Math.round((1 - Number(form.price) / Number(form.originalPrice)) * 100)
  : null;
```

- [ ] **Step 5: Final dev server check**

Navigate to Admin → Add Product. Verify:
- [ ] All sections render without errors
- [ ] Category dropdown fetches (or shows loading/empty gracefully)
- [ ] Colors: can type name + pick color + add → chip appears with swatch
- [ ] Care Instructions: `+ Add Item` adds a new input, `×` removes it
- [ ] What's Included: same behavior
- [ ] Sizes: chip multi-select still works
- [ ] Tags: Enter/comma still adds tags
- [ ] Publishing checklist updates as you fill fields
- [ ] Progress bar moves as fields are filled
- [ ] Clicking Publish fires fetch (check Network tab in DevTools)

- [ ] **Step 6: Commit**

```bash
git add src/pages/AdminSection/AddProductForm.jsx
git commit -m "refactor: clean up unused constants and update publishing checklist"
```

---

## Summary of All Changes

| What | Before | After |
|------|--------|-------|
| `form.title` | string | renamed to `form.name` |
| `form.stock` | number string | renamed to `form.quantity` |
| `form.isActive` | boolean | renamed to `form.active` |
| `form.deliveryTime` | string | renamed to `form.delivery_time` |
| `form.careInstructions` | single string | `form.care_instructions` — string[] with DynamicListInput |
| `form.colors` | string[] | `[string,string][]` with ColorPickerInput |
| `form.what_included` | missing | string[] with DynamicListInput |
| `form.weight` | existed | removed |
| `form.occasions` | existed | removed |
| `form.isFeatured` | existed | removed |
| Category select | static list | fetched from `localhost:3001/api/category` |
| Form submit | mock setTimeout | real `fetch` POST to `localhost:3001/api/product` |

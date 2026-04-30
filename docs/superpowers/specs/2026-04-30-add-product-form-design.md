# Add Product Form — Schema-Aligned Redesign

**Date:** 2026-04-30  
**Status:** Approved

## Goal

Rewrite `AddProductForm.jsx` to align 1:1 with the mongoose product schema and wire it to the real API at `localhost:3001/api/product`. The visual design and component library stay unchanged.

## Schema → Form Field Mapping

| Schema Field       | Form Key         | Type              | UI Control                  |
|--------------------|------------------|-------------------|-----------------------------|
| `name`             | `name`           | string            | Text input                  |
| `description`      | `description`    | string            | Textarea                    |
| `sizes`            | `sizes`          | string[]          | Chip multi-select           |
| `colors`           | `colors`         | [string,string][] | Dynamic color picker rows   |
| `delivery_time`    | `delivery_time`  | string            | Select dropdown             |
| `price`            | `price`          | number            | Number input with ₹ prefix  |
| `originalPrice`    | `originalPrice`  | number            | Number input with ₹ prefix  |
| `badge`            | `badge`          | string            | Chip single-select          |
| `images`           | `images`         | string[]          | Placeholder `[]` for now    |
| `tags`             | `tags`           | string[]          | Tag input (Enter/comma)     |
| `quantity`         | `quantity`       | number            | Number input                |
| `category`         | `category`       | ObjectId string   | Select (fetched from API)   |
| `active`           | `active`         | boolean           | Toggle                      |
| `care_instructions`| `care_instructions` | string[]       | Dynamic multi-field list    |
| `what_included`    | `what_included`  | string[]          | Dynamic multi-field list    |

**Removed fields (not in schema):** `weight`, `occasions`, `isFeatured`

## Component Changes

### New: `DynamicListInput`
Reusable component for `care_instructions` and `what_included`.
- Renders one `<input>` per array item
- `+ Add` button appends an empty string
- `×` button removes that index
- Empty strings filtered out on submit

### New: `ColorPickerInput`
For the `colors` field (`[name, hexCode][]`).
- Row with: text input for name + `<input type="color">` swatch + `Add` button
- Added colors render as removable chips showing the swatch dot and name
- Prevents duplicate names

### Updated: Category Select
- On mount, `GET localhost:3001/api/category`
- Populates dropdown with `{ _id, name }` from response
- Stores `_id` (ObjectId string) as the value
- Shows a skeleton/loading state while fetching

### Updated: `handleSave`
Builds payload exactly matching the schema:
```js
{
  name, description, sizes, colors,
  delivery_time, price: Number(price),
  originalPrice: Number(originalPrice) || undefined,
  badge: badge === "None" ? undefined : badge,
  images: [],   // placeholder until upload API provided
  tags, quantity: Number(quantity),
  category,     // ObjectId string
  active,
  care_instructions: care_instructions.filter(s => s.trim()),
  what_included: what_included.filter(s => s.trim()),
}
```
POSTs to `localhost:3001/api/product`. Shows success/error toast from real API response.

### Updated: Validation
Required fields: `name`, `category`, `description`, `price`, `quantity`

### Updated: Publishing Checklist
Checklist items updated to match new fields: name, category, description, price, quantity, colors, sizes, care_instructions.

## What Does NOT Change
- All existing UI primitives: `Label`, `Input`, `Textarea`, `Select`, `Toggle`, `SectionCard`, `TagInput`, `ImageUploader`, `PreviewCard`
- Overall page layout (left form + right sticky preview + top bar)
- Visual design tokens (colors, fonts, border radius)

## Out of Scope
- Image upload (pending upload API from user)
- Edit product (separate feature)
- Rating/reviews (set by system, not admin input)

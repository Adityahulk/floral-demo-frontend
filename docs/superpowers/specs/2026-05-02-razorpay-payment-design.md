# Razorpay Payment Gateway Design

**Date:** 2026-05-02
**Status:** Approved

---

## Problem

Checkout currently saves orders directly with `paymentStatus: "pending"` and no actual payment collection. Need a production-grade payment integration with full protection against price manipulation, fake payments, and duplicate orders.

---

## Solution

Two-payment-method checkout: **Razorpay (online)** + **Cash on Delivery (COD)**. Razorpay uses a two-step server-side flow — order is never saved to DB until payment signature is verified by backend. COD uses existing direct-save flow with a new `paymentMethod` field.

---

## Flow

### COD
```
Frontend → POST /api/orders  { items, shippingAddress, paymentMethod:"cod" }
         ← { success:true, orderId }
Order saved: paymentStatus:"cod_pending", paymentMethod:"cod"
```

### Razorpay
```
Step 1 — Initiate:
  Frontend → POST /api/orders/initiate  { items, shippingAddress }
           ← { razorpayOrderId, amount, currency:"INR", keyId }
  (Nothing saved to DB. Stock not deducted.)

Step 2 — User pays in Razorpay modal (frontend)

Step 3 — Confirm:
  Frontend → POST /api/orders/confirm  {
               razorpayOrderId, razorpayPaymentId, razorpaySignature,
               items, shippingAddress
             }
  Backend:
    1. HMAC-SHA256 verify: sha256(razorpayOrderId|razorpayPaymentId, KEY_SECRET)
    2. Duplicate check: razorpayOrderId already in DB? → 409
    3. Re-validate all items: product active, in stock, price from DB
    4. MongoDB transaction: save order + deduct stock
           ← { success:true, orderId }
  Order saved: paymentStatus:"paid", paymentMethod:"razorpay"
```

---

## Backend

### Environment Variables (`backend/.env`)
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```

### New file: `backend/utils/razorpay.js`
- Creates and exports Razorpay instance using `KEY_ID` + `KEY_SECRET`

### Modified: `backend/models/order.model.js`
New fields:
```js
paymentMethod:     { type: String, enum: ["razorpay","cod"], required: true }
razorpayOrderId:   { type: String }   // from initiate step
razorpayPaymentId: { type: String }   // from confirm step
```
`paymentStatus` enum extended: `"pending" | "paid" | "failed" | "cod_pending"`

### New controllers — `backend/controllers/order.controllers.js`

**`initiatePayment`**
- Validate `items` array (non-empty)
- For each item: fetch product from DB, check active + stock
- Calculate `totalAmount` from DB prices only (never trust frontend)
- Call `razorpay.orders.create({ amount: totalAmount * 100, currency:"INR", receipt: userId })`
- Return `{ razorpayOrderId, amount: totalAmount, currency:"INR", keyId: KEY_ID }`

**`confirmPayment`**
- Verify HMAC-SHA256 signature — 400 if invalid
- Check `razorpayOrderId` not already in orders collection — 409 if duplicate
- Re-validate all items from DB (price, stock, active) — 400 if any fail
- MongoDB transaction:
  - Create order: `paymentStatus:"paid"`, `paymentMethod:"razorpay"`, store both IDs
  - Deduct stock + increment `totalSold` for each product
- Return `{ success:true, orderId }`

**`placeOrder` (existing — COD)**
- Add `paymentMethod:"cod"` to saved order
- Add `paymentStatus:"cod_pending"` instead of `"pending"`
- Validate `paymentMethod === "cod"` in request body

### Modified routes — `backend/routes/order.routes.js`
```
POST /api/orders/initiate   → initiatePayment   (protect)
POST /api/orders/confirm    → confirmPayment    (protect)
POST /api/orders            → placeOrder (COD)  (protect)
```
**Route order matters:** `/initiate` and `/confirm` must be defined before `/:id` to avoid param collision.

---

## Frontend

### Modified: `frontend/src/pages/CheckoutPage.jsx`

**Payment step UI:**
- Two radio options:
  - 💳 Pay Online (Razorpay) — card, UPI, netbanking, wallets
  - 🚚 Cash on Delivery
- Default: Razorpay selected

**Razorpay flow (on "Place Order" click):**
1. Load Razorpay script if not already loaded (`checkout.razorpay.com/v1/checkout.js`)
2. Call `POST /api/orders/initiate` → get `{ razorpayOrderId, amount, keyId }`
3. Open Razorpay modal with:
   ```js
   {
     key: keyId,
     amount: amount * 100,  // paise
     currency: "INR",
     order_id: razorpayOrderId,
     name: "Floral Studio",
     description: "Order Payment",
     prefill: { name: user.name, email: user.email },
     theme: { color: "#c97d5b" },
     handler: async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {
       // call confirm endpoint
     },
     modal: { ondismiss: () => setLoading(false) }
   }
   ```
4. On handler success: call `POST /api/orders/confirm` → navigate to confirmation

**COD flow (on "Place Order" click):**
- Call `POST /api/orders` with `{ items, shippingAddress, paymentMethod:"cod" }`
- Navigate to confirmation on success

**Error handling:**
- Initiate fails → show error, stay on payment step
- Modal dismissed → reset loading, stay on payment step (no order created)
- Confirm fails → show error with retry option
- COD fails → show error inline

---

## Files

| File | Type |
|---|---|
| `backend/utils/razorpay.js` | New |
| `backend/models/order.model.js` | Modify |
| `backend/controllers/order.controllers.js` | Modify |
| `backend/routes/order.routes.js` | Modify |
| `backend/.env` | Modify |
| `frontend/src/pages/CheckoutPage.jsx` | Modify |

---

## Security Summary

| Threat | Protection |
|---|---|
| Frontend sends fake/low amount | `initiatePayment` ignores frontend amount, calculates from DB |
| Fake payment_id injected | HMAC-SHA256 signature verify on backend — impossible to forge without KEY_SECRET |
| Duplicate order from same payment | `razorpayOrderId` unique check before saving |
| Price changed between initiate and confirm | Full re-validation at `confirmPayment` step |
| Stock oversell | MongoDB transaction — atomic stock deduct + order save |
| Unauthenticated order creation | Both endpoints behind `protect` middleware |

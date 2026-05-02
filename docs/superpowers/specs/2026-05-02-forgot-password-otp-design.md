# Forgot Password (OTP) Design

**Date:** 2026-05-02
**Status:** Approved

---

## Problem

The signin page has no password recovery mechanism. Users who forget their password have no way to regain access.

---

## Solution

OTP-based password reset using Gmail SMTP (nodemailer). Three inline steps inside the existing `AuthPage.jsx` — no new routes or pages. OTP validity is enforced via short-lived signed JWTs (stateless — no DB changes to User model).

---

## Flow

```
Step 1: Enter email
  → POST /api/auth/forgot-password
  ← { otpToken }  (JWT 10 min, payload: { email, otpHash })
  → OTP email sent to user

Step 2: Enter OTP
  → POST /api/auth/verify-otp  { otp, otpToken }
  ← { resetToken }  (JWT 5 min, payload: { email, verified: true })

Step 3: Enter new password
  → POST /api/auth/reset-password  { password, resetToken }
  ← { success: true }
  → redirect to login
```

---

## Backend

### Environment Variables (`.env`)
```
GMAIL_USER=your@gmail.com
GMAIL_PASS=your_app_password
```

### New file: `backend/utils/mailer.js`
- Creates nodemailer transporter using Gmail SMTP (`GMAIL_USER`, `GMAIL_PASS`)
- Exports `sendOtpEmail(to, otp)` — sends branded HTML email with the 6-digit OTP
- Subject: "Your Floral Studio Password Reset OTP"

### New routes — `backend/routes/auth.routes.js`
```
POST /api/auth/forgot-password   → forgotPassword   (public)
POST /api/auth/verify-otp        → verifyOtp        (public)
POST /api/auth/reset-password    → resetPassword    (public)
```

### New controllers — `backend/controllers/auth.controllers.js`

**`forgotPassword`**
- Find user by email → 404 if not found
- Generate cryptographically random 6-digit OTP (crypto.randomInt)
- bcrypt-hash the OTP (saltRounds = 10)
- Sign `otpToken` JWT: `{ email, otpHash }`, expires 10 min, secret = `JWT_SECRET`
- Call `sendOtpEmail(email, otp)`
- Return `{ success: true, otpToken }`

**`verifyOtp`**
- Verify `otpToken` JWT (400 if expired/invalid)
- bcrypt-compare submitted `otp` against `otpHash` from token (400 if mismatch)
- Sign `resetToken` JWT: `{ email, verified: true }`, expires 5 min, secret = `JWT_SECRET`
- Return `{ success: true, resetToken }`

**`resetPassword`**
- Verify `resetToken` JWT (400 if expired/invalid)
- Check `verified === true` (400 if not)
- Validate `password` length >= 6 (400 if not)
- Find user by email → 404 if not found
- Set `user.password = password` (model pre-save hook bcrypt-hashes it)
- Save user
- Return `{ success: true, message: "Password reset successfully" }`

---

## Frontend

### Modified file: `src/pages/Auth/AuthPage.jsx`

Add `forgotStep` state: `null | "email" | "otp" | "password" | "done"`

Add `otpToken` and `resetToken` states for passing between steps.

**When `forgotStep === null`:** Normal login form with "Forgot Password?" link below password field.

**Step renders (replace login form area):**

| Step | UI | API call | On success |
|---|---|---|---|
| `"email"` | Email input + "Send OTP" button | `POST /api/auth/forgot-password` | Store `otpToken`, advance to `"otp"` |
| `"otp"` | 6-digit OTP input + "Verify OTP" button + "Resend OTP" link | `POST /api/auth/verify-otp` | Store `resetToken`, advance to `"password"` |
| `"password"` | New password + confirm password inputs + "Reset Password" button | `POST /api/auth/reset-password` | Advance to `"done"` |
| `"done"` | Success message + "Back to Login" button | — | Set `forgotStep` to `null` |

**Navigation:**
- Each step has a "← Back" link: returns to previous step (step 1 returns to login)
- "Resend OTP" on step 2: re-calls `POST /api/auth/forgot-password` with same email, updates `otpToken`

**Error/loading states:** Same pattern as existing login/register forms in `AuthPage.jsx` (local `loading` and `error` state, inline error message below form).

**Validation (client-side):**
- Step 1: valid email format
- Step 2: exactly 6 digits
- Step 3: password >= 6 chars, confirm password matches

---

## Files

| File | Type |
|---|---|
| `backend/utils/mailer.js` | New |
| `backend/controllers/auth.controllers.js` | Modify (add 3 controllers) |
| `backend/routes/auth.routes.js` | Modify (add 3 routes) |
| `backend/.env` | Modify (add GMAIL_USER, GMAIL_PASS) |
| `src/pages/Auth/AuthPage.jsx` | Modify |

---

## Security Notes

- OTP is bcrypt-hashed before embedding in JWT — plaintext OTP never persists anywhere
- `otpToken` and `resetToken` are short-lived (10 min / 5 min) and single-use by design
- `resetToken` requires `verified: true` claim — cannot skip OTP step
- No rate limiting in scope (can be added later)

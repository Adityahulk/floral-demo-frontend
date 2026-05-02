# Signup Email Verification — Design Spec

**Date:** 2026-05-02  
**Status:** Approved

---

## Overview

Add OTP-based email verification to the signup flow. The user must verify their email address before the account is created. Verification happens inline on the AuthPage — an OTP input appears just below the email field after clicking "Send OTP". Once verified, the rest of the signup form unlocks and the user can complete registration.

---

## User Flow

1. User navigates to AuthPage → switches to "signup" tab
2. Sees only the **Email Address** field with a **"Send OTP"** button
3. Enters valid email → clicks "Send OTP"
4. Backend checks email is not already registered, generates OTP, sends to email, returns `otpToken` JWT
5. OTP input appears below the email field
6. User enters 6-digit OTP → clicks "Verify"
7. Backend verifies OTP against `otpToken`, returns `verifiedToken` JWT
8. Email field locks, green "✓ Email verified" message shown, OTP input hides
9. Rest of form unlocks: Full Name, Password, Contact Number
10. User fills remaining fields → clicks "Create Account"
11. Backend validates `verifiedToken`, creates user, returns success
12. Frontend shows success message → auto-switches to login tab after 1.8s

---

## Backend

### New Endpoints

#### `POST /api/auth/send-signup-otp`

**Request:** `{ email: string }`

**Logic:**
- Validate email format
- Check User collection — if email already exists → `400 Email already registered`
- Generate random 6-digit OTP
- Hash OTP with bcrypt (salt rounds: 10)
- Sign JWT `otpToken` with payload `{ email, hashedOtp }`, expiry 10 min, using `JWT_SECRET`
- Call `sendSignupOtpEmail(email, otp)` via mailer
- Return `{ otpToken }`

**Errors:**
- `400` — email missing or invalid format
- `400` — email already registered
- `500` — email send failure

---

#### `POST /api/auth/verify-signup-otp`

**Request:** `{ otpToken: string, otp: string }`

**Logic:**
- Verify and decode `otpToken` using `JWT_SECRET` → extract `{ email, hashedOtp }`
- Compare entered `otp` against `hashedOtp` using bcrypt
- If match: sign `verifiedToken` JWT with payload `{ email, verified: true }`, expiry 15 min
- Return `{ verifiedToken }`

**Errors:**
- `400` — missing fields
- `400` — invalid or expired `otpToken`
- `400` — incorrect OTP
- `400` — OTP expired (JWT expiry handles this)

---

### Modified Endpoint

#### `POST /api/auth/register`

**Request:** `{ name, email, password, contactNumber, verifiedToken }`

**Logic:**
- Verify and decode `verifiedToken` using `JWT_SECRET`
- Check `verified === true` and `email` matches the `email` in request body
- If invalid/expired/mismatch → `400 Email not verified`
- Proceed with existing user creation logic

**Errors:**
- `400` — `verifiedToken` missing
- `400` — token invalid, expired, or email mismatch

---

### Mailer (`utils/mailer.js`)

Add `sendSignupOtpEmail(to, otp)`:
- Subject: "Verify your email — Floral Studio"
- HTML body: styled OTP display, states OTP expires in 10 minutes
- Reuses existing Gmail transporter

---

### Routes (`routes/auth.routes.js`)

Add two new public routes:
```
POST /send-signup-otp   → sendSignupOtp
POST /verify-signup-otp → verifySignupOtp
```

---

## Frontend (`AuthPage.jsx`)

### New State

| Variable | Type | Purpose |
|---|---|---|
| `otpSent` | bool | Show OTP input below email |
| `otpVerified` | bool | Unlock rest of form |
| `otp` | string | 6-digit OTP value |
| `otpToken` | string | JWT from send-signup-otp |
| `verifiedToken` | string | JWT from verify-signup-otp |
| `otpLoading` | bool | Spinner on Send/Verify buttons |
| `resendTimer` | number | Countdown (30s) before resend enabled |

### UI Structure (signup mode)

```
[ Email Address          ] [ Send OTP / Resend (29s) ]
[ OTP input • • • • • •  ] [ Verify ]       ← after otpSent
  ✓ Email verified                           ← after otpVerified
[ Full Name              ]                   ← unlocked after otpVerified
[ Password               ]                   ← unlocked after otpVerified
[ Contact Number         ]                   ← unlocked after otpVerified
[ Create Account         ]                   ← disabled until otpVerified
```

### Button States

- **Send OTP**: disabled if email format invalid or `otpVerified === true`; shows spinner when `otpLoading`
- **Resend OTP**: replaces "Send OTP" after first send; disabled for 30s with countdown; re-sends and resets `otpSent`, clears `otp`
- **Verify**: disabled if `otp.length < 6`; shows spinner when `otpLoading`
- **Create Account**: disabled if `!otpVerified`

### Form Submit (`handleSignup`)

- Include `verifiedToken` in POST body to `/api/auth/register`
- On success: show success message, switch to login tab after 1.8s
- Reset all OTP state on mode switch (signup ↔ login)

---

## Security Notes

- OTP expires via JWT expiry (10 min) — no DB needed
- `verifiedToken` expires in 15 min — account must be created within that window
- Email field is locked after OTP verification so the verified email cannot be changed without re-verifying
- `verifiedToken` email is cross-checked against request body email on register to prevent token reuse

---

## No Database Changes Required

All verification state lives in short-lived JWTs. No new fields on the User model. No temp collections.

# Signup Email Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require OTP email verification before creating a user account — OTP input appears inline below the email field on AuthPage.

**Architecture:** Two new backend endpoints (`send-signup-otp`, `verify-signup-otp`) use short-lived JWTs to carry OTP state — no DB changes needed. The frontend `registerUser` endpoint is modified to require a `verifiedToken` JWT. The AuthPage signup form is restructured: email + "Send OTP" button first, OTP input below it, rest of form unlocks only after verification.

**Tech Stack:** Node.js/Express, jsonwebtoken, bcrypt, nodemailer/Gmail, React, Tailwind CSS, lucide-react

---

## File Map

| File | Change |
|---|---|
| `backend/utils/mailer.js` | Add `sendSignupOtpEmail(to, otp)` |
| `backend/controllers/auth.controllers.js` | Add `sendSignupOtp`, `verifySignupOtp`; modify `registerUser` |
| `backend/routes/auth.routes.js` | Import + wire 2 new controllers |
| `frontend/src/pages/Auth/AuthPage.jsx` | Add OTP state/handlers; restructure signup form UI |

---

### Task 1: Add sendSignupOtpEmail to mailer

**Files:**
- Modify: `backend/utils/mailer.js`

- [ ] **Step 1: Add the new function after the existing `sendOtpEmail`**

  Open `backend/utils/mailer.js`. After line 27 (the closing brace of `sendOtpEmail`), append:

  ```javascript
  export async function sendSignupOtpEmail(to, otp) {
    await transporter.sendMail({
      from: `"Floral Studio" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Verify your email — Floral Studio",
      html: `
        <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fdf8f3;border-radius:16px;">
          <h2 style="font-family:Georgia,serif;color:#3a2416;margin-bottom:8px;">🌸 Verify Your Email</h2>
          <p style="color:#7a5c4a;margin-bottom:24px;">Use the OTP below to verify your email and complete your Floral Studio signup. It expires in <strong>10 minutes</strong>.</p>
          <div style="background:#4a3728;color:#f5e6d3;font-size:32px;font-weight:bold;letter-spacing:12px;text-align:center;padding:20px;border-radius:12px;margin-bottom:24px;">
            ${otp}
          </div>
          <p style="color:#9c7a62;font-size:13px;">If you didn't request this, ignore this email. No account will be created.</p>
        </div>
      `,
    });
  }
  ```

- [ ] **Step 2: Verify the file looks correct**

  ```powershell
  cat "backend/utils/mailer.js"
  ```
  Expected: two exported functions — `sendOtpEmail` and `sendSignupOtpEmail`.

- [ ] **Step 3: Commit**

  ```bash
  git add backend/utils/mailer.js
  git commit -m "feat: add sendSignupOtpEmail to mailer"
  ```

---

### Task 2: Add sendSignupOtp controller

**Files:**
- Modify: `backend/controllers/auth.controllers.js` (lines 1-8 for imports, append at end)

- [ ] **Step 1: Add `sendSignupOtpEmail` to the import on line 8**

  Change line 8 from:
  ```javascript
  import { sendOtpEmail } from "../utils/mailer.js";
  ```
  To:
  ```javascript
  import { sendOtpEmail, sendSignupOtpEmail } from "../utils/mailer.js";
  ```

- [ ] **Step 2: Append the `sendSignupOtp` controller at the end of the file**

  After the closing brace of `resetPassword` (line 318), append:

  ```javascript

  // ─── Signup — Step 1: send OTP to verify email ───────────────────────────────
  export const sendSignupOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return res.status(400).json({ success: false, message: "Valid email is required" });

    const existing = await Auth.findOne({ email: email.trim().toLowerCase() });
    if (existing)
      return res.status(400).json({ success: false, message: "A user with this email already exists" });

    const otp      = String(crypto.randomInt(100000, 999999));
    const otpHash  = await bcrypt.hash(otp, 10);
    const otpToken = jwt.sign(
      { email: email.trim().toLowerCase(), otpHash },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    await sendSignupOtpEmail(email.trim(), otp);
    res.status(200).json({ success: true, otpToken });
  });
  ```

- [ ] **Step 3: Verify with a quick syntax check**

  ```bash
  node --input-type=module < "backend/controllers/auth.controllers.js" 2>&1 | head -5
  ```
  Expected: no output (no syntax errors). If you see a parse error, fix it before continuing.

- [ ] **Step 4: Commit**

  ```bash
  git add backend/controllers/auth.controllers.js
  git commit -m "feat: add sendSignupOtp controller"
  ```

---

### Task 3: Add verifySignupOtp controller

**Files:**
- Modify: `backend/controllers/auth.controllers.js` (append at end)

- [ ] **Step 1: Append the `verifySignupOtp` controller after `sendSignupOtp`**

  ```javascript

  // ─── Signup — Step 2: verify OTP, return verifiedToken ───────────────────────
  export const verifySignupOtp = asyncHandler(async (req, res) => {
    const { otp, otpToken } = req.body;

    if (!otp || !otpToken)
      return res.status(400).json({ success: false, message: "OTP and token are required" });

    let payload;
    try {
      payload = jwt.verify(otpToken, process.env.JWT_SECRET);
    } catch {
      return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    const match = await bcrypt.compare(String(otp), payload.otpHash);
    if (!match)
      return res.status(400).json({ success: false, message: "Incorrect OTP. Please try again." });

    const verifiedToken = jwt.sign(
      { email: payload.email, verified: true },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ success: true, verifiedToken });
  });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add backend/controllers/auth.controllers.js
  git commit -m "feat: add verifySignupOtp controller"
  ```

---

### Task 4: Modify registerUser to require verifiedToken

**Files:**
- Modify: `backend/controllers/auth.controllers.js` (lines 28-56)

- [ ] **Step 1: Replace the `registerUser` function body**

  Replace the entire `registerUser` function (lines 28–56) with:

  ```javascript
  // 📝 Register — verifiedToken required (email must be pre-verified via OTP)
  export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, contactNumber, verifiedToken } = req.body;

    try {
      if (!name?.trim() || !email?.trim() || !password?.trim() || !contactNumber?.trim()) {
        return res.status(400).json({ message: "All fields are required", success: false });
      }

      if (!verifiedToken) {
        return res.status(400).json({ message: "Email verification required", success: false });
      }

      let payload;
      try {
        payload = jwt.verify(verifiedToken, process.env.JWT_SECRET);
      } catch {
        return res.status(400).json({ message: "Email verification expired. Please verify again.", success: false });
      }

      if (!payload.verified || payload.email !== email.trim().toLowerCase()) {
        return res.status(400).json({ message: "Email verification invalid. Please verify again.", success: false });
      }

      const userExists = await Auth.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: "A user with this email already exists", success: false });
      }

      const user = await Auth.create({ name, email, password, contactNumber });

      return res.status(201).json({
        message: "User successfully registered",
        success: true,
        user: { _id: user._id, name: user.name, email: user.email },
      });
    } catch (error) {
      console.error("Error in registerUser:", error);
      return res.status(500).json({ message: "Server error: " + error.message, success: false });
    }
  });
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add backend/controllers/auth.controllers.js
  git commit -m "feat: require verifiedToken in registerUser"
  ```

---

### Task 5: Add new routes

**Files:**
- Modify: `backend/routes/auth.routes.js`

- [ ] **Step 1: Add the two new controllers to the import on lines 3-13**

  Change the import block from:
  ```javascript
  import {
      getMe,
      loginUser,
      registerUser,
      updateProfile,
      getAllUsers,
      updateUserByAdmin,
      toggleUserActive,
      forgotPassword,
      verifyOtp,
      resetPassword,
  } from "../controllers/auth.controllers.js";
  ```
  To:
  ```javascript
  import {
      getMe,
      loginUser,
      registerUser,
      updateProfile,
      getAllUsers,
      updateUserByAdmin,
      toggleUserActive,
      forgotPassword,
      verifyOtp,
      resetPassword,
      sendSignupOtp,
      verifySignupOtp,
  } from "../controllers/auth.controllers.js";
  ```

- [ ] **Step 2: Add the two new public routes after line 24 (`reset-password`)**

  After:
  ```javascript
  router.post("/reset-password",  resetPassword);
  ```
  Add:
  ```javascript
  router.post("/send-signup-otp",   sendSignupOtp);
  router.post("/verify-signup-otp", verifySignupOtp);
  ```

- [ ] **Step 3: Start the backend and verify the new routes respond**

  ```bash
  cd backend && node server.js
  ```
  In a new terminal:
  ```bash
  curl -s -X POST http://localhost:3001/api/auth/send-signup-otp \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"\"}" | node -e "process.stdin.resume();process.stdin.on('data',d=>console.log(d.toString()))"
  ```
  Expected response: `{"success":false,"message":"Valid email is required"}`

- [ ] **Step 4: Commit**

  ```bash
  git add backend/routes/auth.routes.js
  git commit -m "feat: add send-signup-otp and verify-signup-otp routes"
  ```

---

### Task 6: Add signup OTP state and handlers to AuthPage

**Files:**
- Modify: `frontend/src/pages/Auth/AuthPage.jsx`

- [ ] **Step 1: Add `useEffect` to the React import (line 1)**

  Change:
  ```javascript
  import { useState } from "react";
  ```
  To:
  ```javascript
  import { useState, useEffect } from "react";
  ```

- [ ] **Step 2: Add signup OTP state variables after the existing forgot-password state block (after line 72)**

  After:
  ```javascript
  const [showForgotConfirm, setShowForgotConfirm] = useState(false);
  ```
  Add:
  ```javascript

  // ─── SIGNUP OTP STATE ─────────────────────────────────────────────────────
  const [signupOtpSent,       setSignupOtpSent]       = useState(false);
  const [signupOtpVerified,   setSignupOtpVerified]   = useState(false);
  const [signupOtp,           setSignupOtp]           = useState("");
  const [signupOtpToken,      setSignupOtpToken]      = useState("");
  const [signupVerifiedToken, setSignupVerifiedToken] = useState("");
  const [signupOtpLoading,    setSignupOtpLoading]    = useState(false);
  const [signupOtpError,      setSignupOtpError]      = useState(null);
  const [resendTimer,         setResendTimer]         = useState(0);
  ```

- [ ] **Step 3: Add the resend countdown effect after the new state block**

  After the state block added in Step 2, add:
  ```javascript

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);
  ```

- [ ] **Step 4: Add `handleSendSignupOtp` handler after the `resetForgot` function (after line 157)**

  After the closing brace of `resetForgot` (line 157), add:
  ```javascript

  async function handleSendSignupOtp() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return setErrors(e => ({ ...e, email: "Enter a valid email" }));
    setSignupOtpLoading(true); setSignupOtpError(null);
    try {
      const res  = await fetch(`${API}/send-signup-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setSignupOtpToken(data.otpToken);
      setSignupOtpSent(true);
      setSignupOtp("");
      setResendTimer(30);
    } catch (err) {
      setSignupOtpError(err.message);
    } finally {
      setSignupOtpLoading(false);
    }
  }

  async function handleVerifySignupOtp() {
    if (!/^\d{6}$/.test(signupOtp))
      return setSignupOtpError("Enter the 6-digit OTP");
    setSignupOtpLoading(true); setSignupOtpError(null);
    try {
      const res  = await fetch(`${API}/verify-signup-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: signupOtp, otpToken: signupOtpToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setSignupVerifiedToken(data.verifiedToken);
      setSignupOtpVerified(true);
    } catch (err) {
      setSignupOtpError(err.message);
    } finally {
      setSignupOtpLoading(false);
    }
  }
  ```

- [ ] **Step 5: Update `switchMode` to reset signup OTP state**

  Replace the existing `switchMode` function (lines 141-147):
  ```javascript
  function switchMode(m) {
    setMode(m);
    setErrors({});
    setApiError(null);
    setApiSuccess(null);
    setForm({ name: "", email: "", password: "", contactNumber: "" });
  }
  ```
  With:
  ```javascript
  function switchMode(m) {
    setMode(m);
    setErrors({});
    setApiError(null);
    setApiSuccess(null);
    setForm({ name: "", email: "", password: "", contactNumber: "" });
    setSignupOtpSent(false);
    setSignupOtpVerified(false);
    setSignupOtp("");
    setSignupOtpToken("");
    setSignupVerifiedToken("");
    setSignupOtpError(null);
    setResendTimer(0);
  }
  ```

- [ ] **Step 6: Update `handleSubmit` to include `verifiedToken` in signup body and guard unverified submit**

  In `handleSubmit`, replace lines 107-111:
  ```javascript
      const endpoint = mode === "login" ? `${API}/login` : `${API}/register`;
      const body     = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, contactNumber: form.contactNumber };
  ```
  With:
  ```javascript
      if (mode === "signup" && !signupOtpVerified) {
        setApiError("Please verify your email first");
        setLoading(false);
        return;
      }
      const endpoint = mode === "login" ? `${API}/login` : `${API}/register`;
      const body     = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, contactNumber: form.contactNumber, verifiedToken: signupVerifiedToken };
  ```

- [ ] **Step 7: Commit**

  ```bash
  git add frontend/src/pages/Auth/AuthPage.jsx
  git commit -m "feat: add signup OTP state and handlers to AuthPage"
  ```

---

### Task 7: Restructure signup form UI

**Files:**
- Modify: `frontend/src/pages/Auth/AuthPage.jsx`

- [ ] **Step 1: Replace the signup/login form JSX inside `<form onSubmit={handleSubmit} className="space-y-4">`**

  The current form (lines 502-575) has all fields in a single block for both modes. Replace the entire `<form>` element and its contents with:

  ```jsx
  <form onSubmit={handleSubmit} className="space-y-4">

    {mode === "login" ? (
      /* ── LOGIN FIELDS ── */
      <>
        <Field label="Email Address" type="email" placeholder="you@example.com"
          value={form.email} onChange={v => set("email", v)}
          error={errors.email} icon={Mail} />

        <div>
          <Field
            label="Password"
            type={showPass ? "text" : "password"}
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={v => set("password", v)}
            error={errors.password}
            icon={Lock}
            rightEl={
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="hover:opacity-70" style={{ color: "#9c7a62" }}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            }
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              onClick={() => { setForgotEmail(form.email); setForgotStep("email"); }}
              className="text-xs font-semibold hover:opacity-70 transition-opacity"
              style={{ color: "#c97d5b" }}
            >
              Forgot Password?
            </button>
          </div>
        </div>
      </>
    ) : (
      /* ── SIGNUP FIELDS ── */
      <>
        {/* Email row with Send OTP button */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold" style={{ color: "#4a3728" }}>Email Address</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "#9c7a62" }} />
              <input
                type="email"
                value={form.email}
                onChange={e => { if (!signupOtpVerified) set("email", e.target.value); }}
                placeholder="you@example.com"
                disabled={signupOtpVerified}
                className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                style={{
                  paddingLeft: "2.5rem",
                  borderColor: errors.email ? "#dc2626" : "#e8d5c4",
                  background: signupOtpVerified ? "#f0e4d8" : errors.email ? "#fff5f5" : "white",
                  color: "#3a2416",
                }}
              />
            </div>
            {!signupOtpVerified && (
              <button
                type="button"
                onClick={handleSendSignupOtp}
                disabled={signupOtpLoading || resendTimer > 0}
                className="px-4 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60 whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}
              >
                {signupOtpLoading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  : signupOtpSent
                    ? resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend OTP"
                    : "Send OTP"
                }
              </button>
            )}
          </div>
          {errors.email && <p className="text-xs" style={{ color: "#dc2626" }}>{errors.email}</p>}
        </div>

        {/* OTP input — shown after Send OTP, hidden after verified */}
        {signupOtpSent && !signupOtpVerified && (
          <div className="space-y-1.5">
            <label className="text-sm font-semibold" style={{ color: "#4a3728" }}>Enter OTP</label>
            <div className="flex gap-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={signupOtp}
                onChange={e => { setSignupOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setSignupOtpError(null); }}
                placeholder="6-digit OTP"
                className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition-all"
                style={{ borderColor: "#e8d5c4", color: "#3a2416" }}
              />
              <button
                type="button"
                onClick={handleVerifySignupOtp}
                disabled={signupOtpLoading || signupOtp.length < 6}
                className="px-4 py-3 rounded-xl text-white text-sm font-bold transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}
              >
                {signupOtpLoading
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                  : "Verify"
                }
              </button>
            </div>
            <p className="text-xs" style={{ color: "#9c7a62" }}>OTP sent to {form.email}</p>
          </div>
        )}

        {/* OTP error */}
        {signupOtpError && (
          <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
            style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
            <span className="mt-0.5">⚠️</span><span>{signupOtpError}</span>
          </div>
        )}

        {/* Verified badge */}
        {signupOtpVerified && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}>
            <span>✓</span><span>Email verified</span>
          </div>
        )}

        {/* Rest of signup form — unlocked after email verified */}
        {signupOtpVerified && (
          <>
            <Field label="Full Name" placeholder="Ananya Mehta" value={form.name}
              onChange={v => set("name", v)} error={errors.name} icon={User} />

            <Field
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={v => set("password", v)}
              error={errors.password}
              icon={Lock}
              rightEl={
                <button type="button" onClick={() => setShowPass(s => !s)}
                  className="hover:opacity-70" style={{ color: "#9c7a62" }}>
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />

            <Field label="Contact Number" placeholder="+91 98765 43210"
              value={form.contactNumber} onChange={v => set("contactNumber", v)}
              error={errors.contactNumber} icon={Phone} />
          </>
        )}
      </>
    )}

    {apiSuccess && (
      <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
        style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}>
        <span>✅</span>
        <span>{apiSuccess}</span>
      </div>
    )}

    {apiError && (
      <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
        style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
        <span className="mt-0.5">⚠️</span>
        <span>{apiError}</span>
      </div>
    )}

    <button type="submit" disabled={loading || (mode === "signup" && !signupOtpVerified)}
      className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60 mt-2"
      style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
      {loading
        ? <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {mode === "login" ? "Signing in..." : "Creating account..."}
          </span>
        : mode === "login" ? "Sign In" : "Create Account"
      }
    </button>
  </form>
  ```

- [ ] **Step 2: Start the frontend dev server and verify in browser**

  ```bash
  cd frontend && npm run dev
  ```
  Open `http://localhost:5173` → navigate to `/login` → switch to "Create Account" tab.

  **Verify these states:**
  1. Only email field + "Send OTP" button visible initially
  2. Enter invalid email → click "Send OTP" → error shown below email field
  3. Enter valid email → click "Send OTP" → button shows spinner, then "Resend (30s)" countdown
  4. OTP input appears below email field
  5. Enter wrong OTP → click "Verify" → error message shown
  6. Enter correct OTP → "✓ Email verified" badge appears, OTP input hides, Name/Password/Phone fields appear
  7. "Create Account" button is disabled until step 6 is complete
  8. Email field is locked/dimmed after verification
  9. Switch to "Sign In" tab → normal login form, no OTP fields
  10. Switch back to "Create Account" → all OTP state is reset

- [ ] **Step 3: Commit**

  ```bash
  git add frontend/src/pages/Auth/AuthPage.jsx
  git commit -m "feat: restructure signup form with inline OTP email verification"
  ```

---

### Task 8: End-to-end verification

- [ ] **Step 1: Full signup flow test in browser**

  With both backend (`npm run dev` or `node server.js`) and frontend running:

  1. Go to `http://localhost:5173/login` → "Create Account"
  2. Enter a real email you can check → click "Send OTP"
  3. Check email inbox for OTP from Floral Studio
  4. Enter OTP → click "Verify" → see "✓ Email verified"
  5. Fill name, password (6+ chars), phone → click "Create Account"
  6. See success message → auto-switch to login tab
  7. Login with the same email + password → should succeed

- [ ] **Step 2: Verify duplicate email is blocked**

  1. Try the same email on signup again → click "Send OTP"
  2. Expected: error "A user with this email already exists" (no OTP sent)

- [ ] **Step 3: Verify expired verifiedToken is rejected**

  This can only be tested by waiting 15 minutes after verifying OTP and then submitting the form, or by temporarily changing `expiresIn: "15m"` to `"5s"` in `verifySignupOtp`, verifying the OTP, waiting 6 seconds, then submitting the form. Expected backend response: `{"success":false,"message":"Email verification expired. Please verify again."}`

- [ ] **Step 4: Final commit**

  ```bash
  git add -A
  git commit -m "feat: complete signup email verification flow"
  ```

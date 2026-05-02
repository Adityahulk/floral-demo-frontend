# Forgot Password (OTP) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add OTP-based password reset to the signin page — email entry → 6-digit OTP → new password — all inline in `AuthPage.jsx`, stateless via short-lived JWTs.

**Architecture:** Three public backend endpoints handle the three steps. OTP is bcrypt-hashed and embedded in a signed `otpToken` JWT (10 min) so no DB changes are needed. After OTP verification a `resetToken` JWT (5 min, `verified:true`) unlocks the password reset. Gmail SMTP via nodemailer sends the OTP email.

**Tech Stack:** Node.js `crypto` (built-in), `nodemailer`, `bcryptjs`, `jsonwebtoken`, React `useState`

---

## File Map

| File | Change |
|---|---|
| `backend/utils/mailer.js` | Create — nodemailer transporter + `sendOtpEmail` |
| `backend/controllers/auth.controllers.js` | Add `forgotPassword`, `verifyOtp`, `resetPassword` |
| `backend/routes/auth.routes.js` | Add 3 public routes |
| `backend/.env` | Add `GMAIL_USER`, `GMAIL_PASS` |
| `frontend/src/pages/Auth/AuthPage.jsx` | Add forgot-password flow (4 steps) |

---

## Task 1: Install nodemailer and add env vars

**Files:**
- Modify: `backend/package.json` (via npm install)
- Modify: `backend/.env`

- [ ] **Step 1: Install nodemailer**

```bash
cd "c:\projects\fl\Floral Studio\backend"
npm install nodemailer
```

Expected: nodemailer appears in `package.json` dependencies.

- [ ] **Step 2: Add Gmail credentials to `.env`**

Open `backend/.env` and append these two lines (fill in real values):

```
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASS=your_16_char_app_password
```

> **How to get GMAIL_PASS:** Go to Google Account → Security → 2-Step Verification → App passwords → generate one for "Mail". Use the 16-character code (no spaces).

- [ ] **Step 3: Commit**

```bash
cd "c:\projects\fl\Floral Studio\backend"
git add package.json package-lock.json
git commit -m "chore: install nodemailer for OTP email"
```

---

## Task 2: Create `backend/utils/mailer.js`

**Files:**
- Create: `backend/utils/mailer.js`

- [ ] **Step 1: Create the file**

```js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOtpEmail(to, otp) {
  await transporter.sendMail({
    from: `"Floral Studio" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Floral Studio Password Reset OTP",
    html: `
      <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fdf8f3;border-radius:16px;">
        <h2 style="font-family:Georgia,serif;color:#3a2416;margin-bottom:8px;">🌸 Password Reset</h2>
        <p style="color:#7a5c4a;margin-bottom:24px;">Use the OTP below to reset your Floral Studio password. It expires in <strong>10 minutes</strong>.</p>
        <div style="background:#4a3728;color:#f5e6d3;font-size:32px;font-weight:bold;letter-spacing:12px;text-align:center;padding:20px;border-radius:12px;margin-bottom:24px;">
          ${otp}
        </div>
        <p style="color:#9c7a62;font-size:13px;">If you didn't request this, ignore this email. Your password won't change.</p>
      </div>
    `,
  });
}
```

- [ ] **Step 2: Verify the file was created**

```bash
cd "c:\projects\fl\Floral Studio\backend"
node -e "import('./utils/mailer.js').then(() => console.log('mailer ok')).catch(e => console.error(e))"
```

Expected output: `mailer ok`

- [ ] **Step 3: Commit**

```bash
git add utils/mailer.js
git commit -m "feat: add nodemailer OTP email utility"
```

---

## Task 3: Add `forgotPassword`, `verifyOtp`, `resetPassword` controllers

**Files:**
- Modify: `backend/controllers/auth.controllers.js`

- [ ] **Step 1: Add imports at the top of `auth.controllers.js`**

The file currently starts with:
```js
import { asyncHandler } from "../middlewares/asyncHandler.js";
import Auth from "../models/auth.model.js";
import Order from "../models/order.model.js";
import cloudinary from "../config/cloudinary.js";
```

Replace with:
```js
import crypto from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import Auth from "../models/auth.model.js";
import Order from "../models/order.model.js";
import cloudinary from "../config/cloudinary.js";
import { sendOtpEmail } from "../utils/mailer.js";
```

- [ ] **Step 2: Append the three new controllers at the bottom of `auth.controllers.js`**

```js
// ─── Forgot Password — Step 1: send OTP ──────────────────────────────────────
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email?.trim())
    return res.status(400).json({ success: false, message: "Email is required" });

  const user = await Auth.findOne({ email: email.trim().toLowerCase() });
  if (!user)
    return res.status(404).json({ success: false, message: "No account found with this email" });

  const otp     = String(crypto.randomInt(100000, 999999));
  const otpHash = await bcrypt.hash(otp, 10);
  const otpToken = jwt.sign(
    { email: user.email, otpHash },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  await sendOtpEmail(user.email, otp);
  res.status(200).json({ success: true, otpToken });
});

// ─── Forgot Password — Step 2: verify OTP ────────────────────────────────────
export const verifyOtp = asyncHandler(async (req, res) => {
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

  const resetToken = jwt.sign(
    { email: payload.email, verified: true },
    process.env.JWT_SECRET,
    { expiresIn: "5m" }
  );

  res.status(200).json({ success: true, resetToken });
});

// ─── Forgot Password — Step 3: reset password ────────────────────────────────
export const resetPassword = asyncHandler(async (req, res) => {
  const { password, resetToken } = req.body;
  if (!password || !resetToken)
    return res.status(400).json({ success: false, message: "Password and token are required" });

  let payload;
  try {
    payload = jwt.verify(resetToken, process.env.JWT_SECRET);
  } catch {
    return res.status(400).json({ success: false, message: "Session expired. Please start over." });
  }

  if (!payload.verified)
    return res.status(400).json({ success: false, message: "OTP verification required" });

  if (password.length < 6)
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });

  const user = await Auth.findOne({ email: payload.email });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  user.password = password;
  await user.save();

  res.status(200).json({ success: true, message: "Password reset successfully" });
});
```

- [ ] **Step 3: Verify the backend starts without errors**

```bash
cd "c:\projects\fl\Floral Studio\backend"
node --input-type=module <<< "import('./controllers/auth.controllers.js').then(() => console.log('ok')).catch(e => console.error(e.message))"
```

Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add controllers/auth.controllers.js
git commit -m "feat: add forgotPassword, verifyOtp, resetPassword controllers"
```

---

## Task 4: Add the 3 routes to `auth.routes.js`

**Files:**
- Modify: `backend/routes/auth.routes.js`

- [ ] **Step 1: Add the new imports to `auth.routes.js`**

The current import block is:
```js
import {
    getMe,
    loginUser,
    registerUser,
    updateProfile,
    getAllUsers,
    updateUserByAdmin,
    toggleUserActive,
} from "../controllers/auth.controllers.js";
```

Replace with:
```js
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

- [ ] **Step 2: Add 3 routes in the Public section**

Current public section:
```js
// ─── Public ───────────────────────────────────────────────────────────────────
router.post("/register", registerUser);
router.post("/login",    loginUser);
```

Replace with:
```js
// ─── Public ───────────────────────────────────────────────────────────────────
router.post("/register",        registerUser);
router.post("/login",           loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp",      verifyOtp);
router.post("/reset-password",  resetPassword);
```

- [ ] **Step 3: Manual test — verify routes are reachable**

With the backend running, send a test request:

```bash
curl -s -X POST http://localhost:3001/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@test.com"}' | node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>console.log(JSON.parse(d)))"
```

Expected: `{ success: false, message: 'No account found with this email' }`

- [ ] **Step 4: Commit**

```bash
git add routes/auth.routes.js
git commit -m "feat: add forgot-password, verify-otp, reset-password routes"
```

---

## Task 5: Add forgot-password flow to `AuthPage.jsx`

**Files:**
- Modify: `frontend/src/pages/Auth/AuthPage.jsx`

- [ ] **Step 1: Add `KeyRound` to lucide imports and add new state variables**

Current imports line:
```js
import { Eye, EyeOff, Mail, Lock, User, Phone, Flower } from "lucide-react";
```

Replace with:
```js
import { Eye, EyeOff, Mail, Lock, User, Phone, Flower, KeyRound, ArrowLeft, RotateCcw } from "lucide-react";
```

Inside `AuthPage()`, after the existing `useState` declarations (after `const [errors, setErrors] = useState({});`), add:

```js
// ─── Forgot Password State ────────────────────────────────────────────────────
const [forgotStep,    setForgotStep]    = useState(null); // null|"email"|"otp"|"password"|"done"
const [fpEmail,       setFpEmail]       = useState("");
const [fpOtp,         setFpOtp]         = useState("");
const [fpPassword,    setFpPassword]    = useState("");
const [fpConfirm,     setFpConfirm]     = useState("");
const [fpOtpToken,    setFpOtpToken]    = useState("");
const [fpResetToken,  setFpResetToken]  = useState("");
const [fpLoading,     setFpLoading]     = useState(false);
const [fpError,       setFpError]       = useState(null);
const [fpShowPass,    setFpShowPass]    = useState(false);
```

- [ ] **Step 2: Add the forgot password handler functions**

Add these functions inside `AuthPage()`, after the `switchMode` function:

```js
function startForgot() {
  setForgotStep("email");
  setFpEmail("");
  setFpOtp("");
  setFpPassword("");
  setFpConfirm("");
  setFpOtpToken("");
  setFpResetToken("");
  setFpError(null);
}

function exitForgot() {
  setForgotStep(null);
  setFpError(null);
}

async function handleSendOtp(e) {
  e.preventDefault();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail)) {
    setFpError("Enter a valid email address"); return;
  }
  setFpLoading(true); setFpError(null);
  try {
    const res  = await fetch(`${API}/forgot-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    setFpOtpToken(data.otpToken);
    setForgotStep("otp");
  } catch (err) {
    setFpError(err.message);
  } finally {
    setFpLoading(false);
  }
}

async function handleResendOtp() {
  setFpLoading(true); setFpError(null);
  try {
    const res  = await fetch(`${API}/forgot-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fpEmail }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    setFpOtpToken(data.otpToken);
    setFpOtp("");
    setFpError(null);
  } catch (err) {
    setFpError(err.message);
  } finally {
    setFpLoading(false);
  }
}

async function handleVerifyOtp(e) {
  e.preventDefault();
  if (!/^\d{6}$/.test(fpOtp)) {
    setFpError("Enter a valid 6-digit OTP"); return;
  }
  setFpLoading(true); setFpError(null);
  try {
    const res  = await fetch(`${API}/verify-otp`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ otp: fpOtp, otpToken: fpOtpToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    setFpResetToken(data.resetToken);
    setForgotStep("password");
  } catch (err) {
    setFpError(err.message);
  } finally {
    setFpLoading(false);
  }
}

async function handleResetPassword(e) {
  e.preventDefault();
  if (fpPassword.length < 6) { setFpError("Password must be at least 6 characters"); return; }
  if (fpPassword !== fpConfirm) { setFpError("Passwords do not match"); return; }
  setFpLoading(true); setFpError(null);
  try {
    const res  = await fetch(`${API}/reset-password`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: fpPassword, resetToken: fpResetToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Something went wrong");
    setForgotStep("done");
  } catch (err) {
    setFpError(err.message);
  } finally {
    setFpLoading(false);
  }
}
```

- [ ] **Step 3: Add the forgot-password UI rendering**

Add a `FpErrorBox` helper just before the `return (` statement inside `AuthPage()`:

```js
const FpErrorBox = fpError ? (
  <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
    style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
    <span className="mt-0.5">⚠️</span><span>{fpError}</span>
  </div>
) : null;
```

- [ ] **Step 4: Wrap the right panel form area with forgot-step rendering**

Find this block in the `return` (right panel, starts at line ~178):
```jsx
      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
```

The full right panel content (from the mobile logo down to the bottom `<p>`) needs the forgot-password steps injected. Replace everything **inside** `<div className="w-full max-w-md">` with:

```jsx
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={FloralLogo} alt="" className="w-10 h-10 rounded-full" />
            <span style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="font-bold text-xl">
              Floral Studio
            </span>
          </div>

          {/* ── FORGOT PASSWORD STEPS ── */}
          {forgotStep === "email" && (
            <div>
              <button onClick={exitForgot} className="flex items-center gap-1.5 text-sm mb-6 hover:opacity-70" style={{ color: "#9c7a62" }}>
                <ArrowLeft size={14} /> Back to Sign In
              </button>
              <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-1">Forgot Password?</h2>
              <p style={{ color: "#9c7a62" }} className="text-sm mb-6">Enter your email and we'll send you a 6-digit OTP.</p>
              <form onSubmit={handleSendOtp} className="space-y-4">
                <Field label="Email Address" type="email" placeholder="you@example.com"
                  value={fpEmail} onChange={v => { setFpEmail(v); setFpError(null); }}
                  icon={Mail} />
                {FpErrorBox}
                <button type="submit" disabled={fpLoading}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                  {fpLoading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Sending...</span>
                    : "Send OTP"}
                </button>
              </form>
            </div>
          )}

          {forgotStep === "otp" && (
            <div>
              <button onClick={() => { setForgotStep("email"); setFpError(null); }} className="flex items-center gap-1.5 text-sm mb-6 hover:opacity-70" style={{ color: "#9c7a62" }}>
                <ArrowLeft size={14} /> Back
              </button>
              <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-1">Enter OTP</h2>
              <p style={{ color: "#9c7a62" }} className="text-sm mb-6">We sent a 6-digit code to <strong>{fpEmail}</strong>.</p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <Field label="6-Digit OTP" placeholder="123456" value={fpOtp}
                  onChange={v => { setFpOtp(v.replace(/\D/g, "").slice(0, 6)); setFpError(null); }}
                  icon={KeyRound} />
                {FpErrorBox}
                <button type="submit" disabled={fpLoading}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                  {fpLoading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying...</span>
                    : "Verify OTP"}
                </button>
              </form>
              <button onClick={handleResendOtp} disabled={fpLoading}
                className="flex items-center gap-1.5 text-sm mt-4 mx-auto hover:opacity-70 disabled:opacity-40"
                style={{ color: "#c97d5b" }}>
                <RotateCcw size={13} /> Resend OTP
              </button>
            </div>
          )}

          {forgotStep === "password" && (
            <div>
              <button onClick={() => { setForgotStep("otp"); setFpError(null); }} className="flex items-center gap-1.5 text-sm mb-6 hover:opacity-70" style={{ color: "#9c7a62" }}>
                <ArrowLeft size={14} /> Back
              </button>
              <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-1">New Password</h2>
              <p style={{ color: "#9c7a62" }} className="text-sm mb-6">Choose a strong password for your account.</p>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <Field label="New Password" type={fpShowPass ? "text" : "password"} placeholder="Min. 6 characters"
                  value={fpPassword} onChange={v => { setFpPassword(v); setFpError(null); }}
                  icon={Lock}
                  rightEl={
                    <button type="button" onClick={() => setFpShowPass(s => !s)} className="hover:opacity-70" style={{ color: "#9c7a62" }}>
                      {fpShowPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  }
                />
                <Field label="Confirm Password" type={fpShowPass ? "text" : "password"} placeholder="Repeat password"
                  value={fpConfirm} onChange={v => { setFpConfirm(v); setFpError(null); }}
                  icon={Lock} />
                {FpErrorBox}
                <button type="submit" disabled={fpLoading}
                  className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 disabled:opacity-60"
                  style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                  {fpLoading
                    ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Resetting...</span>
                    : "Reset Password"}
                </button>
              </form>
            </div>
          )}

          {forgotStep === "done" && (
            <div className="text-center">
              <div className="text-5xl mb-4">🌸</div>
              <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-2">Password Reset!</h2>
              <p style={{ color: "#7a5c4a" }} className="text-sm mb-6">Your password has been updated successfully. You can now sign in with your new password.</p>
              <button onClick={exitForgot}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                Back to Sign In
              </button>
            </div>
          )}

          {/* ── NORMAL LOGIN / SIGNUP (hidden during forgot flow) ── */}
          {!forgotStep && (
            <>
              {/* Tab toggle */}
              <div className="flex rounded-2xl p-1 mb-8" style={{ background: "#f0e4d8" }}>
                {["login", "signup"].map(m => (
                  <button key={m} onClick={() => switchMode(m)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all"
                    style={mode === m
                      ? { background: "white", color: "#3a2416", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }
                      : { color: "#9c7a62" }}>
                    {m === "login" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold">
                  {mode === "login" ? "Welcome back" : "Join us today"}
                </h2>
                <p style={{ color: "#9c7a62" }} className="text-sm mt-1">
                  {mode === "login"
                    ? "Sign in to your account to continue"
                    : "Create your account to get started"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <Field label="Full Name" placeholder="Ananya Mehta" value={form.name}
                    onChange={v => set("name", v)} error={errors.name} icon={User} />
                )}

                <Field label="Email Address" type="email" placeholder="you@example.com"
                  value={form.email} onChange={v => set("email", v)}
                  error={errors.email} icon={Mail} />

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

                {mode === "login" && (
                  <div className="text-right">
                    <button type="button" onClick={startForgot}
                      className="text-xs font-semibold hover:opacity-70"
                      style={{ color: "#c97d5b" }}>
                      Forgot Password?
                    </button>
                  </div>
                )}

                {mode === "signup" && (
                  <Field label="Contact Number" placeholder="+91 98765 43210"
                    value={form.contactNumber} onChange={v => set("contactNumber", v)}
                    error={errors.contactNumber} icon={Phone} />
                )}

                {apiSuccess && (
                  <div className="flex items-center gap-2 p-3 rounded-xl text-sm"
                    style={{ background: "#dcfce7", color: "#16a34a", border: "1px solid #bbf7d0" }}>
                    <span>✅</span><span>{apiSuccess}</span>
                  </div>
                )}

                {apiError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
                    style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
                    <span className="mt-0.5">⚠️</span><span>{apiError}</span>
                  </div>
                )}

                <button type="submit" disabled={loading}
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

              <p className="text-center text-sm mt-6" style={{ color: "#9c7a62" }}>
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => switchMode(mode === "login" ? "signup" : "login")}
                  className="font-bold hover:opacity-70"
                  style={{ color: "#c97d5b" }}>
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </>
          )}
```

- [ ] **Step 5: Verify the app compiles without errors**

Check the terminal running `npm run dev` — no red errors should appear. Navigate to `http://localhost:5173/auth` and confirm the Sign In form still renders normally.

- [ ] **Step 6: Commit**

```bash
cd "c:\projects\fl\Floral Studio\frontend"
git add src/pages/Auth/AuthPage.jsx
git commit -m "feat: add forgot password OTP flow to AuthPage"
```

---

## Task 6: End-to-end verification

- [ ] **Step 1: Test the full happy path**

1. Go to `http://localhost:5173/auth`
2. Click "Forgot Password?" below the password field
3. Enter the email of an existing active user → click "Send OTP"
4. Check the inbox for the OTP email
5. Enter the 6-digit OTP → click "Verify OTP"
6. Enter a new password (min 6 chars) + confirm → click "Reset Password"
7. Confirm the success screen appears
8. Click "Back to Sign In" and log in with the new password

- [ ] **Step 2: Test error cases**

| Scenario | Expected |
|---|---|
| Step 1 — unknown email | "No account found with this email" |
| Step 2 — wrong OTP | "Incorrect OTP. Please try again." |
| Step 2 — wait 10 min then submit | "OTP has expired. Please request a new one." |
| Step 3 — password < 6 chars | "Password must be at least 6 characters" |
| Step 3 — confirm mismatch | "Passwords do not match" |
| Step 2 — click Resend OTP | New OTP email arrives, old OTP no longer works |

- [ ] **Step 3: Test "Back" navigation**

- From step 2 → click "← Back" → goes to email input (step 1)
- From step 3 → click "← Back" → goes to OTP input (step 2)
- From step 1 → click "← Back to Sign In" → exits forgot flow, login form shows

- [ ] **Step 4: Commit if any fixes were made during testing**

```bash
cd "c:\projects\fl\Floral Studio\frontend"
git add -p
git commit -m "fix: forgot password flow corrections"
```

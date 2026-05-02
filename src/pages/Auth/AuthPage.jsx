import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { setAuth } from "../../utils/auth";
import FloralLogo from "../../assets/floral-logo.png";

const API = "http://localhost:3001/api/auth";

// ─── FIELD ────────────────────────────────────────────────────────────────────

function Field({ label, type = "text", value, onChange, error, placeholder, icon: Icon, rightEl }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold" style={{ color: "#4a3728" }}>{label}</label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#9c7a62" }} />
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border px-4 py-3 text-sm outline-none transition-all"
          style={{
            paddingLeft: Icon ? "2.5rem" : "1rem",
            paddingRight: rightEl ? "3rem" : "1rem",
            borderColor: error ? "#dc2626" : "#e8d5c4",
            background: error ? "#fff5f5" : "white",
            color: "#3a2416",
          }}
          onFocus={e => { if (!error) e.target.style.borderColor = "#c97d5b"; }}
          onBlur={e => { if (!error) e.target.style.borderColor = "#e8d5c4"; }}
        />
        {rightEl && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>}
      </div>
      {error && <p className="text-xs" style={{ color: "#dc2626" }}>{error}</p>}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from || "/";

  const [mode,      setMode]      = useState("login");
  const [loading,    setLoading]    = useState(false);
  const [apiError,   setApiError]   = useState(null);
  const [apiSuccess, setApiSuccess] = useState(null);
  const [showPass,   setShowPass]   = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", contactNumber: "",
  });
  const [errors, setErrors] = useState({});

  // ─── FORGOT PASSWORD STATE ────────────────────────────────────────────────
  const [forgotStep,    setForgotStep]    = useState(null); // null | "email" | "otp" | "password" | "done"
  const [otpToken,      setOtpToken]      = useState("");
  const [resetToken,    setResetToken]    = useState("");
  const [forgotEmail,   setForgotEmail]   = useState("");
  const [forgotOtp,     setForgotOtp]     = useState("");
  const [forgotPass,    setForgotPass]    = useState("");
  const [forgotConfirm, setForgotConfirm] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError,   setForgotError]   = useState(null);
  const [showForgotPass,   setShowForgotPass]   = useState(false);
  const [showForgotConfirm, setShowForgotConfirm] = useState(false);

  // ─── SIGNUP OTP STATE ─────────────────────────────────────────────────────
  const [signupOtpSent,       setSignupOtpSent]       = useState(false);
  const [signupOtpVerified,   setSignupOtpVerified]   = useState(false);
  const [signupOtp,           setSignupOtp]           = useState("");
  const [signupOtpToken,      setSignupOtpToken]      = useState("");
  const [signupVerifiedToken, setSignupVerifiedToken] = useState("");
  const [signupOtpLoading,    setSignupOtpLoading]    = useState(false);
  const [signupOtpError,      setSignupOtpError]      = useState(null);
  const [resendTimer,         setResendTimer]         = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(n => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
    setApiError(null);
    setApiSuccess(null);
  }

  function validate() {
    const e = {};
    if (mode === "signup" && !form.name.trim())
      e.name = "Name is required";
    if (!form.email.trim())
      e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.password)
      e.password = "Password is required";
    else if (form.password.length < 6)
      e.password = "Password must be at least 6 characters";
    if (mode === "signup" && !form.contactNumber.trim())
      e.contactNumber = "Contact number is required";
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError(null);
    setApiSuccess(null);
    try {
      if (mode === "signup" && !signupOtpVerified) {
        setApiError("Please verify your email first");
        setLoading(false);
        return;
      }
      const endpoint = mode === "login" ? `${API}/login` : `${API}/register`;
      const body     = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, contactNumber: form.contactNumber, verifiedToken: signupVerifiedToken };

      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      const token = data.token ?? data.data?.token ?? data.accessToken;
      const role  = data.user?.role ?? data.data?.user?.role ?? data.role ?? "user";

      if (!token) {
        setApiSuccess(data.message || "Account created! Please sign in.");
        setTimeout(() => { switchMode("login"); setApiSuccess(null); }, 1800);
        return;
      }

      setAuth({ token, role });
      if (role === "admin") navigate("/admin", { replace: true });
      else navigate(from, { replace: true });

    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

  // ─── FORGOT PASSWORD HANDLERS ─────────────────────────────────────────────

  function resetForgot() {
    setForgotStep(null);
    setOtpToken(""); setResetToken("");
    setForgotEmail(""); setForgotOtp("");
    setForgotPass(""); setForgotConfirm("");
    setForgotError(null);
  }

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

  async function handleSendOtp(e) {
    e?.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail))
      return setForgotError("Enter a valid email address");
    setForgotLoading(true); setForgotError(null);
    try {
      const res  = await fetch(`${API}/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpToken(data.otpToken);
      setForgotStep("otp");
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(forgotOtp)) return setForgotError("Enter the 6-digit OTP");
    setForgotLoading(true); setForgotError(null);
    try {
      const res  = await fetch(`${API}/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: forgotOtp, otpToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setResetToken(data.resetToken);
      setForgotStep("password");
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault();
    if (forgotPass.length < 6) return setForgotError("Password must be at least 6 characters");
    if (forgotPass !== forgotConfirm) return setForgotError("Passwords do not match");
    setForgotLoading(true); setForgotError(null);
    try {
      const res  = await fetch(`${API}/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: forgotPass, resetToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password reset failed");
      setForgotStep("done");
    } catch (err) {
      setForgotError(err.message);
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "system-ui, sans-serif", background: "#fdf8f3" }}>

      {/* ── LEFT PANEL (decorative) ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #3a2416 0%, #5c3d2e 60%, #7a5c4a 100%)" }}>

        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#c97d5b", transform: "translate(30%, -30%)" }} />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
          style={{ background: "#c97d5b", transform: "translate(-30%, 30%)" }} />

        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <img src={FloralLogo} alt="Floral Studio"
              className="w-24 h-24 rounded-full border-4"
              style={{ borderColor: "rgba(201,125,91,0.5)" }} />
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", color: "#f5e6d3" }}
            className="text-4xl font-bold mb-3">Floral Studio</h1>
          <p style={{ color: "#c9a990" }} className="text-lg mb-8">
            Where every petal tells a story
          </p>

          <div className="space-y-4">
            {[
              "🌸 Handcrafted fresh bouquets",
              "🚚 Same-day delivery available",
              "💐 Premium floral arrangements",
              "🎁 Perfect for every occasion",
            ].map(t => (
              <div key={t} className="flex items-center gap-3 text-left">
                <span className="text-lg">{t.slice(0, 2)}</span>
                <span style={{ color: "#d4b5a0" }} className="text-sm">{t.slice(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (form) ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <img src={FloralLogo} alt="" className="w-10 h-10 rounded-full" />
            <span style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="font-bold text-xl">
              Floral Studio
            </span>
          </div>

          {forgotStep !== null ? (
            /* ── FORGOT PASSWORD STEPS ── */
            <div>
              {/* Back link */}
              <button
                onClick={() => {
                  if (forgotStep === "email") resetForgot();
                  else if (forgotStep === "otp") { setForgotStep("email"); setForgotError(null); }
                  else if (forgotStep === "password") { setForgotStep("otp"); setForgotError(null); }
                  else resetForgot();
                }}
                className="flex items-center gap-1 text-sm mb-6 hover:opacity-70 transition-opacity"
                style={{ color: "#c97d5b" }}
              >
                ← {forgotStep === "email" ? "Back to Login" : "Back"}
              </button>

              {/* Step: email */}
              {forgotStep === "email" && (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="mb-6">
                    <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold">
                      Forgot Password
                    </h2>
                    <p style={{ color: "#9c7a62" }} className="text-sm mt-1">
                      Enter your email and we'll send you a reset OTP
                    </p>
                  </div>

                  <Field
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={v => { setForgotEmail(v); setForgotError(null); }}
                    icon={Mail}
                  />

                  {forgotError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
                      style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
                      <span className="mt-0.5">⚠️</span><span>{forgotError}</span>
                    </div>
                  )}

                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                    {forgotLoading
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending OTP...
                        </span>
                      : "Send OTP"
                    }
                  </button>
                </form>
              )}

              {/* Step: otp */}
              {forgotStep === "otp" && (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="mb-6">
                    <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold">
                      Enter OTP
                    </h2>
                    <p style={{ color: "#9c7a62" }} className="text-sm mt-1">
                      A 6-digit OTP was sent to <strong>{forgotEmail}</strong>
                    </p>
                  </div>

                  <Field
                    label="One-Time Password"
                    placeholder="Enter 6-digit OTP"
                    value={forgotOtp}
                    onChange={v => { setForgotOtp(v.replace(/\D/g, "").slice(0, 6)); setForgotError(null); }}
                  />

                  <p className="text-sm" style={{ color: "#9c7a62" }}>
                    Didn't receive it?{" "}
                    <button
                      type="button"
                      onClick={async () => {
                        setForgotOtp(""); setForgotError(null);
                        await handleSendOtp();
                      }}
                      className="font-bold hover:opacity-70"
                      style={{ color: "#c97d5b" }}
                    >
                      Resend OTP
                    </button>
                  </p>

                  {forgotError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
                      style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
                      <span className="mt-0.5">⚠️</span><span>{forgotError}</span>
                    </div>
                  )}

                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                    {forgotLoading
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Verifying...
                        </span>
                      : "Verify OTP"
                    }
                  </button>
                </form>
              )}

              {/* Step: password */}
              {forgotStep === "password" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="mb-6">
                    <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold">
                      New Password
                    </h2>
                    <p style={{ color: "#9c7a62" }} className="text-sm mt-1">
                      Choose a strong password for your account
                    </p>
                  </div>

                  <Field
                    label="New Password"
                    type={showForgotPass ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={forgotPass}
                    onChange={v => { setForgotPass(v); setForgotError(null); }}
                    icon={Lock}
                    rightEl={
                      <button type="button" onClick={() => setShowForgotPass(s => !s)}
                        className="hover:opacity-70" style={{ color: "#9c7a62" }}>
                        {showForgotPass ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />

                  <Field
                    label="Confirm Password"
                    type={showForgotConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={forgotConfirm}
                    onChange={v => { setForgotConfirm(v); setForgotError(null); }}
                    icon={Lock}
                    rightEl={
                      <button type="button" onClick={() => setShowForgotConfirm(s => !s)}
                        className="hover:opacity-70" style={{ color: "#9c7a62" }}>
                        {showForgotConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    }
                  />

                  {forgotError && (
                    <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
                      style={{ background: "#fee2e2", color: "#dc2626", border: "1px solid #fecaca" }}>
                      <span className="mt-0.5">⚠️</span><span>{forgotError}</span>
                    </div>
                  )}

                  <button type="submit" disabled={forgotLoading}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90 disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                    {forgotLoading
                      ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Resetting...
                        </span>
                      : "Reset Password"
                    }
                  </button>
                </form>
              )}

              {/* Step: done */}
              {forgotStep === "done" && (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                      style={{ background: "#dcfce7" }}>
                      ✅
                    </div>
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-2">
                      Password Reset!
                    </h2>
                    <p style={{ color: "#9c7a62" }} className="text-sm">
                      Your password has been reset successfully. You can now sign in with your new password.
                    </p>
                  </div>
                  <button
                    onClick={resetForgot}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #c97d5b, #a85d3e)" }}>
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── NORMAL LOGIN / SIGNUP ── */
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
        </div>
      </div>
    </div>
  );
}

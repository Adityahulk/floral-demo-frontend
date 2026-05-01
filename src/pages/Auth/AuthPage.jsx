import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, Flower } from "lucide-react";
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

  const [mode,      setMode]      = useState("login"); // "login" | "signup"
  const [loading,   setLoading]   = useState(false);
  const [apiError,  setApiError]  = useState(null);
  const [showPass,  setShowPass]  = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", contactNumber: "",
  });
  const [errors, setErrors] = useState({});

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: null }));
    setApiError(null);
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
    try {
      const endpoint = mode === "login" ? `${API}/login` : `${API}/register`;
      const body     = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password, contactNumber: form.contactNumber };

      const res  = await fetch(endpoint, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      const token = data.token ?? data.data?.token;
      const role  = data.user?.role ?? data.data?.user?.role ?? data.role ?? "user";

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
    setForm({ name: "", email: "", password: "", contactNumber: "" });
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "system-ui, sans-serif", background: "#fdf8f3" }}>

      {/* ── LEFT PANEL (decorative) ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #3a2416 0%, #5c3d2e 60%, #7a5c4a 100%)" }}>

        {/* Decorative circles */}
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

            {mode === "signup" && (
              <Field label="Contact Number" placeholder="+91 98765 43210"
                value={form.contactNumber} onChange={v => set("contactNumber", v)}
                error={errors.contactNumber} icon={Phone} />
            )}

            {/* API Error */}
            {apiError && (
              <div className="flex items-start gap-2 p-3 rounded-xl text-sm"
                style={{ background: "#fee2e2", color: "#dc2626" }}>
                <span className="mt-0.5">⚠️</span>
                <span>{apiError}</span>
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
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import {
  ArrowLeft, Check, ChevronDown, ChevronUp,
  CreditCard, Truck, Tag, ShieldCheck, MapPin
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { isAuthenticated, authFetch } from "../utils/auth";

const fmt = n => "₹" + n.toLocaleString("en-IN");
const STEPS = ["Delivery", "Payment", "Confirmation"];
const BASE = "http://localhost:3001";

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────

function StepBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all"
              style={i < step
                ? { background: "#22c55e", borderColor: "#22c55e", color: "white" }
                : i === step
                  ? { background: "#c97d5b", borderColor: "#c97d5b", color: "white" }
                  : { background: "white", borderColor: "#e8d5c4", color: "#9c7a62" }}>
              {i < step ? <Check size={16} /> : i + 1}
            </div>
            <p className="text-xs mt-1 font-medium"
              style={{ color: i === step ? "#c97d5b" : i < step ? "#22c55e" : "#9c7a62" }}>{s}</p>
          </div>
          {i < STEPS.length - 1 && (
            <div className="w-20 sm:w-32 h-0.5 mx-2 mb-5"
              style={{ background: i < step ? "#22c55e" : "#e8d5c4" }} />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ORDER SUMMARY ────────────────────────────────────────────────────────────

function OrderSummary({ items, coupon, setCoupon, couponApplied, onApplyCoupon }) {
  const [open, setOpen] = useState(true);
  const subtotal  = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery  = subtotal >= 999 ? 0 : 99;
  const discount  = couponApplied ? Math.round(subtotal * 0.15) : 0;
  const total     = subtotal + delivery - discount;

  return (
    <div className="rounded-3xl overflow-hidden border" style={{ borderColor: "#e8d5c4", background: "white" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 border-b"
        style={{ borderColor: "#f0e4d8", background: "#fdf8f3" }}>
        <span style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="font-bold text-lg">
          Order Summary ({items.length} items)
        </span>
        {open ? <ChevronUp size={18} style={{ color: "#c97d5b" }} /> : <ChevronDown size={18} style={{ color: "#9c7a62" }} />}
      </button>

      {open && (
        <div className="p-5">
          <div className="space-y-4 mb-5">
            {items.map(item => (
              <div key={item.key} className="flex gap-3">
                <div className="relative shrink-0">
                  {item.img
                    ? <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                    : <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl" style={{ background: "#f5ede5" }}>🌸</div>
                  }
                  <span style={{ background: "#c97d5b" }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: "#3a2416" }} className="text-sm font-semibold truncate">{item.name}</p>
                  {item.size && <p style={{ color: "#9c7a62" }} className="text-xs">{item.size}</p>}
                  <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">Qty: {item.qty}</p>
                </div>
                <p style={{ color: "#4a3728" }} className="font-semibold text-sm shrink-0">{fmt(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-5 p-3 rounded-2xl" style={{ background: "#fdf8f3", border: "1px solid #e8d5c4" }}>
            <Tag size={16} style={{ color: "#c97d5b" }} className="shrink-0 mt-2.5" />
            <input value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "#4a3728" }} />
            <button onClick={onApplyCoupon}
              className="text-sm font-bold px-3 py-1.5 rounded-full transition-all"
              style={couponApplied
                ? { background: "#dcfce7", color: "#16a34a" }
                : { background: "#f5ede5", color: "#c97d5b" }}>
              {couponApplied ? "✓ Applied" : "Apply"}
            </button>
          </div>

          <div className="space-y-2.5 text-sm border-t pt-4" style={{ borderColor: "#f0e4d8" }}>
            <div className="flex justify-between" style={{ color: "#7a5c4a" }}>
              <span>Subtotal</span><span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between" style={{ color: "#7a5c4a" }}>
              <span>Delivery</span>
              <span style={{ color: delivery === 0 ? "#22c55e" : "#7a5c4a" }}>
                {delivery === 0 ? "FREE" : fmt(delivery)}
              </span>
            </div>
            {couponApplied && (
              <div className="flex justify-between" style={{ color: "#16a34a" }}>
                <span>Discount (BLOOM15)</span><span>-{fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: "#f0e4d8", color: "#3a2416" }}>
              <span>Total</span>
              <span style={{ color: "#c97d5b", fontFamily: "Georgia, serif" }}>{fmt(total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 py-3 border-t flex items-center gap-2" style={{ borderColor: "#f0e4d8", background: "#fdf8f3" }}>
        <ShieldCheck size={14} style={{ color: "#22c55e" }} />
        <p className="text-xs" style={{ color: "#7a5c4a" }}>100% secure checkout. Your data is protected.</p>
      </div>
    </div>
  );
}

// ─── DELIVERY FORM ────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = ["fullName", "phone", "address1", "city", "state", "pincode"];

function DeliveryForm({ data, onChange, touched }) {
  function field(label, key, type = "text", placeholder = "") {
    const isRequired = REQUIRED_FIELDS.includes(key);
    const isEmpty    = isRequired && touched && !data[key]?.trim();
    return (
      <div>
        <label className="block text-sm font-semibold mb-1.5"
          style={{ color: isEmpty ? "#dc2626" : "#4a3728" }}>
          {label}{isRequired && <span style={{ color:"#dc2626" }}> *</span>}
        </label>
        <input type={type} value={data[key]} onChange={e => onChange(key, e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
          style={{
            borderColor: isEmpty ? "#dc2626" : "#e8d5c4",
            background: isEmpty ? "#fff5f5" : "white",
            color: "#3a2416"
          }}
          onFocus={e => e.target.style.borderColor = isEmpty ? "#dc2626" : "#c97d5b"}
          onBlur={e => e.target.style.borderColor = isEmpty ? "#dc2626" : "#e8d5c4"} />
        {isEmpty && <p className="text-xs mt-1" style={{ color:"#dc2626" }}>This field is required</p>}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-1">Delivery Details</h2>
        <p style={{ color: "#9c7a62" }} className="text-sm">Where should we deliver your flowers?</p>
      </div>

      {field("Full Name", "fullName", "text", "Priya Sharma")}
      {field("Phone Number", "phone", "tel", "+91 98765 43210")}
      {field("Address Line 1", "address1", "text", "123 MG Road")}
      {field("Address Line 2 (Optional)", "address2", "text", "Apartment, suite, etc.")}

      <div className="grid grid-cols-2 gap-4">
        {field("City",  "city",  "text", "Lucknow")}
        {field("State", "state", "text", "Uttar Pradesh")}
      </div>
      {field("Pincode", "pincode", "text", "226001")}

      <div>
        <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">
          Gift Note <span style={{ color: "#9c7a62" }} className="font-normal">(optional)</span>
        </label>
        <textarea value={data.note} onChange={e => onChange("note", e.target.value)}
          rows={3} placeholder="Add a personal message to go with your flowers..."
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
          style={{ borderColor: "#e8d5c4", color: "#3a2416" }}
          onFocus={e => e.target.style.borderColor = "#c97d5b"}
          onBlur={e => e.target.style.borderColor = "#e8d5c4"} />
      </div>

      <div>
        <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-2">Preferred Delivery Time</label>
        <div className="grid grid-cols-3 gap-3">
          {[["🌅","Morning","8AM–12PM"],["☀️","Afternoon","12PM–5PM"],["🌙","Evening","5PM–9PM"]].map(([emoji, label, time]) => (
            <button key={label} onClick={() => onChange("slot", label)}
              className="flex flex-col items-center p-3 rounded-2xl border-2 text-center transition-all"
              style={data.slot === label
                ? { borderColor: "#c97d5b", background: "#fdf8f3" }
                : { borderColor: "#e8d5c4", background: "white" }}>
              <span className="text-xl mb-1">{emoji}</span>
              <span style={{ color: "#3a2416" }} className="text-xs font-bold">{label}</span>
              <span style={{ color: "#9c7a62" }} className="text-xs">{time}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PAYMENT FORM ─────────────────────────────────────────────────────────────

function PaymentForm({ method, setMethod }) {
  const options = [
    {
      id: "razorpay",
      icon: "💳",
      label: "Pay Online",
      sub: "Card, UPI, Netbanking, Wallets — powered by Razorpay",
    },
    {
      id: "cod",
      icon: "🚚",
      label: "Cash on Delivery",
      sub: "Pay when your flowers arrive",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-1">
          Payment Method
        </h2>
        <p style={{ color: "#9c7a62" }} className="text-sm">Select how you'd like to pay</p>
      </div>

      <div className="space-y-3">
        {options.map(o => (
          <button key={o.id} onClick={() => setMethod(o.id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all"
            style={method === o.id
              ? { borderColor: "#c97d5b", background: "#fdf8f3" }
              : { borderColor: "#e8d5c4", background: "white" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: method === o.id ? "#f5ede5" : "#f9f6f3" }}>
              {o.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: "#3a2416" }} className="font-semibold">{o.label}</p>
              <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">{o.sub}</p>
            </div>
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
              style={{ borderColor: method === o.id ? "#c97d5b" : "#e8d5c4" }}>
              {method === o.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#c97d5b" }} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── CONFIRMATION ─────────────────────────────────────────────────────────────

function Confirmation({ orderId, form }) {
  return (
    <div className="text-center py-10">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "#dcfce7" }}>
        <Check size={40} style={{ color: "#16a34a" }} />
      </div>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-3xl font-bold mb-3">
        Order Confirmed! 🌸
      </h2>
      <p style={{ color: "#7a5c4a" }} className="mb-2">
        Your order <strong style={{ color: "#c97d5b" }}>#{orderId}</strong> has been placed.
      </p>
      <p style={{ color: "#9c7a62" }} className="text-sm mb-8">
        We'll start preparing your flowers right away!
      </p>

      <div className="p-6 rounded-2xl mb-8 text-left" style={{ background: "#fdf8f3", border: "1px solid #e8d5c4" }}>
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} style={{ color: "#c97d5b" }} />
          <p style={{ color: "#4a3728" }} className="font-bold">Delivery Address</p>
        </div>
        <p style={{ color: "#7a5c4a" }} className="text-sm">{form.fullName}</p>
        <p style={{ color: "#7a5c4a" }} className="text-sm">{form.address1}{form.address2 ? `, ${form.address2}` : ""}</p>
        <p style={{ color: "#7a5c4a" }} className="text-sm">{form.city}{form.state ? `, ${form.state}` : ""} {form.pincode}</p>
      </div>

      <div className="flex gap-4 justify-center">
        <Link to="/orders" style={{ background: "#c97d5b" }} className="text-white px-7 py-3 rounded-full font-bold hover:opacity-90">
          View Orders
        </Link>
        <Link to="/" style={{ border: "2px solid #c97d5b", color: "#c97d5b" }}
          className="px-7 py-3 rounded-full font-bold hover:opacity-70">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ─── RAZORPAY SCRIPT LOADER ────────────────────────────────────────────────────

function loadRazorpayScript() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep]     = useState(0);
  const [method, setMethod] = useState("razorpay");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError]     = useState("");
  const [orderId, setOrderId] = useState("");
  const [touched, setTouched] = useState(false);
  const [form, setForm] = useState({
    fullName:"", phone:"",
    address1:"", address2:"", city:"", state:"", pincode:"",
    note:"", slot:"Morning"
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: "/cart" } });
    }
  }, [navigate]);

  function onChange(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function applyCoupon() {
    if (coupon === "BLOOM15") setCouponApplied(true);
    else alert("Invalid coupon code. Try BLOOM15");
  }

  function validateDelivery() {
    return REQUIRED_FIELDS.every(k => form[k]?.trim() !== "");
  }

  async function placeOrder() {
    if (!validateDelivery()) {
      setError("Please fill in all required delivery fields.");
      return;
    }
    setError("");
    setPlacing(true);

    const shippingAddress = {
      street:  [form.address1, form.address2].filter(Boolean).join(", "),
      city:    form.city,
      state:   form.state,
      pincode: form.pincode,
      phone:   form.phone,
    };
    const items = cart.map(i => ({
      product:  i.product,
      quantity: i.qty,
      size:     i.size  || "",
      color:    i.color || [],
    }));

    if (method === "cod") {
      try {
        const res  = await authFetch(`${BASE}/api/orders`, {
          method: "POST",
          body:   JSON.stringify({ items, shippingAddress, paymentMethod: "cod" }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Order failed");
        setOrderId(data.orderId || "");
        clearCart();
        setStep(2);
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
      } finally {
        setPlacing(false);
      }
      return;
    }

    // ── Razorpay flow ──
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Failed to load payment gateway. Please refresh and try again.");
      setPlacing(false);
      return;
    }

    let initiateData;
    try {
      const res  = await authFetch(`${BASE}/api/orders/initiate`, {
        method: "POST",
        body:   JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not initiate payment");
      initiateData = data;
    } catch (err) {
      setError(err.message || "Could not initiate payment. Please try again.");
      setPlacing(false);
      return;
    }

    const { razorpayOrderId, amount, currency, keyId } = initiateData;

    const options = {
      key:       keyId,
      amount:    Math.round(amount * 100),
      currency,
      order_id:  razorpayOrderId,
      name:      "Floral Studio",
      description: "Order Payment",
      theme:     { color: "#c97d5b" },
      handler: async ({ razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {
        try {
          const res  = await authFetch(`${BASE}/api/orders/confirm`, {
            method: "POST",
            body:   JSON.stringify({
              razorpayOrderId:   razorpay_order_id,
              razorpayPaymentId: razorpay_payment_id,
              razorpaySignature: razorpay_signature,
              items,
              shippingAddress,
            }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Payment confirmation failed");
          setOrderId(data.orderId || "");
          clearCart();
          setStep(2);
        } catch (err) {
          setError(err.message || "Payment confirmation failed. Contact support if amount was deducted.");
        } finally {
          setPlacing(false);
        }
      },
      modal: {
        ondismiss: () => {
          setError("Payment cancelled. Your order was not placed.");
          setPlacing(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  if (cart.length === 0 && step < 2) {
    return (
      <div style={{ background: "#fdf8f3", minHeight: "100vh" }} className="flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">🛒</span>
        <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold">Your cart is empty</h2>
        <Link to="/" style={{ background: "#c97d5b" }} className="text-white px-7 py-3 rounded-full font-bold hover:opacity-90">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fdf8f3", minHeight: "100vh" }}>
      <div className="max-w-6xl mx-auto px-4 py-10">

        {step < 2 && (
          <button onClick={() => step > 0 ? setStep(s => s - 1) : window.history.back()}
            className="flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-70"
            style={{ color: "#c97d5b" }}>
            <ArrowLeft size={16} /> {step > 0 ? "Back to Delivery" : "Back to Cart"}
          </button>
        )}

        <StepBar step={step} />

        {step === 2 ? (
          <div className="max-w-lg mx-auto">
            <Confirmation orderId={orderId} form={form} />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

            <div className="bg-white rounded-3xl p-6 sm:p-8 border" style={{ borderColor: "#e8d5c4" }}>
              {step === 0
                ? <DeliveryForm data={form} onChange={onChange} touched={touched} />
                : <PaymentForm method={method} setMethod={setMethod} />
              }

              {error && step === 1 && (
                <p className="mt-4 text-sm font-medium" style={{ color:"#dc2626" }}>{error}</p>
              )}

              <button
                onClick={step === 0
                  ? () => { setTouched(true); if (validateDelivery()) { setError(""); setTouched(false); setStep(1); } }
                  : placeOrder
                }
                disabled={placing}
                className="w-full mt-8 py-4 rounded-full font-bold text-white text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-60"
                style={{ background: "#c97d5b" }}>
                {step === 0
                  ? <><Truck size={18} /> Continue to Payment</>
                  : placing
                    ? "Placing Order..."
                    : <><CreditCard size={18} /> Place Order</>
                }
              </button>
            </div>

            <div className="lg:sticky lg:top-6">
              <OrderSummary
                items={cart}
                coupon={coupon} setCoupon={setCoupon}
                couponApplied={couponApplied} onApplyCoupon={applyCoupon}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

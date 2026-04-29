import { useState } from "react";
import {
  ArrowLeft, Check, ChevronDown, ChevronUp,
  CreditCard, Truck, Tag, ShieldCheck, MapPin
} from "lucide-react";

// ─── MOCK CART DATA ───────────────────────────────────────────────────────────

const CART_ITEMS = [
  { id:1, name:"Rose Bliss Bouquet",       price:1299, qty:1, img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80" },
  { id:2, name:"Pastel Dream Arrangement", price:1899, qty:2, img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=200&q=80" },
];

const fmt = n => "₹" + n.toLocaleString("en-IN");

const STEPS = ["Delivery", "Payment", "Confirmation"];

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

function OrderSummary({ coupon, setCoupon, couponApplied, onApplyCoupon }) {
  const [open, setOpen] = useState(true);
  const subtotal  = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery  = subtotal >= 999 ? 0 : 99;
  const discount  = couponApplied ? Math.round(subtotal * 0.15) : 0;
  const total     = subtotal + delivery - discount;

  return (
    <div className="rounded-3xl overflow-hidden border" style={{ borderColor: "#e8d5c4", background: "white" }}>
      {/* Header */}
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-5 border-b"
        style={{ borderColor: "#f0e4d8", background: "#fdf8f3" }}>
        <span style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="font-bold text-lg">
          Order Summary ({CART_ITEMS.length} items)
        </span>
        {open ? <ChevronUp size={18} style={{ color: "#c97d5b" }} /> : <ChevronDown size={18} style={{ color: "#9c7a62" }} />}
      </button>

      {open && (
        <div className="p-5">
          {/* Items */}
          <div className="space-y-4 mb-5">
            {CART_ITEMS.map(item => (
              <div key={item.id} className="flex gap-3">
                <div className="relative shrink-0">
                  <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-xl" />
                  <span style={{ background: "#c97d5b" }}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {item.qty}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ color: "#3a2416" }} className="text-sm font-semibold truncate">{item.name}</p>
                  <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">Qty: {item.qty}</p>
                </div>
                <p style={{ color: "#4a3728" }} className="font-semibold text-sm shrink-0">{fmt(item.price * item.qty)}</p>
              </div>
            ))}
          </div>

          {/* Coupon */}
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

          {/* Price Breakdown */}
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

      {/* Trust */}
      <div className="px-5 py-3 border-t flex items-center gap-2" style={{ borderColor: "#f0e4d8", background: "#fdf8f3" }}>
        <ShieldCheck size={14} style={{ color: "#22c55e" }} />
        <p className="text-xs" style={{ color: "#7a5c4a" }}>100% secure checkout. Your data is protected.</p>
      </div>
    </div>
  );
}

// ─── DELIVERY FORM ────────────────────────────────────────────────────────────

function DeliveryForm({ data, onChange }) {
  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">{label}</label>
      <input type={type} value={data[key]} onChange={e => onChange(key, e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
        style={{ borderColor: "#e8d5c4", background: "white", color: "#3a2416" }}
        onFocus={e => e.target.style.borderColor = "#c97d5b"}
        onBlur={e => e.target.style.borderColor = "#e8d5c4"} />
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-1">Delivery Details</h2>
        <p style={{ color: "#9c7a62" }} className="text-sm">Where should we deliver your flowers?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {field("First Name", "firstName", "text", "Priya")}
        {field("Last Name",  "lastName",  "text", "Sharma")}
      </div>
      {field("Email Address", "email", "email", "priya@example.com")}
      {field("Phone Number",  "phone", "tel",   "+91 98765 43210")}
      {field("Address Line 1", "address1", "text", "123 MG Road")}
      {field("Address Line 2 (Optional)", "address2", "text", "Apartment, suite, etc.")}

      <div className="grid grid-cols-2 gap-4">
        {field("City",    "city",    "text", "Lucknow")}
        {field("Pincode", "pincode", "text", "226001")}
      </div>

      {/* Gift Note */}
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

      {/* Delivery Slot */}
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
  const methods = [
    { id:"card",   icon:"💳", label:"Credit / Debit Card" },
    { id:"upi",    icon:"📱", label:"UPI" },
    { id:"cod",    icon:"💵", label:"Cash on Delivery" },
    { id:"wallet", icon:"👜", label:"Wallets (Paytm, PhonePe)" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-1">Payment Method</h2>
        <p style={{ color: "#9c7a62" }} className="text-sm">Select how you'd like to pay</p>
      </div>

      <div className="space-y-3">
        {methods.map(m => (
          <button key={m.id} onClick={() => setMethod(m.id)}
            className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all"
            style={method === m.id
              ? { borderColor: "#c97d5b", background: "#fdf8f3" }
              : { borderColor: "#e8d5c4", background: "white" }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: method === m.id ? "#f5ede5" : "#f9f6f3" }}>
              {m.icon}
            </div>
            <span style={{ color: "#3a2416" }} className="font-semibold">{m.label}</span>
            <div className="ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: method === m.id ? "#c97d5b" : "#e8d5c4" }}>
              {method === m.id && <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#c97d5b" }} />}
            </div>
          </button>
        ))}
      </div>

      {/* Card Fields */}
      {method === "card" && (
        <div className="p-5 rounded-2xl space-y-4" style={{ background: "#fdf8f3", border: "1px solid #e8d5c4" }}>
          <div>
            <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">Card Number</label>
            <input placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e8d5c4" }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">Expiry Date</label>
              <input placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e8d5c4" }} />
            </div>
            <div>
              <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">CVV</label>
              <input placeholder="•••" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e8d5c4" }} />
            </div>
          </div>
          <div>
            <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">Name on Card</label>
            <input placeholder="Priya Sharma" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e8d5c4" }} />
          </div>
        </div>
      )}

      {method === "upi" && (
        <div className="p-5 rounded-2xl" style={{ background: "#fdf8f3", border: "1px solid #e8d5c4" }}>
          <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">UPI ID</label>
          <input placeholder="yourname@upi" className="w-full px-4 py-3 rounded-xl border text-sm outline-none" style={{ borderColor: "#e8d5c4" }} />
        </div>
      )}
    </div>
  );
}

// ─── CONFIRMATION ─────────────────────────────────────────────────────────────

function Confirmation() {
  return (
    <div className="text-center py-10">
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ background: "#dcfce7" }}>
        <Check size={40} style={{ color: "#16a34a" }} />
      </div>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-3xl font-bold mb-3">
        Order Confirmed! 🌸
      </h2>
      <p style={{ color: "#7a5c4a" }} className="mb-2">Your order <strong style={{ color: "#c97d5b" }}>#FS-20250428</strong> has been placed.</p>
      <p style={{ color: "#9c7a62" }} className="text-sm mb-8">You'll receive a confirmation email shortly. Expected delivery: <strong>Today, 5PM–9PM</strong></p>

      <div className="p-6 rounded-2xl mb-8 text-left" style={{ background: "#fdf8f3", border: "1px solid #e8d5c4" }}>
        <div className="flex items-center gap-3 mb-4">
          <MapPin size={18} style={{ color: "#c97d5b" }} />
          <p style={{ color: "#4a3728" }} className="font-bold">Delivery Address</p>
        </div>
        <p style={{ color: "#7a5c4a" }} className="text-sm">Priya Sharma</p>
        <p style={{ color: "#7a5c4a" }} className="text-sm">123 MG Road, Lucknow, UP 226001</p>
      </div>

      <div className="flex gap-4 justify-center">
        <button style={{ background: "#c97d5b" }} className="text-white px-7 py-3 rounded-full font-bold hover:opacity-90">
          Track Order
        </button>
        <a href="/" style={{ border: "2px solid #c97d5b", color: "#c97d5b" }}
          className="px-7 py-3 rounded-full font-bold hover:opacity-70">
          Continue Shopping
        </a>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [step, setStep]     = useState(0);
  const [method, setMethod] = useState("card");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [form, setForm]     = useState({
    firstName:"", lastName:"", email:"", phone:"",
    address1:"", address2:"", city:"", pincode:"",
    note:"", slot:"Morning"
  });

  function onChange(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function applyCopon() {
    if (coupon === "BLOOM15") setCouponApplied(true);
    else alert("Invalid coupon code. Try BLOOM15");
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fdf8f3", minHeight: "100vh" }}>

      {/* Header */}
      {/* <div style={{ background: "#4a3728" }} className="py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌸</span>
            <span style={{ fontFamily: "Georgia, serif", color: "#f5e6d3" }} className="font-bold text-xl">Floral Studio</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: "#f5c8a8" }}>
            <ShieldCheck size={16} />
            <span className="text-sm">Secure Checkout</span>
          </div>
        </div>
      </div> */}

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
            <Confirmation />
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

            {/* Left — Forms */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border" style={{ borderColor: "#e8d5c4" }}>
              {step === 0
                ? <DeliveryForm data={form} onChange={onChange} />
                : <PaymentForm method={method} setMethod={setMethod} />
              }

              <button onClick={() => setStep(s => s + 1)}
                className="w-full mt-8 py-4 rounded-full font-bold text-white text-base flex items-center justify-center gap-2 transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "#c97d5b" }}>
                {step === 0
                  ? <><Truck size={18} /> Continue to Payment</>
                  : <><CreditCard size={18} /> Place Order</>
                }
              </button>
            </div>

            {/* Right — Summary */}
            <div className="lg:sticky lg:top-6">
              <OrderSummary
                coupon={coupon} setCoupon={setCoupon}
                couponApplied={couponApplied} onApplyCoupon={applyCopon}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
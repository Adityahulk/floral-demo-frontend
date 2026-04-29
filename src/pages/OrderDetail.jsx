import { useState } from "react";
import {
  ArrowLeft, Package, Truck, Check, X, Clock,
  MapPin, CreditCard, Phone, Mail, Download,
  RotateCcw, Star, MessageCircle, Copy, CheckCheck,
  ChevronRight, AlertCircle
} from "lucide-react";

// ─── MOCK ORDER ───────────────────────────────────────────────────────────────

const ORDER = {
  id:          "FS-20250428",
  date:        "28 Apr 2025, 10:00 AM",
  status:      "Delivered",
  deliveredOn: "28 Apr 2025, 6:30 PM",
  payment:     "Credit Card (•••• 4242)",
  subtotal:    2598,
  delivery:    0,
  discount:    0,
  total:       2598,
  note:        "Please add a pink ribbon on the bouquet. It's for a birthday! 🎂",
  customer: {
    name:  "Priya Sharma",
    email: "priya.sharma@gmail.com",
    phone: "+91 98765 43210",
  },
  address: {
    line1: "123 MG Road, Apt 4B",
    line2: "Gomti Nagar",
    city:  "Lucknow",
    state: "Uttar Pradesh",
    pin:   "226010",
  },
  slot: "Evening (5PM–9PM)",
  items: [
    { id:1, name:"Rose Bliss Bouquet",       qty:1, price:1299, img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=300&q=80", size:"Medium (20 stems)", color:"Red"   },
    { id:2, name:"Lavender & Eucalyptus",    qty:1, price:849,  img:"https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=300&q=80", size:"Small (10 stems)", color:"Mixed" },
    { id:3, name:"Pastel Dream Arrangement", qty:1, price:450,  img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=300&q=80", size:"Small",            color:"Pink"  },
  ],
  tracking: [
    { label:"Order Placed",     desc:"Your order has been received.",                    done:true,  time:"28 Apr, 10:00 AM", icon:<Package size={16}/>  },
    { label:"Order Confirmed",  desc:"Our florists have started preparing your order.",  done:true,  time:"28 Apr, 10:45 AM", icon:<Check size={16}/>    },
    { label:"Being Prepared",   desc:"Your bouquet is being hand-crafted with love.",    done:true,  time:"28 Apr, 12:00 PM", icon:<Clock size={16}/>    },
    { label:"Out for Delivery", desc:"Your order is on the way!",                        done:true,  time:"28 Apr, 5:00 PM",  icon:<Truck size={16}/>    },
    { label:"Delivered",        desc:"Your order was delivered successfully.",            done:true,  time:"28 Apr, 6:30 PM",  icon:<Check size={16}/>    },
  ],
};

const fmt = n => "₹" + n.toLocaleString("en-IN");

const STATUS_CONFIG = {
  Delivered:    { bg:"#dcfce7", color:"#16a34a", label:"Delivered"    },
  "In Transit": { bg:"#fef9c3", color:"#ca8a04", label:"In Transit"   },
  Processing:   { bg:"#dbeafe", color:"#2563eb", label:"Processing"   },
  Cancelled:    { bg:"#fee2e2", color:"#dc2626", label:"Cancelled"    },
};

// ─── SECTION WRAPPER ──────────────────────────────────────────────────────────

function Section({ title, icon, children }) {
  return (
    <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
        <div style={{ background:"#f5ede5", color:"#c97d5b" }} className="w-8 h-8 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── TRACKING STEPPER ─────────────────────────────────────────────────────────

function TrackingStep({ step, isLast }) {
  return (
    <div className="flex gap-4">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0 z-10"
          style={{
            background:   step.done ? "#c97d5b" : "white",
            borderColor:  step.done ? "#c97d5b" : "#e8d5c4",
            color:        step.done ? "white"   : "#9c7a62",
          }}>
          {step.icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 my-1" style={{ background: step.done ? "#c97d5b" : "#e8d5c4" }} />}
      </div>

      {/* Right: content */}
      <div className={`flex-1 ${!isLast ? "pb-6" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-bold text-sm" style={{ color: step.done ? "#3a2416" : "#9c7a62" }}>{step.label}</p>
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color:"#9c7a62" }}>{step.desc}</p>
          </div>
          {step.time && (
            <span className="text-xs shrink-0 font-medium" style={{ color:"#c97d5b" }}>{step.time}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── REVIEW MODAL ─────────────────────────────────────────────────────────────

function ReviewModal({ item, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hover,  setHover]  = useState(0);
  const [text,   setText]   = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-xl">Write a Review</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:opacity-70">
            <X size={18} style={{ color:"#9c7a62" }} />
          </button>
        </div>

        {/* Product */}
        <div className="flex gap-3 mb-5 p-3 rounded-2xl" style={{ background:"#fdf8f3" }}>
          <img src={item.img} alt={item.name} className="w-14 h-14 object-cover rounded-xl" />
          <div>
            <p style={{ color:"#3a2416" }} className="font-semibold text-sm">{item.name}</p>
            <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{item.size} · {item.color}</p>
          </div>
        </div>

        {/* Stars */}
        <div className="mb-4 text-center">
          <p style={{ color:"#4a3728" }} className="text-sm font-semibold mb-3">How would you rate this?</p>
          <div className="flex justify-center gap-2">
            {[1,2,3,4,5].map(n => (
              <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}>
                <Star size={32} className={(hover||rating) >= n ? "fill-amber-400 text-amber-400" : "text-stone-200 fill-stone-200"} />
              </button>
            ))}
          </div>
          {(hover || rating) > 0 && (
            <p className="text-sm mt-2 font-medium" style={{ color:"#c97d5b" }}>
              {["","Poor","Fair","Good","Very Good","Excellent!"][(hover||rating)]}
            </p>
          )}
        </div>

        {/* Text */}
        <div className="mb-5">
          <label style={{ color:"#4a3728" }} className="block text-sm font-semibold mb-1.5">Your Review</label>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={4}
            placeholder="Tell others what you loved about this product..."
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor:"#e8d5c4", color:"#3a2416" }} />
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-full border font-semibold text-sm"
            style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
            Cancel
          </button>
          <button onClick={() => rating > 0 && onSubmit(rating, text)} disabled={rating === 0}
            className="flex-1 py-3 rounded-full font-semibold text-sm text-white disabled:opacity-50"
            style={{ background:"#c97d5b" }}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function OrderDetail() {
  const [copied,   setCopied]   = useState(false);
  const [reviewed, setReviewed] = useState(new Set());
  const [modal,    setModal]    = useState(null); // item being reviewed
  const s = STATUS_CONFIG[ORDER.status];

  function copyOrderId() {
    navigator.clipboard.writeText(ORDER.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function submitReview(itemId) {
    setReviewed(r => new Set([...r, itemId]));
    setModal(null);
  }

  const isDelivered = ORDER.status === "Delivered";

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"#fdf8f3", minHeight:"100vh" }}>

      {/* Review Modal */}
      {modal && (
        <ReviewModal
          item={modal}
          onClose={() => setModal(null)}
          onSubmit={(rating, text) => submitReview(modal.id)}
        />
      )}

      {/* Breadcrumb */}
      <div style={{ background:"#f5ede5", borderBottom:"1px solid #e8d5c4" }} className="py-3">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 text-sm flex-wrap" style={{ color:"#9c7a62" }}>
          <a href="/" className="hover:underline">Home</a><ChevronRight size={13}/>
          <a href="/profile" className="hover:underline">My Account</a><ChevronRight size={13}/>
          <a href="/orders" className="hover:underline">My Orders</a><ChevronRight size={13}/>
          <span style={{ color:"#4a3728" }} className="font-medium">{ORDER.id}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Back */}
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-70"
          style={{ color:"#c97d5b" }}>
          <ArrowLeft size={16}/> Back to Orders
        </button>

        {/* ── PAGE HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-3xl font-bold">Order Details</h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: s.bg, color: s.color }}>
                ● {s.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p style={{ color:"#9c7a62" }} className="text-sm">Order ID: <strong style={{ color:"#4a3728" }}>{ORDER.id}</strong></p>
              <button onClick={copyOrderId} className="hover:opacity-70 transition-opacity">
                {copied ? <CheckCheck size={14} style={{ color:"#22c55e" }}/> : <Copy size={14} style={{ color:"#9c7a62" }}/>}
              </button>
            </div>
            <p style={{ color:"#9c7a62" }} className="text-sm mt-0.5">Placed on {ORDER.date}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {isDelivered && (
              <>
                <button style={{ background:"#f5ede5", color:"#c97d5b" }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80">
                  <RotateCcw size={14}/> Reorder
                </button>
                <button style={{ background:"#f5ede5", color:"#c97d5b" }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80">
                  <Download size={14}/> Invoice
                </button>
              </>
            )}
            <a href="https://wa.me/919876543210"
              style={{ background:"#25d366" }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90">
              <MessageCircle size={14}/> Help
            </a>
          </div>
        </div>

        {/* ── DELIVERED BANNER ── */}
        {isDelivered && (
          <div className="mb-6 p-4 rounded-2xl flex items-center gap-3"
            style={{ background:"#dcfce7", border:"1px solid #bbf7d0" }}>
            <Check size={20} style={{ color:"#16a34a" }} className="shrink-0"/>
            <div>
              <p style={{ color:"#166534" }} className="font-bold text-sm">Successfully Delivered!</p>
              <p style={{ color:"#16a34a" }} className="text-xs">{ORDER.deliveredOn}</p>
            </div>
          </div>
        )}

        {/* ── MAIN GRID ── */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-6">

            {/* Items */}
            <Section title="Order Items" icon={<Package size={16}/>}>
              <div className="space-y-5">
                {ORDER.items.map((item, i) => (
                  <div key={item.id}>
                    {i > 0 && <div className="border-t mb-5" style={{ borderColor:"#f0e4d8" }} />}
                    <div className="flex gap-4">
                      <img src={item.img} alt={item.name}
                        className="w-20 h-20 object-cover rounded-2xl shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p style={{ color:"#3a2416" }} className="font-bold truncate">{item.name}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <span style={{ background:"#f5ede5", color:"#9c7a62" }}
                            className="text-xs px-2 py-0.5 rounded-full">{item.size}</span>
                          <span style={{ background:"#f5ede5", color:"#9c7a62" }}
                            className="text-xs px-2 py-0.5 rounded-full">{item.color}</span>
                        </div>
                        <p style={{ color:"#9c7a62" }} className="text-xs mt-1">Qty: {item.qty}</p>

                        {/* Review Section */}
                        {isDelivered && (
                          reviewed.has(item.id) ? (
                            <div className="flex items-center gap-1.5 mt-2">
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(n => <Star key={n} size={12} className="fill-amber-400 text-amber-400"/>)}
                              </div>
                              <span style={{ color:"#22c55e" }} className="text-xs font-semibold">✓ Reviewed</span>
                            </div>
                          ) : (
                            <button onClick={() => setModal(item)}
                              style={{ color:"#c97d5b" }}
                              className="flex items-center gap-1 text-xs font-semibold mt-2 hover:opacity-70">
                              <Star size={12}/> Write a Review
                            </button>
                          )
                        )}
                      </div>
                      <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }}
                        className="font-bold shrink-0">{fmt(item.price * item.qty)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Tracking */}
            <Section title="Order Tracking" icon={<Truck size={16}/>}>
              {ORDER.tracking.map((step, i) => (
                <TrackingStep key={i} step={step} isLast={i === ORDER.tracking.length - 1} />
              ))}
            </Section>

            {/* Gift Note */}
            {ORDER.note && (
              <Section title="Gift Note" icon={<AlertCircle size={16}/>}>
                <div className="p-4 rounded-2xl italic text-sm leading-relaxed"
                  style={{ background:"#fdf8f3", color:"#5c4033", border:"1px dashed #e8d5c4" }}>
                  "{ORDER.note}"
                </div>
              </Section>
            )}
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="space-y-5">

            {/* Price Summary */}
            <Section title="Price Summary" icon={<CreditCard size={16}/>}>
              <div className="space-y-3 text-sm">
                {[
                  ["Subtotal",        fmt(ORDER.subtotal)],
                  ["Delivery Charge", ORDER.delivery === 0 ? "FREE 🎉" : fmt(ORDER.delivery)],
                  ["Discount",        ORDER.discount > 0 ? `-${fmt(ORDER.discount)}` : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color:"#9c7a62" }}>{k}</span>
                    <span style={{ color: v.includes("FREE") ? "#22c55e" : "#4a3728" }} className="font-medium">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 border-t font-bold text-base"
                  style={{ borderColor:"#f0e4d8" }}>
                  <span style={{ color:"#3a2416" }}>Total Paid</span>
                  <span style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }}>{fmt(ORDER.total)}</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <CreditCard size={13} style={{ color:"#9c7a62" }}/>
                  <span style={{ color:"#9c7a62" }} className="text-xs">{ORDER.payment}</span>
                </div>
              </div>
            </Section>

            {/* Delivery Address */}
            <Section title="Delivery Address" icon={<MapPin size={16}/>}>
              <div className="flex items-start gap-3">
                <div style={{ background:"#f5ede5" }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} style={{ color:"#c97d5b" }}/>
                </div>
                <div className="text-sm" style={{ color:"#5c4033" }}>
                  <p className="font-bold" style={{ color:"#3a2416" }}>{ORDER.customer.name}</p>
                  <p>{ORDER.address.line1}</p>
                  {ORDER.address.line2 && <p>{ORDER.address.line2}</p>}
                  <p>{ORDER.address.city}, {ORDER.address.state} {ORDER.address.pin}</p>
                  <div className="flex items-center gap-1.5 mt-2" style={{ color:"#9c7a62" }}>
                    <Clock size={12}/> {ORDER.slot}
                  </div>
                </div>
              </div>
            </Section>

            {/* Customer Info */}
            <Section title="Contact Info" icon={<Phone size={16}/>}>
              <div className="space-y-3 text-sm">
                {[
                  [<Mail size={14}/>,  ORDER.customer.email],
                  [<Phone size={14}/>, ORDER.customer.phone],
                ].map(([icon, val], i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div style={{ color:"#c97d5b" }}>{icon}</div>
                    <span style={{ color:"#4a3728" }}>{val}</span>
                  </div>
                ))}
              </div>
            </Section>

            {/* Need Help */}
            <div className="p-5 rounded-3xl text-center" style={{ background:"#4a3728" }}>
              <p style={{ fontFamily:"Georgia, serif", color:"#f5e6d3" }} className="font-bold mb-1">Need Help?</p>
              <p style={{ color:"#b89c8a" }} className="text-xs mb-4">Our team is available 7 days a week</p>
              <div className="flex gap-2">
                <a href="tel:+919876543210" style={{ background:"#c97d5b" }}
                  className="flex-1 py-2 rounded-full text-white text-xs font-bold text-center hover:opacity-90">
                  📞 Call
                </a>
                <a href="https://wa.me/919876543210" style={{ background:"#25d366" }}
                  className="flex-1 py-2 rounded-full text-white text-xs font-bold text-center hover:opacity-90">
                  💬 WhatsApp
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
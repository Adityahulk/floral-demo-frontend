import { useState } from "react";
import {
  Package, Truck, Check, X, Clock, ChevronRight,
  ChevronDown, ChevronUp, Search, Filter,
  RotateCcw, Star, MapPin, Phone, ArrowLeft,
  Download, MessageCircle
} from "lucide-react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const ORDERS = [
  {
    id:"FS-20250428", date:"28 Apr 2025", status:"Delivered",
    total:1299, deliveredOn:"28 Apr 2025, 6:30 PM",
    items:[{ name:"Rose Bliss Bouquet",       qty:1, price:1299, img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80" }],
    address:"123 MG Road, Lucknow, UP 226001",
    payment:"Credit Card", tracking:[
      { label:"Order Placed",    done:true,  time:"28 Apr, 10:00 AM" },
      { label:"Preparing",       done:true,  time:"28 Apr, 11:30 AM" },
      { label:"Out for Delivery",done:true,  time:"28 Apr, 5:00 PM"  },
      { label:"Delivered",       done:true,  time:"28 Apr, 6:30 PM"  },
    ],
  },
  {
    id:"FS-20250415", date:"15 Apr 2025", status:"In Transit",
    total:3798, deliveredOn:null,
    items:[
      { name:"Pastel Dream Arrangement", qty:2, price:1899, img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=200&q=80" },
    ],
    address:"45 Gomti Nagar, Lucknow, UP 226010",
    payment:"UPI", tracking:[
      { label:"Order Placed",    done:true,  time:"15 Apr, 9:00 AM"  },
      { label:"Preparing",       done:true,  time:"15 Apr, 11:00 AM" },
      { label:"Out for Delivery",done:true,  time:"15 Apr, 3:00 PM"  },
      { label:"Delivered",       done:false, time:null               },
    ],
  },
  {
    id:"FS-20250401", date:"1 Apr 2025", status:"Delivered",
    total:999, deliveredOn:"1 Apr 2025, 7:00 PM",
    items:[{ name:"Wildflower Wreath", qty:1, price:999, img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=200&q=80" }],
    address:"123 MG Road, Lucknow, UP 226001",
    payment:"Cash on Delivery", tracking:[
      { label:"Order Placed",    done:true, time:"1 Apr, 8:00 AM" },
      { label:"Preparing",       done:true, time:"1 Apr, 10:00 AM"},
      { label:"Out for Delivery",done:true, time:"1 Apr, 5:30 PM" },
      { label:"Delivered",       done:true, time:"1 Apr, 7:00 PM" },
    ],
  },
  {
    id:"FS-20250315", date:"15 Mar 2025", status:"Cancelled",
    total:2199, deliveredOn:null,
    items:[{ name:"Orchid Elegance Set", qty:1, price:2199, img:"https://images.unsplash.com/photo-1566873535350-96e04c74fb1a?w=200&q=80" }],
    address:"123 MG Road, Lucknow, UP 226001",
    payment:"Credit Card", tracking:[
      { label:"Order Placed", done:true,  time:"15 Mar, 2:00 PM" },
      { label:"Cancelled",    done:true,  time:"15 Mar, 3:00 PM" },
    ],
  },
];

const STATUS_CONFIG = {
  Delivered:    { bg:"#dcfce7", color:"#16a34a", icon:<Check size={13}/>     },
  "In Transit": { bg:"#fef9c3", color:"#ca8a04", icon:<Truck size={13}/>     },
  Processing:   { bg:"#dbeafe", color:"#2563eb", icon:<Clock size={13}/>     },
  Cancelled:    { bg:"#fee2e2", color:"#dc2626", icon:<X size={13}/>         },
};

const FILTERS = ["All", "Delivered", "In Transit", "Processing", "Cancelled"];
const fmt = n => "₹" + n.toLocaleString("en-IN");

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function Badge({ status }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG["Processing"];
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}>
      {s.icon} {status}
    </span>
  );
}

// ─── TRACKING STEPPER ─────────────────────────────────────────────────────────

function Tracker({ steps, cancelled }) {
  return (
    <div className="mt-5 pt-5 border-t" style={{ borderColor:"#f0e4d8" }}>
      <p style={{ color:"#4a3728" }} className="text-sm font-bold mb-4">Order Tracking</p>
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background:"#e8d5c4" }} />
        <div className="space-y-5">
          {steps.map(({ label, done, time }, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Dot */}
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10"
                style={{
                  background: done ? (cancelled && i === steps.length-1 ? "#fee2e2" : "#c97d5b") : "white",
                  borderColor: done ? (cancelled && i === steps.length-1 ? "#dc2626" : "#c97d5b") : "#e8d5c4",
                }}>
                {done
                  ? cancelled && i === steps.length-1
                    ? <X size={13} className="text-red-500" />
                    : <Check size={13} className="text-white" />
                  : <div className="w-2 h-2 rounded-full" style={{ background:"#e8d5c4" }} />
                }
              </div>
              <div className="flex-1 pb-1">
                <p className="text-sm font-semibold"
                  style={{ color: done ? "#3a2416" : "#9c7a62" }}>{label}</p>
                {time && <p className="text-xs mt-0.5" style={{ color:"#9c7a62" }}>{time}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const [rating, setRating]     = useState(0);
  const isCancelled = order.status === "Cancelled";
  const isDelivered = order.status === "Delivered";

  return (
    <div className="bg-white rounded-3xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor:"#e8d5c4" }}>

      {/* Header */}
      <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
        <div className="flex items-center gap-4">
          <div style={{ background:"#f5ede5" }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <Package size={18} style={{ color:"#c97d5b" }} />
          </div>
          <div>
            <p style={{ color:"#3a2416" }} className="font-bold text-sm">{order.id}</p>
            <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">Placed on {order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={order.status} />
          <span style={{ color:"#c97d5b" }} className="font-bold">{fmt(order.total)}</span>
          <button onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{ background:"#f5ede5" }}>
            {expanded
              ? <ChevronUp size={16} style={{ color:"#c97d5b" }} />
              : <ChevronDown size={16} style={{ color:"#c97d5b" }} />
            }
          </button>
        </div>
      </div>

      {/* Items always visible */}
      <div className="p-5">
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <img src={item.img} alt={item.name}
                className="w-16 h-16 object-cover rounded-2xl shrink-0" />
              <div className="flex-1 min-w-0">
                <p style={{ color:"#3a2416" }} className="font-semibold text-sm truncate">{item.name}</p>
                <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">Qty: {item.qty}</p>
                <p style={{ color:"#c97d5b" }} className="font-bold text-sm mt-0.5">{fmt(item.price * item.qty)}</p>
              </div>
              {isDelivered && !reviewed && (
                <div className="shrink-0">
                  <p style={{ color:"#9c7a62" }} className="text-xs mb-1 text-center">Rate</p>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(n => (
                      <button key={n} onClick={() => setRating(n)}>
                        <Star size={16}
                          className={n <= rating ? "fill-amber-400 text-amber-400" : "text-stone-300"} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {reviewed && (
                <span style={{ background:"#dcfce7", color:"#16a34a" }}
                  className="text-xs font-bold px-2 py-1 rounded-full shrink-0">
                  ✓ Reviewed
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t" style={{ borderColor:"#f0e4d8" }}>
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
            style={{ borderColor:"#e8d5c4", color:"#5c4033" }}>
            {expanded ? "Hide Details" : "View Details"} <ChevronRight size={13} />
          </button>

          {isDelivered && (
            <>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
                style={{ borderColor:"#e8d5c4", color:"#5c4033" }}>
                <RotateCcw size={13} /> Reorder
              </button>
              {rating > 0 && !reviewed && (
                <button onClick={() => setReviewed(true)}
                  style={{ background:"#c97d5b" }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white hover:opacity-90">
                  <Star size={13} /> Submit Review
                </button>
              )}
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
                style={{ borderColor:"#e8d5c4", color:"#5c4033" }}>
                <Download size={13} /> Invoice
              </button>
            </>
          )}

          {order.status === "In Transit" && (
            <button style={{ background:"#fef9c3", color:"#ca8a04" }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80">
              <Truck size={13} /> Track Live
            </button>
          )}

          {!isCancelled && order.status !== "Delivered" && (
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80"
              style={{ background:"#fee2e2", color:"#dc2626" }}>
              <X size={13} /> Cancel Order
            </button>
          )}

          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80 ml-auto"
            style={{ borderColor:"#e8d5c4", color:"#5c4033" }}>
            <MessageCircle size={13} /> Help
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-5 pb-5 border-t" style={{ borderColor:"#f0e4d8" }}>
          <div className="grid sm:grid-cols-2 gap-6 pt-5">

            {/* Delivery Info */}
            <div>
              <p style={{ color:"#4a3728" }} className="text-sm font-bold mb-3 flex items-center gap-2">
                <MapPin size={14} style={{ color:"#c97d5b" }} /> Delivery Address
              </p>
              <p style={{ color:"#7a5c4a" }} className="text-sm leading-relaxed">{order.address}</p>
              {order.deliveredOn && (
                <p style={{ color:"#22c55e" }} className="text-xs font-semibold mt-2">
                  ✓ Delivered on {order.deliveredOn}
                </p>
              )}
            </div>

            {/* Payment Info */}
            <div>
              <p style={{ color:"#4a3728" }} className="text-sm font-bold mb-3">Payment Summary</p>
              <div className="space-y-1.5 text-sm">
                {[
                  ["Subtotal",        fmt(order.total)],
                  ["Delivery",        order.total >= 999 ? "FREE" : "₹99"],
                  ["Payment Method",  order.payment],
                  ["Total Paid",      fmt(order.total)],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span style={{ color:"#9c7a62" }}>{k}</span>
                    <span style={{ color: k === "Total Paid" ? "#c97d5b" : "#4a3728" }}
                      className={k === "Total Paid" ? "font-bold" : ""}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tracking */}
          <Tracker steps={order.tracking} cancelled={isCancelled} />
        </div>
      )}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [filter, setFilter]   = useState("All");
  const [search, setSearch]   = useState("");

  const filtered = ORDERS.filter(o => {
    const matchFilter = filter === "All" || o.status === filter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => i.name.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "All" ? ORDERS.length : ORDERS.filter(o => o.status === f).length;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"#fdf8f3", minHeight:"100vh" }}>

      {/* Breadcrumb */}
      <div style={{ background:"#f5ede5", borderBottom:"1px solid #e8d5c4" }} className="py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 text-sm" style={{ color:"#9c7a62" }}>
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <a href="/profile" className="hover:underline">My Account</a>
          <span>/</span>
          <span style={{ color:"#4a3728" }} className="font-medium">My Orders</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Back */}
        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-8 text-sm font-medium hover:opacity-70"
          style={{ color:"#c97d5b" }}>
          <ArrowLeft size={16} /> Back to Account
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-3xl font-bold">My Orders</h1>
            <p style={{ color:"#9c7a62" }} className="text-sm mt-1">{ORDERS.length} orders placed</p>
          </div>
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none w-56"
              style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }} />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
              style={filter === f
                ? { background:"#4a3728", borderColor:"#4a3728", color:"white" }
                : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              {f}
              {counts[f] > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{
                    background: filter === f ? "rgba(255,255,255,0.2)" : "#f5ede5",
                    color: filter === f ? "white" : "#c97d5b"
                  }}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label:"Total Orders",  value: ORDERS.length,                                  color:"#c97d5b" },
            { label:"Delivered",     value: ORDERS.filter(o=>o.status==="Delivered").length, color:"#22c55e" },
            { label:"In Transit",    value: ORDERS.filter(o=>o.status==="In Transit").length,color:"#ca8a04" },
            { label:"Total Spent",   value: fmt(ORDERS.reduce((s,o)=>s+o.total,0)),          color:"#c97d5b" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border text-center"
              style={{ borderColor:"#e8d5c4" }}>
              <p style={{ color, fontFamily:"Georgia, serif" }} className="text-2xl font-bold">{value}</p>
              <p style={{ color:"#9c7a62" }} className="text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">📦</span>
            <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold mb-2">No Orders Found</h3>
            <p style={{ color:"#9c7a62" }} className="mb-6">
              {search ? `No orders matching "${search}"` : `No ${filter.toLowerCase()} orders yet.`}
            </p>
            <a href="/shop" style={{ background:"#c97d5b" }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90">
              Start Shopping 🌸
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map(order => <OrderCard key={order.id} order={order} />)}
          </div>
        )}

        {/* Help Section */}
        <div className="mt-10 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
          style={{ background:"#f5ede5", border:"1px solid #e8d5c4" }}>
          <div style={{ background:"#c97d5b" }} className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Phone size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Need Help With Your Order?</p>
            <p style={{ color:"#7a5c4a" }} className="text-sm mt-1">Our team is available 7 days a week, 8AM–9PM</p>
          </div>
          <div className="flex gap-3">
            <a href="tel:+919876543210" style={{ background:"#4a3728" }}
              className="text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 whitespace-nowrap">
              Call Us
            </a>
            <a href="https://wa.me/919876543210" style={{ background:"#25d366" }}
              className="text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 whitespace-nowrap">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
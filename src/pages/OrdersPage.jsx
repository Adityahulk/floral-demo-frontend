import { useState, useEffect } from "react";
import {
  Package, Truck, Check, X, Clock, ChevronRight,
  ChevronDown, ChevronUp, Search, Filter,
  Star, MapPin, Phone, ArrowLeft, MessageCircle
} from "lucide-react";
import { api } from "../api/client";
import { API } from "../api/endpoints";

const STATUS_CONFIG = {
  pending:    { bg:"#dbeafe", color:"#2563eb", icon:<Clock size={13}/>, label:"Pending"    },
  processing: { bg:"#dbeafe", color:"#2563eb", icon:<Clock size={13}/>, label:"Processing" },
  shipped:    { bg:"#fef9c3", color:"#ca8a04", icon:<Truck size={13}/>, label:"Shipped"    },
  delivered:  { bg:"#dcfce7", color:"#16a34a", icon:<Check size={13}/>, label:"Delivered"  },
  cancelled:  { bg:"#fee2e2", color:"#dc2626", icon:<X size={13}/>,     label:"Cancelled"  },
};

const FILTER_LABELS = ["All", "pending", "processing", "shipped", "delivered", "cancelled"];
const FILTER_DISPLAY = { All:"All", pending:"Pending", processing:"Processing", shipped:"Shipped", delivered:"Delivered", cancelled:"Cancelled" };
const fmt = n => "₹" + n.toLocaleString("en-IN");

function Badge({ status }) {
  const s = STATUS_CONFIG[(status || "").toLowerCase()] || STATUS_CONFIG.pending;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.color }}>
      {s.icon} {s.label}
    </span>
  );
}

function OrderCard({ order, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const canCancel = !["cancelled","delivered"].includes((order.status || "").toLowerCase());
  const addr = order.shippingAddress || {};
  const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "";

  async function handleCancel() {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const data = await api(API.orders.cancel(order._id), { method: "PATCH" });
      if (!data.success) throw new Error(data.message || "Failed to cancel");
      onCancel(order._id);
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl border overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor:"var(--color-border)" }}>

      <div className="p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
        style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
        <div className="flex items-center gap-4">
          <div style={{ background:"var(--color-beige)" }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <Package size={18} style={{ color:"var(--color-olive)" }} />
          </div>
          <div>
            <p style={{ color:"var(--color-charcoal)" }} className="font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">Placed on {dateStr}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge status={order.status} />
          <span style={{ color:"var(--color-olive)" }} className="font-bold">{fmt(order.totalAmount || order.totalPrice || 0)}</span>
          <button onClick={() => setExpanded(e => !e)}
            className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
            style={{ background:"var(--color-beige)" }}>
            {expanded
              ? <ChevronUp size={16} style={{ color:"var(--color-olive)" }} />
              : <ChevronDown size={16} style={{ color:"var(--color-olive)" }} />
            }
          </button>
        </div>
      </div>

      <div className="p-5">
        <div className="space-y-3">
          {order.items.map((item, i) => {
            const p = item.product;
            const name  = (p && p.name)  ? p.name  : "Product";
            const img   = (p && p.images) ? p.images[0] : null;
            const price = (p && p.price)  ? p.price : 0;
            return (
              <div key={i} className="flex items-center gap-4">
                {img
                  ? <img src={img} alt={name} className="w-16 h-16 object-cover rounded-2xl shrink-0" />
                  : <div className="w-16 h-16 rounded-2xl shrink-0 flex items-center justify-center text-2xl" style={{ background:"var(--color-beige)" }}>⌨</div>
                }
                <div className="flex-1 min-w-0">
                  <p style={{ color:"var(--color-charcoal)" }} className="font-semibold text-sm truncate">{name}</p>
                  {item.size && <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">{item.size}</p>}
                  <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">Qty: {item.quantity}</p>
                  {price > 0 && <p style={{ color:"var(--color-olive)" }} className="font-bold text-sm mt-0.5">{fmt(price * item.quantity)}</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t" style={{ borderColor:"var(--color-border)" }}>
          <button onClick={() => setExpanded(e => !e)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
            style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }}>
            {expanded ? "Hide Details" : "View Details"} <ChevronRight size={13} />
          </button>

          {canCancel && (
            <button onClick={handleCancel} disabled={cancelling}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold hover:opacity-80 disabled:opacity-60"
              style={{ background:"#fee2e2", color:"#dc2626" }}>
              <X size={13} /> {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}

          <a href="https://wa.me/919825553565"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80 ml-auto"
            style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }}>
            <MessageCircle size={13} /> Help
          </a>
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t" style={{ borderColor:"var(--color-border)" }}>
          <div className="pt-5 text-sm">
            <p style={{ color:"var(--color-charcoal)" }} className="font-bold mb-2 flex items-center gap-2">
              <MapPin size={14} style={{ color:"var(--color-olive)" }} /> Delivery Address
            </p>
            <p style={{ color:"var(--color-olive)" }}>{addr.name}</p>
            <p style={{ color:"var(--color-olive)" }}>{addr.street}</p>
            <p style={{ color:"var(--color-olive)" }}>{addr.city}{addr.state ? `, ${addr.state}` : ""} {addr.zipCode}</p>
            {addr.phone && (
              <p style={{ color:"var(--color-olive)" }} className="mt-1 flex items-center gap-1">
                <Phone size={11} /> {addr.phone}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");

  useEffect(() => {
    api(API.orders.userOrders)
      .then(data => {
        setOrders(data.data || data.orders || []);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load orders."); setLoading(false); });
  }, []);

  function handleCancel(id) {
    setOrders(prev => prev.map(o => o._id === id ? { ...o, status: "Cancelled" } : o));
  }

  const filtered = orders.filter(o => {
    const matchFilter = filter === "All" || (o.status || "").toLowerCase() === filter;
    const matchSearch = search === "" ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      o.items.some(i => (i.product?.name || "").toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const counts = FILTER_LABELS.reduce((acc, f) => {
    acc[f] = f === "All" ? orders.length : orders.filter(o => (o.status || "").toLowerCase() === f).length;
    return acc;
  }, {});

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>

      <div style={{ background:"var(--color-beige)", borderBottom:"1px solid var(--color-border)" }} className="py-3">
        <div className="max-w-4xl mx-auto px-4 flex items-center gap-2 text-sm" style={{ color:"var(--color-olive)" }}>
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <a href="/profile" className="hover:underline">My Account</a>
          <span>/</span>
          <span style={{ color:"var(--color-charcoal)" }} className="font-medium">My Orders</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-8 text-sm font-medium hover:opacity-70"
          style={{ color:"var(--color-olive)" }}>
          <ArrowLeft size={16} /> Back to Account
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-3xl font-bold">My Orders</h1>
            <p style={{ color:"var(--color-olive)" }} className="text-sm mt-1">{orders.length} orders placed</p>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-olive)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none w-56"
              style={{ borderColor:"var(--color-border)", background:"white", color:"var(--color-charcoal)" }} />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {FILTER_LABELS.filter(f => f === "All" || counts[f] > 0).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
              style={filter === f
                ? { background:"var(--color-charcoal)", borderColor:"var(--color-charcoal)", color:"white" }
                : { borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
              {FILTER_DISPLAY[f] || f}
              {counts[f] > 0 && (
                <span className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{
                    background: filter === f ? "rgba(255,255,255,0.2)" : "var(--color-beige)",
                    color: filter === f ? "white" : "var(--color-olive)"
                  }}>
                  {counts[f]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }} />
            <p style={{ color:"var(--color-olive)" }} className="text-sm">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">⚠️</span>
            <p style={{ color:"#dc2626" }} className="font-semibold">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-5xl block mb-4">📦</span>
            <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-xl font-bold mb-2">No Orders Found</h3>
            <p style={{ color:"var(--color-olive)" }} className="mb-6">
              {search ? `No orders matching "${search}"` : orders.length === 0 ? "You haven't placed any orders yet." : `No ${filter.toLowerCase()} orders.`}
            </p>
            <a href="/" style={{ background:"var(--color-olive)" }}
              className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold hover:opacity-90">
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map(order => <OrderCard key={order._id} order={order} onCancel={handleCancel} />)}
          </div>
        )}

        <div className="mt-10 p-6 rounded-3xl flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left"
          style={{ background:"var(--color-beige)", border:"1px solid var(--color-border)" }}>
          <div style={{ background:"var(--color-olive)" }} className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 mx-auto sm:mx-0">
            <Phone size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <p style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">Need Help With Your Order?</p>
            <p style={{ color:"var(--color-olive)" }} className="text-sm mt-1">Our team is available 7 days a week, 8AM–9PM</p>
          </div>
          <div className="flex gap-3">
            <a href="tel:+919825553565" style={{ background:"var(--color-charcoal)" }}
              className="text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 whitespace-nowrap">
              Call Us
            </a>
            <a href="https://wa.me/919825553565" style={{ background:"#25d366" }}
              className="text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 whitespace-nowrap">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

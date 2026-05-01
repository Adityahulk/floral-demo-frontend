import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Package, Truck, Check, X, Clock,
  MapPin, CreditCard, Phone, Copy, CheckCheck,
  ChevronRight, AlertCircle
} from "lucide-react";
import { authFetch } from "../utils/auth";

const BASE = "http://localhost:3001";
const fmt  = n => "₹" + n.toLocaleString("en-IN");

const STATUS_CONFIG = {
  pending:    { bg:"#dbeafe", color:"#2563eb", label:"Pending"    },
  processing: { bg:"#dbeafe", color:"#2563eb", label:"Processing" },
  shipped:    { bg:"#fef9c3", color:"#ca8a04", label:"Shipped"    },
  delivered:  { bg:"#dcfce7", color:"#16a34a", label:"Delivered"  },
  cancelled:  { bg:"#fee2e2", color:"#dc2626", label:"Cancelled"  },
};

const PAYMENT_STATUS = {
  pending:   { bg:"#fef9c3", color:"#ca8a04", label:"Payment Pending" },
  paid:      { bg:"#dcfce7", color:"#16a34a", label:"Paid"            },
  failed:    { bg:"#fee2e2", color:"#dc2626", label:"Payment Failed"  },
  refunded:  { bg:"#f3e8ff", color:"#7c3aed", label:"Refunded"        },
};

function normalizeStatus(s) { return (s || "").toLowerCase(); }

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

export default function OrderDetail() {
  const { id } = useParams();
  const [order,      setOrder]      = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [copied,     setCopied]     = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    authFetch(`${BASE}/api/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data.data || data.order || data);
        setLoading(false);
      })
      .catch(() => { setError("Failed to load order."); setLoading(false); });
  }, [id]);

  function copyOrderId() {
    navigator.clipboard.writeText(order._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCancel() {
    if (!window.confirm("Cancel this order?")) return;
    setCancelling(true);
    try {
      const res  = await authFetch(`${BASE}/api/orders/${order._id}/cancel`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel");
      setOrder(o => ({ ...o, status: "Cancelled" }));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div style={{ background:"#fdf8f3", minHeight:"100vh" }} className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }} />
          <p style={{ color:"#9c7a62" }} className="text-sm">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ background:"#fdf8f3", minHeight:"100vh" }} className="flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">⚠️</span>
        <p style={{ color:"#dc2626" }}>{error || "Order not found."}</p>
        <Link to="/orders" style={{ color:"#c97d5b" }} className="hover:underline">Back to Orders</Link>
      </div>
    );
  }

  const statusKey  = normalizeStatus(order.status);
  const s          = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
  const pmKey      = normalizeStatus(order.paymentStatus);
  const pm         = PAYMENT_STATUS[pmKey] || PAYMENT_STATUS.pending;
  const addr       = order.shippingAddress || {};
  const dateStr    = order.createdAt ? new Date(order.createdAt).toLocaleString("en-IN", { day:"2-digit", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" }) : "";
  const shortId    = order._id.slice(-8).toUpperCase();
  const totalAmt   = order.totalAmount || order.totalPrice || 0;
  const canCancel  = !["delivered","cancelled"].includes(statusKey);

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"#fdf8f3", minHeight:"100vh" }}>

      <div style={{ background:"#f5ede5", borderBottom:"1px solid #e8d5c4" }} className="py-3">
        <div className="max-w-5xl mx-auto px-4 flex items-center gap-2 text-sm flex-wrap" style={{ color:"#9c7a62" }}>
          <Link to="/" className="hover:underline">Home</Link><ChevronRight size={13}/>
          <Link to="/profile" className="hover:underline">My Account</Link><ChevronRight size={13}/>
          <Link to="/orders" className="hover:underline">My Orders</Link><ChevronRight size={13}/>
          <span style={{ color:"#4a3728" }} className="font-medium">#{shortId}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">

        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-70"
          style={{ color:"#c97d5b" }}>
          <ArrowLeft size={16}/> Back to Orders
        </button>

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
              <p style={{ color:"#9c7a62" }} className="text-sm">Order ID: <strong style={{ color:"#4a3728" }}>#{shortId}</strong></p>
              <button onClick={copyOrderId} className="hover:opacity-70 transition-opacity">
                {copied ? <CheckCheck size={14} style={{ color:"#22c55e" }}/> : <Copy size={14} style={{ color:"#9c7a62" }}/>}
              </button>
            </div>
            {dateStr && <p style={{ color:"#9c7a62" }} className="text-sm mt-0.5">Placed on {dateStr}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {canCancel && (
              <button onClick={handleCancel} disabled={cancelling}
                style={{ background:"#fee2e2", color:"#dc2626" }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80 disabled:opacity-60">
                <X size={14}/> {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            <a href="https://wa.me/919876543210"
              style={{ background:"#25d366" }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90">
              Help
            </a>
          </div>
        </div>

        {statusKey === "delivered" && (
          <div className="mb-6 p-4 rounded-2xl flex items-center gap-3"
            style={{ background:"#dcfce7", border:"1px solid #bbf7d0" }}>
            <Check size={20} style={{ color:"#16a34a" }} className="shrink-0"/>
            <div>
              <p style={{ color:"#166534" }} className="font-bold text-sm">Successfully Delivered!</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">

          <div className="space-y-6">
            <Section title="Order Items" icon={<Package size={16}/>}>
              <div className="space-y-5">
                {order.items.map((item, i) => {
                  const p     = item.product;
                  const name  = (p && p.name)   ? p.name  : "Product";
                  const img   = (p && p.images)  ? p.images[0] : null;
                  const price = (p && p.price)   ? p.price : 0;
                  return (
                    <div key={i}>
                      {i > 0 && <div className="border-t mb-5" style={{ borderColor:"#f0e4d8" }} />}
                      <div className="flex gap-4">
                        {img
                          ? <img src={img} alt={name} className="w-20 h-20 object-cover rounded-2xl shrink-0" />
                          : <div className="w-20 h-20 rounded-2xl shrink-0 flex items-center justify-center text-3xl" style={{ background:"#f5ede5" }}>🌸</div>
                        }
                        <div className="flex-1 min-w-0">
                          <p style={{ color:"#3a2416" }} className="font-bold truncate">{name}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.size && (
                              <span style={{ background:"#f5ede5", color:"#9c7a62" }}
                                className="text-xs px-2 py-0.5 rounded-full">{item.size}</span>
                            )}
                            {item.color && Array.isArray(item.color) && item.color.length > 0 && (
                              <span style={{ background:"#f5ede5", color:"#9c7a62" }}
                                className="text-xs px-2 py-0.5 rounded-full">{item.color.join(", ")}</span>
                            )}
                          </div>
                          <p style={{ color:"#9c7a62" }} className="text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                        {price > 0 && (
                          <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }}
                            className="font-bold shrink-0">{fmt(price * item.quantity)}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {order.note && (
              <Section title="Gift Note" icon={<AlertCircle size={16}/>}>
                <div className="p-4 rounded-2xl italic text-sm leading-relaxed"
                  style={{ background:"#fdf8f3", color:"#5c4033", border:"1px dashed #e8d5c4" }}>
                  "{order.note}"
                </div>
              </Section>
            )}
          </div>

          <div className="space-y-5">
            <Section title="Order Summary" icon={<CreditCard size={16}/>}>
              <div className="space-y-3 text-sm">

                {/* Delivery Status */}
                <div className="flex items-center justify-between">
                  <span style={{ color:"#9c7a62" }}>Delivery Status</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <span style={{ color:"#9c7a62" }}>Payment Status</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: pm.bg, color: pm.color }}>
                    {pm.label}
                  </span>
                </div>

                {/* Payment Mode */}
                {order.paymentMethod && (
                  <div className="flex justify-between">
                    <span style={{ color:"#9c7a62" }}>Payment Mode</span>
                    <span style={{ color:"#4a3728" }} className="font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                )}

                <div className="border-t pt-3" style={{ borderColor:"#f0e4d8" }}>
                  <div className="flex justify-between font-bold text-base">
                    <span style={{ color:"#3a2416" }}>Total Payable</span>
                    <span style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }}>{fmt(totalAmt)}</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Delivery Address" icon={<MapPin size={16}/>}>
              <div className="flex items-start gap-3">
                <div style={{ background:"#f5ede5" }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} style={{ color:"#c97d5b" }}/>
                </div>
                <div className="text-sm" style={{ color:"#5c4033" }}>
                  {addr.name && <p className="font-bold" style={{ color:"#3a2416" }}>{addr.name}</p>}
                  {addr.street && <p>{addr.street}</p>}
                  {(addr.city || addr.state) && <p>{[addr.city, addr.state, addr.zipCode].filter(Boolean).join(", ")}</p>}
                  {addr.phone && (
                    <div className="flex items-center gap-1.5 mt-2" style={{ color:"#9c7a62" }}>
                      <Phone size={12}/> {addr.phone}
                    </div>
                  )}
                </div>
              </div>
            </Section>

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

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import {
  ArrowLeft, Package, Truck, Check, X, Clock,
  MapPin, CreditCard, Phone, Copy, CheckCheck,
  AlertCircle
} from "lucide-react";
import { api } from "../api/client";
import { API } from "../api/endpoints";

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
    <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
      <div className="flex items-center gap-3 px-6 py-4 border-b" style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
        <div style={{ background:"var(--color-beige)", color:"var(--color-olive)" }} className="w-8 h-8 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold">{title}</h2>
      </div>
      <div className="p-4 sm:p-6">{children}</div>
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
    api(API.orders.detail(id))
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
      const data = await api(API.orders.cancel(order._id), { method: "PATCH" });
      if (!data.success) throw new Error(data.message || "Failed to cancel");
      setOrder(o => ({ ...o, status: "Cancelled" }));
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div style={{ background:"var(--color-beige)", minHeight:"100vh" }} className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }} />
          <p style={{ color:"var(--color-olive)" }} className="text-sm">Loading order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ background:"var(--color-beige)", minHeight:"100vh" }} className="flex flex-col items-center justify-center gap-4">
        <span className="text-5xl">⚠️</span>
        <p style={{ color:"#dc2626" }}>{error || "Order not found."}</p>
        <Link to="/orders" style={{ color:"var(--color-olive)" }} className="hover:underline">Back to Orders</Link>
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
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>

      <Breadcrumb paths={[
        { id: 1, name: "Home",          path: "/" },
        { id: 2, name: "My Account",    path: "/profile" },
        { id: 3, name: "My Orders",     path: "/orders" },
        { id: 4, name: `#${shortId}`,   path: `/${id}` },
      ]} />

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">

        <button onClick={() => window.history.back()}
          className="flex items-center gap-2 mb-5 text-sm font-medium hover:opacity-70"
          style={{ color:"var(--color-olive)" }}>
          <ArrowLeft size={16}/> Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-2xl sm:text-3xl font-bold">Order Details</h1>
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: s.bg, color: s.color }}>
                ● {s.label}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p style={{ color:"var(--color-olive)" }} className="text-sm">Order ID: <strong style={{ color:"var(--color-charcoal)" }}>#{shortId}</strong></p>
              <button onClick={copyOrderId} className="hover:opacity-70 transition-opacity">
                {copied ? <CheckCheck size={14} style={{ color:"#22c55e" }}/> : <Copy size={14} style={{ color:"var(--color-olive)" }}/>}
              </button>
            </div>
            {dateStr && <p style={{ color:"var(--color-olive)" }} className="text-sm mt-0.5">Placed on {dateStr}</p>}
          </div>

          <div className="flex flex-wrap gap-2">
            {canCancel && (
              <button onClick={handleCancel} disabled={cancelling}
                style={{ background:"#fee2e2", color:"#dc2626" }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80 disabled:opacity-60">
                <X size={14}/> {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
            <a href="https://wa.me/919825553565"
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

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

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
                      {i > 0 && <div className="border-t mb-4" style={{ borderColor:"var(--color-border)" }} />}
                      <div className="flex gap-3">
                        {img
                          ? <img src={img} alt={name} className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl shrink-0" />
                          : <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0 flex items-center justify-center text-2xl" style={{ background:"var(--color-beige)" }}>🌸</div>
                        }
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p style={{ color:"var(--color-charcoal)" }} className="font-bold leading-snug">{name}</p>
                            {price > 0 && (
                              <p style={{ color:"var(--color-olive)", fontFamily:"Georgia, serif" }}
                                className="font-bold shrink-0 text-sm sm:text-base">{fmt(price * item.quantity)}</p>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.size && (
                              <span style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}
                                className="text-xs px-2 py-0.5 rounded-full">{item.size}</span>
                            )}
                            {item.color && Array.isArray(item.color) && item.color.length > 0 && (
                              <span style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}
                                className="text-xs px-2 py-0.5 rounded-full">{item.color.join(", ")}</span>
                            )}
                          </div>
                          <p style={{ color:"var(--color-olive)" }} className="text-xs mt-1">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Section>

            {order.note && (
              <Section title="Gift Note" icon={<AlertCircle size={16}/>}>
                <div className="p-4 rounded-2xl italic text-sm leading-relaxed"
                  style={{ background:"var(--color-beige)", color:"var(--color-charcoal)", border:"1px dashed var(--color-border)" }}>
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
                  <span style={{ color:"var(--color-olive)" }}>Delivery Status</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: s.bg, color: s.color }}>
                    {s.label}
                  </span>
                </div>

                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <span style={{ color:"var(--color-olive)" }}>Payment Status</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: pm.bg, color: pm.color }}>
                    {pm.label}
                  </span>
                </div>

                {/* Payment Mode */}
                {order.paymentMethod && (
                  <div className="flex justify-between">
                    <span style={{ color:"var(--color-olive)" }}>Payment Mode</span>
                    <span style={{ color:"var(--color-charcoal)" }} className="font-medium capitalize">{order.paymentMethod}</span>
                  </div>
                )}

                <div className="border-t pt-3" style={{ borderColor:"var(--color-border)" }}>
                  <div className="flex justify-between font-bold text-base">
                    <span style={{ color:"var(--color-charcoal)" }}>Total Payable</span>
                    <span style={{ color:"var(--color-olive)", fontFamily:"Georgia, serif" }}>{fmt(totalAmt)}</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Delivery Address" icon={<MapPin size={16}/>}>
              <div className="flex items-start gap-3">
                <div style={{ background:"var(--color-beige)" }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={15} style={{ color:"var(--color-olive)" }}/>
                </div>
                <div className="text-sm" style={{ color:"var(--color-charcoal)" }}>
                  {addr.name && <p className="font-bold" style={{ color:"var(--color-charcoal)" }}>{addr.name}</p>}
                  {addr.street && <p>{addr.street}</p>}
                  {(addr.city || addr.state) && <p>{[addr.city, addr.state, addr.zipCode].filter(Boolean).join(", ")}</p>}
                  {addr.phone && (
                    <div className="flex items-center gap-1.5 mt-2" style={{ color:"var(--color-olive)" }}>
                      <Phone size={12}/> {addr.phone}
                    </div>
                  )}
                </div>
              </div>
            </Section>

            <div className="p-5 rounded-3xl text-center" style={{ background:"var(--color-charcoal)" }}>
              <p style={{ fontFamily:"Georgia, serif", color:"var(--color-beige)" }} className="font-bold mb-1">Need Help?</p>
              <p style={{ color:"var(--color-sage)" }} className="text-xs mb-4">Our team is available 7 days a week</p>
              <div className="flex gap-2">
                <a href="tel:+919825553565" style={{ background:"var(--color-olive)" }}
                  className="flex-1 py-2 rounded-full text-white text-xs font-bold text-center hover:opacity-90">
                  📞 Call
                </a>
                <a href="https://wa.me/919825553565" style={{ background:"#25d366" }}
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

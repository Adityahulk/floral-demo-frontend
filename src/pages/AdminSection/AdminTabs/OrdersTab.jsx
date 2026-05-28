import { useState, useEffect } from "react";
import { authFetch } from "../../../utils/auth";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { BASE, fmt, fmtK } from "./shared";

export const ORDER_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled"];

export const ORDER_STATUS_CFG = {
  pending:    { bg:"#dbeafe", color:"#2563eb", label:"Pending",    dot:"#2563eb" },
  confirmed:  { bg:"#e0f2fe", color:"#0284c7", label:"Confirmed",  dot:"#0284c7" },
  processing: { bg:"#fef3c7", color:"#d97706", label:"Processing", dot:"#d97706" },
  shipped:    { bg:"#fef9c3", color:"#ca8a04", label:"Shipped",    dot:"#ca8a04" },
  delivered:  { bg:"#dcfce7", color:"#16a34a", label:"Delivered",  dot:"#16a34a" },
  cancelled:  { bg:"#fee2e2", color:"#dc2626", label:"Cancelled",  dot:"#dc2626" },
};

const STATUS_NEXT = {
  pending:    ["confirmed","cancelled"],
  confirmed:  ["processing","cancelled"],
  processing: ["shipped","cancelled"],
  shipped:    ["delivered"],
  delivered:  [],
  cancelled:  [],
};

function OrderStatusBadge({ status }) {
  const s = ORDER_STATUS_CFG[(status||"").toLowerCase()] || ORDER_STATUS_CFG.pending;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background:s.bg, color:s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background:s.dot }}/>
      {s.label}
    </span>
  );
}

export default function AdminOrdersTab() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    authFetch(`${BASE}/api/admin/orders`)
      .then(r => r.json())
      .then(data => { setOrders(data.data || data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function updateStatus(orderId, status) {
    setUpdating(orderId);
    try {
      const res  = await authFetch(`${BASE}/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        body:   JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  }

  const filtered = orders.filter(o => {
    const st = (o.status || "").toLowerCase();
    const matchFilter = filter === "all" || st === filter;
    const matchSearch = search === "" ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      (o.shippingAddress?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.shippingAddress?.phone || "").includes(search);
    return matchFilter && matchSearch;
  });

  const counts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter(o => (o.status||"").toLowerCase() === s).length;
    return acc;
  }, { all: orders.length });

  const totalRevenue = orders
    .filter(o => o.status !== "cancelled")
    .reduce((s, o) => s + (o.totalAmount || o.totalPrice || 0), 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-2xl font-bold">Orders</h2>
          <p style={{ color:"var(--color-olive)" }} className="text-sm mt-0.5">{orders.length} total · {fmtK(totalRevenue)} revenue</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-olive)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ID, name, phone…"
            className="pl-9 pr-4 py-2 rounded-full border text-sm outline-none w-64"
            style={{ borderColor:"var(--color-border)", background:"white", color:"var(--color-charcoal)" }} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {[
          { key:"all",        label:"Total",      value:counts.all,        color:"var(--color-olive)", bg:"var(--color-beige)" },
          { key:"pending",    label:"Pending",    value:counts.pending,    color:"#2563eb", bg:"#dbeafe" },
          { key:"confirmed",  label:"Confirmed",  value:counts.confirmed,  color:"#0284c7", bg:"#e0f2fe" },
          { key:"processing", label:"Processing", value:counts.processing, color:"#d97706", bg:"#fef3c7" },
          { key:"shipped",    label:"Shipped",    value:counts.shipped,    color:"#ca8a04", bg:"#fef9c3" },
          { key:"delivered",  label:"Delivered",  value:counts.delivered,  color:"#16a34a", bg:"#dcfce7" },
          { key:"cancelled",  label:"Cancelled",  value:counts.cancelled,  color:"#dc2626", bg:"#fee2e2" },
        ].map(({ key, label, value, color, bg }) => (
          <button key={key} onClick={() => setFilter(key)}
            className="rounded-2xl p-3 text-center border-2 transition-all"
            style={{
              background: filter === key ? bg : "white",
              borderColor: filter === key ? color : "var(--color-border)",
            }}>
            <p className="text-xl font-bold" style={{ color, fontFamily:"Georgia, serif" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: filter === key ? color : "var(--color-olive)" }}>{label}</p>
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl block mb-3">📦</span>
          <p style={{ color:"var(--color-olive)" }}>No orders found</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead className="hidden sm:table-header-group">
              <tr style={{ background:"var(--color-beige)", borderBottom:"1px solid var(--color-border)" }}>
                {["Order","Customer","Items","Amount","Status",""].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide whitespace-nowrap"
                    style={{ color:"var(--color-olive)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
          {filtered.map((order, idx) => {
            const st    = (order.status||"").toLowerCase();
            const cfg   = ORDER_STATUS_CFG[st] || ORDER_STATUS_CFG.pending;
            const addr  = order.shippingAddress || {};
            const date  = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })
              : "";
            const total = order.totalAmount || order.totalPrice || 0;
            const isExp = expanded === order._id;
            const nextStatuses = STATUS_NEXT[st] || [];

            return (
              <tr key={order._id}
                style={{ borderBottom: idx < filtered.length - 1 || isExp ? "1px solid var(--color-border)" : "none" }}>

                {/* Row */}
                <td colSpan={6} style={{ padding: 0 }}>
                <div
                  className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1.4fr_0.6fr_0.9fr_1.1fr_auto] gap-3 px-5 py-4 items-center cursor-pointer hover:bg-amber-50/30 transition-colors"
                  onClick={() => setExpanded(isExp ? null : order._id)}>

                  <div>
                    <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">{date}</p>
                  </div>

                  <div className="hidden sm:block min-w-0">
                    <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-semibold truncate">
                      {addr.name || order.user?.name || "—"}
                    </p>
                    {addr.phone && (
                      <p style={{ color:"var(--color-olive)" }} className="text-xs truncate">📞 {addr.phone}</p>
                    )}
                    <p style={{ color:"var(--color-olive)" }} className="text-xs truncate">
                      {[addr.city, addr.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>

                  <div className="hidden sm:block">
                    <p style={{ color:"var(--color-charcoal)" }} className="text-sm">{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</p>
                  </div>

                  <p className="hidden sm:block font-bold text-sm whitespace-nowrap" style={{ color:"var(--color-olive)" }}>
                    {fmt(total)}
                  </p>

                  <div className="hidden sm:block">
                    <OrderStatusBadge status={st} />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="sm:hidden"><OrderStatusBadge status={st} /></span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background:"var(--color-beige)" }}>
                      {isExp
                        ? <ChevronUp size={14} style={{ color:"var(--color-olive)" }} />
                        : <ChevronDown size={14} style={{ color:"var(--color-olive)" }} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {isExp && (
                  <div className="border-t px-5 pb-6 pt-5 sm:col-span-6" style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
                    <div className="grid md:grid-cols-2 gap-6">

                      <div className="space-y-5">
                        <div>
                          <p style={{ color:"var(--color-charcoal)" }} className="text-xs font-bold uppercase tracking-wide mb-3">Order Items</p>
                          <div className="space-y-3">
                            {(order.items || []).map((item, i) => {
                              const p    = item.product;
                              const name = p?.name  || "Product";
                              const img  = p?.images?.[0] || null;
                              const price= p?.price  || 0;
                              return (
                                <div key={i} className="flex gap-3 items-center p-3 rounded-xl border"
                                  style={{ borderColor:"var(--color-border)", background:"white" }}>
                                  {img
                                    ? <img src={img} alt={name} className="w-12 h-12 object-cover rounded-lg shrink-0"/>
                                    : <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-xl"
                                        style={{ background:"var(--color-beige)" }}>⌨</div>
                                  }
                                  <div className="flex-1 min-w-0">
                                    <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-semibold truncate">{name}</p>
                                    <div className="flex gap-2 mt-0.5 flex-wrap">
                                      {item.size && <span style={{ background:"var(--color-beige)", color:"var(--color-olive)" }} className="text-xs px-2 py-0.5 rounded-full">{item.size}</span>}
                                      {item.color?.length > 0 && <span style={{ background:"var(--color-beige)", color:"var(--color-olive)" }} className="text-xs px-2 py-0.5 rounded-full">{item.color.join(", ")}</span>}
                                    </div>
                                    <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">Qty: {item.quantity}</p>
                                  </div>
                                  {price > 0 && (
                                    <p style={{ color:"var(--color-olive)" }} className="text-sm font-bold shrink-0">{fmt(price * item.quantity)}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border" style={{ borderColor:"var(--color-border)", background:"white" }}>
                          <p style={{ color:"var(--color-charcoal)" }} className="text-xs font-bold uppercase tracking-wide mb-2">Delivery Address</p>
                          <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-semibold">{addr.name}</p>
                          <p style={{ color:"var(--color-olive)" }} className="text-sm">{addr.street}</p>
                          <p style={{ color:"var(--color-olive)" }} className="text-sm">{[addr.city, addr.state, addr.pincode || addr.zipCode].filter(Boolean).join(", ")}</p>
                          {addr.phone && <p style={{ color:"var(--color-olive)" }} className="text-xs mt-1">📞 {addr.phone}</p>}
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div className="p-4 rounded-xl border" style={{ borderColor:"var(--color-border)", background:"white" }}>
                          <p style={{ color:"var(--color-charcoal)" }} className="text-xs font-bold uppercase tracking-wide mb-4">Order Status Pipeline</p>
                          <div className="flex flex-col gap-2">
                            {ORDER_STATUSES.filter(s => s !== "cancelled").map((s, i) => {
                              const past    = ORDER_STATUSES.indexOf(st) > i && st !== "cancelled";
                              const current = st === s;
                              const scfg    = ORDER_STATUS_CFG[s];
                              return (
                                <div key={s} className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                                    style={{
                                      background: current ? scfg.color : past ? "#22c55e" : "var(--color-border)",
                                      color: (current || past) ? "white" : "var(--color-olive)",
                                    }}>
                                    {past ? "✓" : i + 1}
                                  </div>
                                  <span className="text-sm font-medium capitalize"
                                    style={{ color: current ? scfg.color : past ? "#16a34a" : "var(--color-olive)" }}>
                                    {scfg.label}
                                  </span>
                                  {current && <OrderStatusBadge status={s} />}
                                </div>
                              );
                            })}
                            {st === "cancelled" && (
                              <div className="flex items-center gap-3 mt-1">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{ background:"#dc2626", color:"white" }}>✕</div>
                                <span className="text-sm font-medium" style={{ color:"#dc2626" }}>Cancelled</span>
                                <OrderStatusBadge status="cancelled" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 rounded-xl border space-y-3" style={{ borderColor:"var(--color-border)", background:"white" }}>
                          <p style={{ color:"var(--color-charcoal)" }} className="text-xs font-bold uppercase tracking-wide">Order Info</p>
                          <div className="space-y-2 text-sm">
                            {[
                              ["Order ID",       `#${order._id.slice(-8).toUpperCase()}`],
                              ["Total Amount",   fmt(total)],
                              ["Payment Status", order.paymentStatus || "—"],
                              ["Items",          `${order.items?.length || 0} item(s)`],
                            ].map(([k, v]) => (
                              <div key={k} className="flex justify-between">
                                <span style={{ color:"var(--color-olive)" }}>{k}</span>
                                <span style={{ color:"var(--color-charcoal)" }} className="font-semibold">{v}</span>
                              </div>
                            ))}
                          </div>

                          {nextStatuses.length > 0 && (
                            <div className="pt-3 border-t" style={{ borderColor:"var(--color-border)" }}>
                              <p style={{ color:"var(--color-charcoal)" }} className="text-xs font-bold mb-2">Move to Next Status</p>
                              <div className="flex gap-2 flex-wrap">
                                {nextStatuses.map(ns => {
                                  const ncfg = ORDER_STATUS_CFG[ns];
                                  return (
                                    <button key={ns}
                                      disabled={updating === order._id}
                                      onClick={() => updateStatus(order._id, ns)}
                                      className="px-4 py-2 rounded-full text-xs font-bold transition-all hover:opacity-80 disabled:opacity-50"
                                      style={{ background: ncfg.bg, color: ncfg.color, border:`1.5px solid ${ncfg.color}` }}>
                                      {updating === order._id ? "…" : `→ ${ncfg.label}`}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <div className="pt-3 border-t" style={{ borderColor:"var(--color-border)" }}>
                            <p style={{ color:"var(--color-olive)" }} className="text-xs mb-2">Manual Override</p>
                            <select
                              value={order.status}
                              disabled={updating === order._id}
                              onChange={e => updateStatus(order._id, e.target.value)}
                              className="w-full text-sm rounded-xl border px-3 py-2 outline-none cursor-pointer"
                              style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)", background:"white" }}>
                              {ORDER_STATUSES.map(s => (
                                <option key={s} value={s}>{ORDER_STATUS_CFG[s].label}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                </td>
              </tr>
            );
          })}
            </tbody>
          </table>
          </div>
        </div>
      )}
    </div>
  );
}

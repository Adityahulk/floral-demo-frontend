import { useState, useEffect, useRef } from "react";
import { authFetch, getTokenPayload } from "../../utils/auth";
import {
  LayoutDashboard, Users, BarChart2, Package,
  TrendingUp, ShoppingBag, IndianRupee,
  Bell, Search, Menu, X, ChevronRight, Eye,
  ArrowUpRight, ArrowDownRight,
  ChevronUp, ChevronDown, LogOut, Home, Edit2, Trash2, ToggleLeft, ToggleRight,
  RefreshCw, LayoutGrid, List,
} from "lucide-react";
 import FloralLogo from "../../assets/floral-logo.png";
import { Plus } from "lucide-react";
import AddProductForm from "./AddProductForm";
const fmt   = n => "₹" + n.toLocaleString("en-IN");
const fmtK  = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;

// ─── BAR CHART ────────────────────────────────────────────────────────────────

function BarChart({ data, labels, color = "#c97d5b" }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-24 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
            style={{ height:`${(v / max) * 96}px`, background: color, opacity: i === data.length - 1 ? 1 : 0.5 }} />
          {labels && <span className="text-xs" style={{ color:"#9c7a62" }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ══════════════════════════════════════════════════════════════════════════════

const DASH_STATUS_COLORS = {
  delivered:    { bg:"#dcfce7", color:"#16a34a" },
  "in transit": { bg:"#fef9c3", color:"#ca8a04" },
  confirmed:    { bg:"#dbeafe", color:"#2563eb" },
  processing:   { bg:"#dbeafe", color:"#2563eb" },
  cancelled:    { bg:"#fee2e2", color:"#dc2626" },
  pending:      { bg:"#f5ede5", color:"#9c7a62" },
};

function Dashboard() {
  const [period,      setPeriod]      = useState("daily");
  const [kpi,         setKpi]         = useState(null);
  const [dash,        setDash]        = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [dashLoading, setDashLoading] = useState(false);
  const periodChanged = useRef(false);

  // Parallel initial fetch: KPI + dashboard(daily)
  useEffect(() => {
    Promise.all([
      authFetch(`${CUST_BASE}/api/admin/analytics/kpi`).then(r => r.json()).catch(() => null),
      authFetch(`${CUST_BASE}/api/admin/analytics/dashboard?period=daily`).then(r => r.json()).catch(() => null),
    ]).then(([k, d]) => {
      setKpi(k);
      setDash(d);
      setInitialLoad(false);
      periodChanged.current = true;
    });
  }, []);

  // Refetch dashboard only when user explicitly changes period
  useEffect(() => {
    if (!periodChanged.current) return;
    authFetch(`${CUST_BASE}/api/admin/analytics/dashboard?period=${period}`)
      .then(r => r.json())
      .then(data => { setDash(data); setDashLoading(false); })
      .catch(() => setDashLoading(false));
  }, [period]);

  function changePeriod(p) { setDashLoading(true); setPeriod(p); }

  // KPI response: { kpi: { totalRevenue, ordersToday, activeCustomers, pendingOrders } }
  const k = kpi?.kpi;
  const kpiCards = [
    {
      label: "Total Revenue",
      value: k ? fmtK(k.totalRevenue?.value ?? 0) : "—",
      sub:   k?.totalRevenue?.monthlyChange != null
               ? `${k.totalRevenue.monthlyChange >= 0 ? "+" : ""}${k.totalRevenue.monthlyChange}% this month`
               : null,
      pos:   (k?.totalRevenue?.monthlyChange ?? 0) >= 0,
    },
    {
      label: "Orders Today",
      value: k ? (k.ordersToday?.value ?? 0).toString() : "—",
      sub:   k?.ordersToday?.vsYesterday != null
               ? `${k.ordersToday.vsYesterday >= 0 ? "+" : ""}${k.ordersToday.vsYesterday}% vs yesterday`
               : null,
      pos:   (k?.ordersToday?.vsYesterday ?? 0) >= 0,
    },
    {
      label: "Active Customers",
      value: k ? (k.activeCustomers?.value ?? 0).toLocaleString() : "—",
      sub:   k?.activeCustomers?.monthlyChange != null
               ? `${k.activeCustomers.monthlyChange >= 0 ? "+" : ""}${k.activeCustomers.monthlyChange}% this month`
               : null,
      pos:   (k?.activeCustomers?.monthlyChange ?? 0) >= 0,
    },
    {
      label: "Pending Orders",
      value: k ? (k.pendingOrders?.value ?? 0).toString() : "—",
      sub:   k?.pendingOrders?.overdue > 0 ? `${k.pendingOrders.overdue} overdue` : "All on track",
      pos:   !(k?.pendingOrders?.overdue > 0),
    },
  ];

  // Dashboard response: { overview: { totalRevenue, totalOrders, newCustomers, avgOrderValue }, revenueChart: [] }
  const ov = dash?.overview;
  const stats = ov ? [
    { label:"Total Revenue",   value: fmtK(ov.totalRevenue?.value ?? 0),             change: ov.totalRevenue?.change ?? 0,   icon:<IndianRupee size={20}/>, color:"#c97d5b" },
    { label:"Total Orders",    value: (ov.totalOrders?.value ?? 0).toLocaleString(),  change: ov.totalOrders?.change ?? 0,    icon:<ShoppingBag size={20}/>, color:"#8b5cf6" },
    { label:"New Customers",   value: (ov.newCustomers?.value ?? 0).toLocaleString(), change: ov.newCustomers?.change ?? 0,   icon:<Users size={20}/>,       color:"#06b6d4" },
    { label:"Avg Order Value", value: fmtK(ov.avgOrderValue?.value ?? 0),            change: ov.avgOrderValue?.change ?? 0,  icon:<TrendingUp size={20}/>,  color:"#f59e0b" },
  ] : [];

  // revenueChart: [{ day, revenue, orders }]
  const chartData   = dash?.revenueChart ?? [];
  const chartValues = chartData.map(d => d.revenue ?? 0);
  const chartLabels = chartData.map(d => d.day ?? "");
  const recentOrders = dash?.recentOrders ?? [];

  if (initialLoad) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-7 h-7 border-2 rounded-full animate-spin"
          style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* KPI Cards — dark style */}
      <div>
        <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold mb-4">
          Key Performance Indicators
        </h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map(({ label, value, sub, pos }) => (
            <div key={label} className="rounded-2xl p-5" style={{ background:"#1e1410" }}>
              <p style={{ color:"#a08070" }} className="text-xs font-semibold uppercase tracking-wide mb-2">{label}</p>
              <p style={{ color:"white", fontFamily:"Georgia, serif" }} className="text-3xl font-bold mb-1">{value}</p>
              {sub && <p style={{ color: pos ? "#4ade80" : "#f87171" }} className="text-xs">{sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex items-center justify-between">
        <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Overview</h2>
        <div className="flex gap-1 p-1 rounded-full" style={{ background:"#f5ede5" }}>
          {["daily","weekly","monthly"].map(p => (
            <button key={p} onClick={() => changePeriod(p)}
              className="px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
              style={period === p ? { background:"#c97d5b", color:"white" } : { color:"#9c7a62" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {dashLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }} />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map(({ label, value, change, icon, color }) => {
              const up = change >= 0;
              return (
                <div key={label} className="bg-white rounded-2xl p-5 border" style={{ borderColor:"#e8d5c4" }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background:`${color}18`, color }}>
                      {icon}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: up ? "#dcfce7" : "#fee2e2", color: up ? "#16a34a" : "#dc2626" }}>
                      {up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                      {Math.abs(change)}%
                    </div>
                  </div>
                  <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold mb-0.5">{value}</p>
                  <p style={{ color:"#9c7a62" }} className="text-xs">{label}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue Bar Chart */}
          {chartValues.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"#e8d5c4" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Revenue Chart</h3>
                  <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">
                    {period === "daily" ? "Last 7 days" : period === "weekly" ? "Last 7 weeks" : "Last 12 months"}
                  </p>
                </div>
                <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }} className="text-2xl font-bold">
                  {fmtK(ov?.totalRevenue?.value ?? 0)}
                </p>
              </div>
              <BarChart data={chartValues} labels={chartLabels} />
            </div>
          )}

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
              <div className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
                <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Recent Orders</h3>
                <button style={{ color:"#c97d5b" }} className="text-sm font-semibold flex items-center gap-1 hover:opacity-70">
                  View All <ChevronRight size={14}/>
                </button>
              </div>
              <div className="divide-y">
                {recentOrders.map(order => {
                  const id          = order._id || order.id || "";
                  const customer    = order.shippingAddress?.name || order.user?.name || "Customer";
                  const amount      = order.totalAmount ?? order.total ?? order.price ?? 0;
                  const statusLabel = order.status || "pending";
                  const product     = order.items?.[0]?.product?.name || order.item || "Order";
                  const imgSrc      = order.items?.[0]?.product?.images?.[0] || order.img || null;
                  const sc          = DASH_STATUS_COLORS[statusLabel.toLowerCase()] || DASH_STATUS_COLORS.pending;
                  return (
                    <div key={id} className="flex items-center gap-4 px-6 py-4 transition-colors"
                      style={{ background:"white" }}
                      onMouseEnter={e => e.currentTarget.style.background="#fdf8f3"}
                      onMouseLeave={e => e.currentTarget.style.background="white"}>
                      {imgSrc
                        ? <img src={imgSrc} alt={product} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                        : <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg"
                            style={{ background:"#f5ede5" }}>🌸</div>
                      }
                      <div className="flex-1 min-w-0">
                        <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{product}</p>
                        <p style={{ color:"#9c7a62" }} className="text-xs">{customer}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: sc.bg, color: sc.color }}>
                        {statusLabel}
                      </span>
                      <p style={{ color:"#c97d5b" }} className="font-bold text-sm shrink-0">{fmt(amount)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CUSTOMERS TAB
// ══════════════════════════════════════════════════════════════════════════════

const CUST_BASE = "http://localhost:3001";

function initials(name = "") {
  return name.trim().split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

function CustomersTab() {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const LIMIT = 20;

  const [search,     setSearch]     = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "true" | "false"
  const [selected,   setSelected]   = useState(null);
  const [toggling,   setToggling]   = useState(null);

  // Edit state
  const [editing,    setEditing]    = useState(false);
  const [editForm,   setEditForm]   = useState({});
  const [saving,     setSaving]     = useState(false);
  const [editError,  setEditError]  = useState("");

  // Effect only calls setState inside async callbacks — satisfies no-setState-in-effect rule
  useEffect(() => {
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (activeFilter !== "all") params.set("active", activeFilter);
    authFetch(`${CUST_BASE}/api/auth/admin/users?${params}`)
      .then(r => r.json())
      .then(data => { setUsers(data.users || []); setTotal(data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, activeFilter]);

  // setLoading(true) lives in event handlers (not effect body) — allowed by linter
  function changeFilter(af) { setLoading(true); setActiveFilter(af); setPage(1); }
  function handlePageChange(pg) { setLoading(true); setPage(pg); }

  // Client-side search on loaded page
  const filtered = users.filter(u =>
    search === "" ||
    (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.contactNumber || "").includes(search)
  );

  async function handleToggle(u, e) {
    e.stopPropagation();
    setToggling(u._id);
    try {
      const res  = await authFetch(`${CUST_BASE}/api/auth/admin/users/${u._id}/status`, { method: "PATCH" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      const updated = data.user || { ...u, active: !u.active };
      setUsers(prev => prev.map(x => x._id === u._id ? { ...x, active: updated.active } : x));
      if (selected?._id === u._id) setSelected(s => ({ ...s, active: updated.active }));
    } catch (err) {
      alert(err.message);
    } finally {
      setToggling(null);
    }
  }

  function openEdit(u) {
    setEditForm({ name: u.name || "", email: u.email || "", contactNumber: u.contactNumber || "", role: u.role || "user" });
    setEditError("");
    setEditing(true);
  }

  async function handleSave() {
    setSaving(true);
    setEditError("");
    try {
      const res  = await authFetch(`${CUST_BASE}/api/auth/admin/users/${selected._id}`, {
        method: "PUT",
        body:   JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");
      const updated = data.user;
      setUsers(prev => prev.map(x => x._id === selected._id ? { ...x, ...updated } : x));
      setSelected(s => ({ ...s, ...updated }));
      setEditing(false);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Customers</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm">{total} total users</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* Active Filter */}
          {[["all","All"],["true","Active"],["false","Inactive"]].map(([val, label]) => (
            <button key={val} onClick={() => changeFilter(val)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={activeFilter === val
                ? { background:"#4a3728", borderColor:"#4a3728", color:"white" }
                : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              {label}
            </button>
          ))}
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Name, email, phone…"
              className="pl-9 pr-4 py-2 rounded-full border text-sm outline-none w-48"
              style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }} />
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">

        {/* ── Table ── */}
        <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
          {/* Col headers */}
          <div className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_auto] gap-3 px-5 py-3 border-b text-xs font-bold uppercase tracking-wide"
            style={{ borderColor:"#f0e4d8", background:"#fdf8f3", color:"#9c7a62" }}>
            <span>Customer</span>
            <span>Phone</span>
            <span>Orders</span>
            <span>Spent</span>
            <span>Status</span>
            <span></span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-3xl block mb-2">👤</span>
              <p style={{ color:"#9c7a62" }} className="text-sm">No users found</p>
            </div>
          ) : filtered.map((u, idx) => {
            const isSelected = selected?._id === u._id;
            const isTog      = toggling === u._id;
            return (
              <div key={u._id}
                onClick={() => { setSelected(isSelected ? null : u); setEditing(false); }}
                className="grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.8fr_auto] gap-3 px-5 py-3.5 items-center border-b cursor-pointer transition-colors"
                style={{
                  borderColor:"#f0e4d8",
                  background: isSelected ? "#fdf8f3" : "white",
                  borderLeft: isSelected ? "3px solid #c97d5b" : "3px solid transparent",
                  ...(idx === filtered.length - 1 ? { borderBottom:"none" } : {}),
                }}>

                {/* Avatar + Name + Email */}
                <div className="flex items-center gap-3 min-w-0">
                  {u.profileImage
                    ? <img src={u.profileImage} alt={u.name} className="w-9 h-9 rounded-full object-cover shrink-0"/>
                    : <div style={{ background: u.active ? "#c97d5b" : "#d4b5a0" }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {initials(u.name) || "?"}
                      </div>
                  }
                  <div className="min-w-0">
                    <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{u.name || "—"}</p>
                    <p style={{ color:"#9c7a62" }} className="text-xs truncate">{u.email}</p>
                  </div>
                </div>

                {/* Phone */}
                <p style={{ color:"#5c4033" }} className="text-xs truncate">{u.contactNumber || "—"}</p>

                {/* Orders */}
                <p style={{ color:"#4a3728" }} className="text-sm font-semibold text-center">{u.totalOrders ?? "—"}</p>

                {/* Spent */}
                <p style={{ color:"#c97d5b" }} className="text-xs font-bold">
                  {u.totalSpent != null ? fmtK(u.totalSpent) : "—"}
                </p>

                {/* Active toggle */}
                <button
                  onClick={e => handleToggle(u, e)}
                  disabled={isTog}
                  title={u.active ? "Deactivate" : "Activate"}
                  className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
                  style={u.active
                    ? { background:"#dcfce7", color:"#16a34a" }
                    : { background:"#f5f5f4", color:"#9c7a62" }}>
                  {isTog
                    ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                    : <span className="w-1.5 h-1.5 rounded-full" style={{ background: u.active ? "#16a34a" : "#9c7a62" }}/>
                  }
                  {u.active ? "Active" : "Inactive"}
                </button>

                <ChevronRight size={14} style={{ color: isSelected ? "#c97d5b" : "#d4b5a0" }} />
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor:"#f0e4d8" }}>
              <p style={{ color:"#9c7a62" }} className="text-xs">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => handlePageChange(page - 1)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border disabled:opacity-40"
                  style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                  ← Prev
                </button>
                <button disabled={page === totalPages} onClick={() => handlePageChange(page + 1)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border disabled:opacity-40"
                  style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Detail / Edit Panel ── */}
        {selected ? (
          <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
            {/* Profile header */}
            <div className="p-5 border-b" style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
              <div className="flex items-center justify-between mb-4">
                <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold">
                  {editing ? "Edit User" : "User Profile"}
                </p>
                <div className="flex items-center gap-2">
                  {!editing && (
                    <button onClick={() => openEdit(selected)}
                      className="p-1.5 rounded-lg border hover:opacity-70"
                      style={{ borderColor:"#e8d5c4", color:"#5c4033" }}
                      title="Edit">
                      <Edit2 size={13}/>
                    </button>
                  )}
                  <button onClick={() => { setSelected(null); setEditing(false); }} className="p-1 hover:opacity-70">
                    <X size={15} style={{ color:"#9c7a62" }} />
                  </button>
                </div>
              </div>
              <div className="text-center">
                {selected.profileImage
                  ? <img src={selected.profileImage} alt={selected.name}
                      className="w-16 h-16 rounded-full object-cover border-2 mx-auto mb-3"
                      style={{ borderColor:"#c97d5b" }}/>
                  : <div style={{ background: selected.active ? "#c97d5b" : "#d4b5a0" }}
                      className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                      {initials(selected.name) || "?"}
                    </div>
                }
                <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">{selected.name || "—"}</p>
                <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{selected.email}</p>
                {selected.contactNumber && (
                  <p style={{ color:"#9c7a62" }} className="text-xs">📞 {selected.contactNumber}</p>
                )}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={selected.role === "admin"
                      ? { background:"#fef3c7", color:"#d97706" }
                      : { background:"#f5ede5", color:"#9c7a62" }}>
                    {selected.role === "admin" ? "Admin" : "User"}
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={selected.active
                      ? { background:"#dcfce7", color:"#16a34a" }
                      : { background:"#fee2e2", color:"#dc2626" }}>
                    {selected.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {/* Order stats */}
                {(selected.totalOrders != null || selected.totalSpent != null) && (
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="rounded-xl py-2" style={{ background:"#f5ede5" }}>
                      <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }} className="font-bold text-lg">{selected.totalOrders ?? 0}</p>
                      <p style={{ color:"#9c7a62" }} className="text-xs">Orders</p>
                    </div>
                    <div className="rounded-xl py-2" style={{ background:"#f5ede5" }}>
                      <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }} className="font-bold text-lg">{selected.totalSpent != null ? fmtK(selected.totalSpent) : "—"}</p>
                      <p style={{ color:"#9c7a62" }} className="text-xs">Spent</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Info rows */}
            {!editing ? (
              <div className="p-5 space-y-3">
                {[
                  ["User ID",      `#${selected._id.slice(-8).toUpperCase()}`],
                  ["Email",        selected.email],
                  ["Phone",        selected.contactNumber || "—"],
                  ["Role",         selected.role],
                  ["Total Orders", selected.totalOrders ?? "—"],
                  ["Total Spent",  selected.totalSpent != null ? fmt(selected.totalSpent) : "—"],
                  ["Member Since", selected.createdAt ? new Date(selected.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm border-b pb-2" style={{ borderColor:"#f5ede5" }}>
                    <span style={{ color:"#9c7a62" }}>{k}</span>
                    <span style={{ color:"#4a3728" }} className="font-semibold text-right max-w-[55%] truncate">{v}</span>
                  </div>
                ))}
                {/* Toggle active */}
                <button
                  onClick={e => handleToggle(selected, e)}
                  disabled={toggling === selected._id}
                  className="w-full mt-2 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-50"
                  style={selected.active
                    ? { background:"#fee2e2", color:"#dc2626" }
                    : { background:"#dcfce7", color:"#16a34a" }}>
                  {toggling === selected._id
                    ? "Updating…"
                    : selected.active ? "Deactivate User" : "Activate User"}
                </button>
              </div>
            ) : (
              <div className="p-5 space-y-3">
                {editError && (
                  <p className="text-xs text-center py-1 px-3 rounded-xl" style={{ background:"#fee2e2", color:"#dc2626" }}>
                    {editError}
                  </p>
                )}
                {[
                  { key:"name",          label:"Full Name",    type:"text"  },
                  { key:"email",         label:"Email",        type:"email" },
                  { key:"contactNumber", label:"Phone",        type:"tel"   },
                ].map(({ key, label, type }) => (
                  <div key={key}>
                    <label style={{ color:"#7a5c4a" }} className="text-xs font-semibold block mb-1">{label}</label>
                    <input
                      type={type}
                      value={editForm[key]}
                      onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full text-sm rounded-xl border px-3 py-2 outline-none"
                      style={{ borderColor:"#e8d5c4", color:"#3a2416" }} />
                  </div>
                ))}
                {/* Role select */}
                <div>
                  <label style={{ color:"#7a5c4a" }} className="text-xs font-semibold block mb-1">Role</label>
                  <select value={editForm.role}
                    onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
                    className="w-full text-sm rounded-xl border px-3 py-2 outline-none cursor-pointer"
                    style={{ borderColor:"#e8d5c4", color:"#3a2416" }}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-1">
                  <button onClick={() => setEditing(false)}
                    className="flex-1 py-2 rounded-full border text-sm font-semibold"
                    style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                    Cancel
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    className="flex-1 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-60"
                    style={{ background:"#c97d5b" }}>
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border flex flex-col items-center justify-center py-16 text-center"
            style={{ borderColor:"#e8d5c4" }}>
            <span className="text-4xl mb-3">👤</span>
            <p style={{ color:"#4a3728" }} className="font-semibold">Select a user</p>
            <p style={{ color:"#9c7a62" }} className="text-sm mt-1">to view profile & manage account</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ANALYTICS TAB
// ══════════════════════════════════════════════════════════════════════════════

function AnalyticsTab() {
  const [sortBy,  setSortBy]  = useState("revenue");
  const [sortDir, setSortDir] = useState("desc");
  const [filter,  setFilter]  = useState("All");
  const [summary, setSummary] = useState(null);
  const [revByProd, setRevByProd] = useState([]);
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);

  // Parallel: analytics summary + products table
  useEffect(() => {
    Promise.all([
      authFetch(`${CUST_BASE}/api/admin/analytics/products`).then(r => r.json()).catch(() => null),
      fetch(`${CUST_BASE}/api/products`).then(r => r.json()).catch(() => null),
    ]).then(([analytics, prods]) => {
      if (analytics?.summary) {
        setSummary(analytics.summary);
        setRevByProd(analytics.revenueByProduct ?? []);
      }
      if (prods) {
        const list = Array.isArray(prods) ? prods : (prods.data ?? prods.products ?? []);
        setProducts(list);
        // If no dedicated analytics endpoint, derive summary from products
        if (!analytics?.summary) {
          setSummary({
            totalProducts: list.length,
            totalRevenue:  list.reduce((s, p) => s + (p.revenue ?? 0), 0),
            unitsSold:     list.reduce((s, p) => s + (p.totalSold ?? 0), 0),
            avgRating:     null,
          });
        }
      }
      setLoading(false);
    });
  }, []);

  // category may be a populated object { _id, name, ... } or a plain string
  const getCat = p => (typeof p.category === "object" ? (p.category?.name ?? "") : (p.category ?? ""));

  const cats = ["All", ...new Set(products.map(p => getCat(p)).filter(Boolean))];

  // Products table sort — "totalSold" is the field name from /api/products
  const sorted = [...products]
    .filter(p => filter === "All" || getCat(p) === filter)
    .sort((a, b) => {
      const av = a[sortBy] ?? 0;
      const bv = b[sortBy] ?? 0;
      return sortDir === "desc" ? bv - av : av - bv;
    });

  function toggleSort(k) {
    if (sortBy === k) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(k); setSortDir("desc"); }
  }

  const sortIcon = (k) => sortBy === k
    ? sortDir === "desc" ? <ChevronDown size={13}/> : <ChevronUp size={13}/>
    : <ChevronDown size={13} className="opacity-30"/>;

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 rounded-full animate-spin"
          style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Product Analytics</h2>
        <p style={{ color:"#9c7a62" }} className="text-sm">Top selling products & performance metrics</p>
      </div>

      {/* Summary Cards — from summary.* */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Products", value: summary?.totalProducts ?? products.length,                    unit:"",  color:"#c97d5b" },
          { label:"Total Revenue",  value: fmtK(summary?.totalRevenue ?? 0),                             unit:"",  color:"#8b5cf6" },
          { label:"Units Sold",     value: (summary?.unitsSold ?? 0).toLocaleString(),                   unit:"",  color:"#06b6d4" },
          { label:"Avg Rating",     value: summary?.avgRating != null ? Number(summary.avgRating).toFixed(1) : "—", unit:"★", color:"#f59e0b" },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border" style={{ borderColor:"#e8d5c4" }}>
            <p style={{ color, fontFamily:"Georgia, serif" }} className="text-3xl font-bold">{value}{unit}</p>
            <p style={{ color:"#9c7a62" }} className="text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Share — from revenueByProduct[].{name, revenue, percentage} */}
      {revByProd.length > 0 && (
        <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"#e8d5c4" }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold mb-5">Revenue Share by Product</h3>
          <div className="space-y-3">
            {revByProd.slice(0, 5).map((p, i) => {
              const colors = ["#c97d5b","#8b5cf6","#06b6d4","#f59e0b","#22c55e"];
              return (
                <div key={p.productId?.toString() || String(i)}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i] }} />
                      <span style={{ color:"#4a3728" }} className="text-sm font-medium">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ color:"#9c7a62" }} className="text-xs">{p.percentage}%</span>
                      <span style={{ color:"#c97d5b" }} className="text-sm font-bold">{fmtK(p.revenue ?? 0)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background:"#f5ede5" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${p.percentage ?? 0}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Products Table — from /api/products with totalSold, revenue, trend(string) */}
      <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b"
          style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">All Products</h3>
          <div className="flex gap-2 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setFilter(c)}
                className="px-3 py-1 rounded-full text-xs font-semibold border transition-all"
                style={filter === c
                  ? { background:"#c97d5b", borderColor:"#c97d5b", color:"white" }
                  : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b text-xs font-bold uppercase tracking-wide"
          style={{ borderColor:"#f0e4d8", background:"#fafaf9", color:"#9c7a62" }}>
          <span>Product</span>
          <span>Price</span>
          <button onClick={() => toggleSort("totalSold")} className="flex items-center gap-1 hover:opacity-70">
            Sold {sortIcon("totalSold")}
          </button>
          <button onClick={() => toggleSort("revenue")} className="flex items-center gap-1 hover:opacity-70">
            Revenue {sortIcon("revenue")}
          </button>
          <button onClick={() => toggleSort("quantity")} className="flex items-center gap-1 hover:opacity-70">
            Stock {sortIcon("quantity")}
          </button>
          <span>Trend</span>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-12">
            <p style={{ color:"#9c7a62" }} className="text-sm">No products found</p>
          </div>
        ) : sorted.map((p, i) => {
          const pid    = p._id || p.id || i;
          const imgSrc = Array.isArray(p.images) ? p.images[0] : (p.image || p.img || null);
          // trend is "up" | "down" | "stable" string from backend
          const trendUp   = p.trend === "up";
          const trendDown = p.trend === "down";
          const qty = p.quantity ?? p.stock ?? null;
          return (
            <div key={pid}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b hover:bg-amber-50 transition-colors"
              style={{ borderColor:"#f0e4d8" }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                  {imgSrc
                    ? <img src={imgSrc} alt={p.name} className="w-10 h-10 object-cover rounded-xl" />
                    : <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background:"#f5ede5" }}>🌸</div>
                  }
                  <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                    style={{ background:"#4a3728", fontSize:"10px" }}>#{i+1}</span>
                </div>
                <div className="min-w-0">
                  <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{p.name}</p>
                  {getCat(p) && <span style={{ color:"#d4b5a0" }} className="text-xs">{getCat(p)}</span>}
                </div>
              </div>
              <p style={{ color:"#4a3728" }} className="text-sm font-medium">{fmt(p.price ?? 0)}</p>
              <p style={{ color:"#4a3728" }} className="text-sm font-medium">{(p.totalSold ?? 0).toLocaleString()}</p>
              <p style={{ color:"#c97d5b" }} className="text-sm font-bold">{fmtK(p.revenue ?? 0)}</p>
              <div>
                <p style={{ color: qty != null && qty < 10 ? "#dc2626" : "#4a3728" }} className="text-sm font-medium">
                  {qty ?? "—"}
                </p>
                {qty != null && qty < 10 && <p style={{ color:"#dc2626" }} className="text-xs">Low stock!</p>}
              </div>
              <div className="flex items-center gap-1 text-xs font-bold"
                style={{ color: trendUp ? "#16a34a" : trendDown ? "#dc2626" : "#9c7a62" }}>
                {trendUp ? <ArrowUpRight size={14}/> : trendDown ? <ArrowDownRight size={14}/> : <span>—</span>}
                {p.trend ?? "stable"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PRODUCTS TAB
// ══════════════════════════════════════════════════════════════════════════════

async function fetchAllProducts() {
  const r = await fetch("http://localhost:3001/api/products");
  if (!r.ok) throw new Error("Failed to fetch products");
  const json = await r.json();
  return Array.isArray(json) ? json : (json.data ?? json.products ?? []);
}

function ProductsTab({ onEdit }) {
  const [products,      setProducts]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [inputVal,      setInputVal]      = useState("");
  const [search,        setSearch]        = useState("");
  const [filterActive,  setFilterActive]  = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting,      setDeleting]      = useState(false);
  const [toggling,      setToggling]      = useState(null);
  const [view,          setView]          = useState("table");

  useEffect(() => {
    fetchAllProducts()
      .then(list => { setProducts(list); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSearch(inputVal), 300);
    return () => clearTimeout(t);
  }, [inputVal]);

  function refresh() {
    setLoading(true);
    setError(null);
    fetchAllProducts()
      .then(list => { setProducts(list); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }

  async function handleDelete(id) {
    setDeleting(true);
    try {
      const res = await fetch(`http://localhost:3001/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setProducts(prev => prev.filter(p => p._id !== id));
      setDeleteConfirm(null);
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  }

  async function handleToggleActive(p) {
    setToggling(p._id);
    try {
      const res = await fetch(`http://localhost:3001/api/products/${p._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !p.active }),
      });
      if (!res.ok) throw new Error("Update failed");
      setProducts(prev => prev.map(prod => prod._id === p._id ? { ...prod, active: !prod.active } : prod));
    } catch (e) {
      alert(e.message);
    } finally {
      setToggling(null);
    }
  }

  const filtered = products
    .filter(p => filterActive === "all" ? true : filterActive === "active" ? p.active : !p.active)
    .filter(p => (p.name ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Products</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm">{products.length} total products</p>
        </div>
        <button onClick={() => onEdit(null)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold text-white"
          style={{ background:"#c97d5b" }}>
          <Plus size={15}/> Add Product
        </button>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }} />
            <input value={inputVal} onChange={e => setInputVal(e.target.value)}
              placeholder="Search products..."
              className="pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none w-48"
              style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }} />
          </div>
          {["all","active","inactive"].map(f => (
            <button key={f} onClick={() => setFilterActive(f)}
              className="px-3 py-2 rounded-full text-xs font-semibold border capitalize transition-all"
              style={filterActive === f
                ? { background:"#c97d5b", borderColor:"#c97d5b", color:"white" }
                : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              {f}
            </button>
          ))}
          {/* View toggle */}
          <div className="flex rounded-full border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
            <button onClick={() => setView("grid")}
              className="px-3 py-2 transition-all"
              style={view === "grid" ? { background:"#c97d5b", color:"white" } : { background:"white", color:"#7a5c4a" }}>
              <LayoutGrid size={14}/>
            </button>
            <button onClick={() => setView("table")}
              className="px-3 py-2 transition-all"
              style={view === "table" ? { background:"#c97d5b", color:"white" } : { background:"white", color:"#7a5c4a" }}>
              <List size={14}/>
            </button>
          </div>
          <button onClick={refresh} className="p-2.5 rounded-full border hover:opacity-70"
            style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
            <RefreshCw size={14}/>
          </button>
        </div>
      </div>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor:"#e8d5c4", borderTopColor:"#c97d5b" }}/>
        </div>
      )}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <p style={{ color:"#dc2626" }} className="font-semibold">{error}</p>
          <button onClick={refresh} className="px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background:"#f5ede5", color:"#c97d5b" }}>Retry</button>
        </div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-3">🌸</span>
          <p style={{ color:"#4a3728" }} className="font-semibold">No products found</p>
          <p style={{ color:"#9c7a62" }} className="text-sm mt-1">Try a different filter or add a new product</p>
        </div>
      )}

      {/* Grid View */}
      {!loading && !error && filtered.length > 0 && view === "grid" && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => {
            const img = Array.isArray(p.images) ? p.images[0] : null;
            const isToggling = toggling === p._id;
            return (
              <div key={p._id} className="bg-white rounded-3xl border overflow-hidden flex flex-col"
                style={{ borderColor:"#e8d5c4" }}>
                <div className="relative h-44 bg-gray-100 overflow-hidden shrink-0">
                  {img
                    ? <img src={img} alt={p.name} className="w-full h-full object-cover"/>
                    : <div className="w-full h-full flex items-center justify-center text-4xl">🌸</div>
                  }
                  <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ background: p.active ? "#dcfce7" : "#fee2e2", color: p.active ? "#16a34a" : "#dc2626" }}>
                    {p.active ? "Active" : "Inactive"}
                  </span>
                  {p.badge && (
                    <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full"
                      style={{ background:"#fef9c3", color:"#92400e" }}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div>
                    <p style={{ color:"#3a2416", fontFamily:"Georgia, serif" }} className="font-bold text-base leading-tight">{p.name}</p>
                    <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5 truncate">{p.category?.name ?? p.category ?? "—"}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }} className="font-bold text-lg">₹{p.price?.toLocaleString("en-IN")}</p>
                    <div className="text-right">
                      <p style={{ color: p.quantity < 10 ? "#dc2626" : "#4a3728" }} className="text-sm font-semibold">{p.quantity} in stock</p>
                      {p.quantity < 10 && <p style={{ color:"#dc2626" }} className="text-xs">Low stock</p>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto pt-1">
                    <button onClick={() => handleToggleActive(p)} disabled={isToggling}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80 disabled:opacity-50"
                      style={p.active
                        ? { borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }
                        : { borderColor:"#86efac", color:"#16a34a", background:"#f0fdf4" }}>
                      {isToggling
                        ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                        : p.active ? <ToggleRight size={14}/> : <ToggleLeft size={14}/>
                      }
                      {p.active ? "Deactivate" : "Activate"}
                    </button>
                    <button onClick={() => onEdit(p)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all hover:opacity-80"
                      style={{ borderColor:"#e8d5c4", color:"#5c4033", background:"#fdf8f3" }}>
                      <Edit2 size={13}/> Edit
                    </button>
                    <button onClick={() => setDeleteConfirm(p)}
                      className="ml-auto p-2 rounded-full border transition-all hover:opacity-80"
                      style={{ borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }}>
                      <Trash2 size={14}/>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {!loading && !error && filtered.length > 0 && view === "table" && (
        <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
          {/* Header row */}
          <div className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b text-xs font-bold uppercase tracking-wide"
            style={{ borderColor:"#f0e4d8", background:"#fdf8f3", color:"#9c7a62" }}>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {filtered.map(p => {
            const img = Array.isArray(p.images) ? p.images[0] : null;
            const isToggling = toggling === p._id;
            return (
              <div key={p._id}
                className="grid grid-cols-[2.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 items-center border-b"
                style={{ borderColor:"#f0e4d8" }}
                onMouseEnter={e => e.currentTarget.style.background="#fdf8f3"}
                onMouseLeave={e => e.currentTarget.style.background="white"}>
                {/* Product */}
                <div className="flex items-center gap-3 min-w-0">
                  {img
                    ? <img src={img} alt={p.name} className="w-10 h-10 object-cover rounded-xl shrink-0"/>
                    : <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg" style={{ background:"#f5ede5" }}>🌸</div>
                  }
                  <div className="min-w-0">
                    <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{p.name}</p>
                    {p.badge && <span className="text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ background:"#fef9c3", color:"#92400e" }}>{p.badge}</span>}
                  </div>
                </div>
                {/* Category */}
                <p style={{ color:"#9c7a62" }} className="text-xs truncate">{p.category?.name ?? p.category ?? "—"}</p>
                {/* Price */}
                <p style={{ color:"#c97d5b" }} className="text-sm font-bold">₹{p.price?.toLocaleString("en-IN")}</p>
                {/* Stock */}
                <div>
                  <p style={{ color: p.quantity < 10 ? "#dc2626" : "#4a3728" }} className="text-sm font-semibold">{p.quantity}</p>
                  {p.quantity < 10 && <p style={{ color:"#dc2626" }} className="text-xs">Low</p>}
                </div>
                {/* Status */}
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full w-fit"
                  style={{ background: p.active ? "#dcfce7" : "#fee2e2", color: p.active ? "#16a34a" : "#dc2626" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.active ? "#16a34a" : "#dc2626" }}/>
                  {p.active ? "Active" : "Inactive"}
                </span>
                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handleToggleActive(p)} disabled={isToggling}
                    className="p-1.5 rounded-lg border transition-all hover:opacity-80 disabled:opacity-50"
                    title={p.active ? "Deactivate" : "Activate"}
                    style={p.active
                      ? { borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }
                      : { borderColor:"#86efac", color:"#16a34a", background:"#f0fdf4" }}>
                    {isToggling
                      ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                      : p.active ? <ToggleRight size={13}/> : <ToggleLeft size={13}/>
                    }
                  </button>
                  <button onClick={() => onEdit(p)}
                    className="p-1.5 rounded-lg border transition-all hover:opacity-80"
                    title="Edit"
                    style={{ borderColor:"#e8d5c4", color:"#5c4033", background:"#fdf8f3" }}>
                    <Edit2 size={13}/>
                  </button>
                  <button onClick={() => setDeleteConfirm(p)}
                    className="p-1.5 rounded-lg border transition-all hover:opacity-80"
                    title="Delete"
                    style={{ borderColor:"#fca5a5", color:"#dc2626", background:"#fff1f2" }}>
                    <Trash2 size={13}/>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-4">
            <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Delete Product?</p>
            <p style={{ color:"#9c7a62" }} className="text-sm">
              Are you sure you want to delete <strong style={{ color:"#3a2416" }}>{deleteConfirm.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-full border font-semibold text-sm"
                style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm._id)} disabled={deleting}
                className="flex-1 py-2.5 rounded-full font-semibold text-sm text-white disabled:opacity-60"
                style={{ background:"#dc2626" }}>
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS TAB
// ══════════════════════════════════════════════════════════════════════════════

const ORDER_BASE = "http://localhost:3001";

const ORDER_STATUSES = ["pending","confirmed","processing","shipped","delivered","cancelled"];

const ORDER_STATUS_CFG = {
  pending:    { bg:"#dbeafe", color:"#2563eb", label:"Pending",    dot:"#2563eb" },
  confirmed:  { bg:"#e0f2fe", color:"#0284c7", label:"Confirmed",  dot:"#0284c7" },
  processing: { bg:"#fef3c7", color:"#d97706", label:"Processing", dot:"#d97706" },
  shipped:    { bg:"#fef9c3", color:"#ca8a04", label:"Shipped",    dot:"#ca8a04" },
  delivered:  { bg:"#dcfce7", color:"#16a34a", label:"Delivered",  dot:"#16a34a" },
  cancelled:  { bg:"#fee2e2", color:"#dc2626", label:"Cancelled",  dot:"#dc2626" },
};

// Status flow — which transitions are valid from each state
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

function AdminOrdersTab() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState("all");
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState(null);  // order _id that is expanded
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    authFetch(`${ORDER_BASE}/api/admin/orders`)
      .then(r => r.json())
      .then(data => { setOrders(data.data || data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function updateStatus(orderId, status) {
    setUpdating(orderId);
    try {
      const res  = await authFetch(`${ORDER_BASE}/api/admin/orders/${orderId}/status`, {
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
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold">Orders</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm mt-0.5">{orders.length} total · {fmtK(totalRevenue)} revenue</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search ID, name, phone…"
            className="pl-9 pr-4 py-2 rounded-full border text-sm outline-none w-64"
            style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }} />
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-7 gap-3 mb-6">
        {[
          { key:"all",        label:"Total",      value:counts.all,        color:"#c97d5b", bg:"#fdf8f3" },
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
              borderColor: filter === key ? color : "#e8d5c4",
            }}>
            <p className="text-xl font-bold" style={{ color, fontFamily:"Georgia, serif" }}>{value}</p>
            <p className="text-xs mt-0.5" style={{ color: filter === key ? color : "#9c7a62" }}>{label}</p>
          </button>
        ))}
      </div>

      {/* ── Orders List ── */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl block mb-3">📦</span>
          <p style={{ color:"#9c7a62" }}>No orders found</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>

          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.7fr_0.8fr_1fr_auto] gap-3 px-5 py-3 text-xs font-bold uppercase tracking-wide"
            style={{ background:"#fdf8f3", color:"#9c7a62", borderBottom:"1px solid #f0e4d8" }}>
            <span>Order</span>
            <span>Customer</span>
            <span>Items</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

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
              <div key={order._id} style={{ borderColor:"#f0e4d8" }}
                className={idx < filtered.length - 1 || isExp ? "border-b" : ""}>

                {/* ── Row ── */}
                <div
                  className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1.2fr_0.7fr_0.8fr_1fr_auto] gap-3 px-5 py-4 items-center cursor-pointer hover:bg-amber-50/30 transition-colors"
                  onClick={() => setExpanded(isExp ? null : order._id)}>

                  {/* Order ID + Date */}
                  <div>
                    <p style={{ color:"#3a2416" }} className="text-sm font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{date}</p>
                  </div>

                  {/* Customer */}
                  <div className="hidden sm:block min-w-0">
                    <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">
                      {addr.name || order.user?.name || "—"}
                    </p>
                    {addr.phone && (
                      <p style={{ color:"#7a5c4a" }} className="text-xs truncate">📞 {addr.phone}</p>
                    )}
                    <p style={{ color:"#9c7a62" }} className="text-xs truncate">
                      {[addr.city, addr.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>

                  {/* Items count */}
                  <div className="hidden sm:block">
                    <p style={{ color:"#4a3728" }} className="text-sm">{order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}</p>
                  </div>

                  {/* Amount */}
                  <p className="hidden sm:block font-bold text-sm" style={{ color:"#c97d5b" }}>
                    {fmt(total)}
                  </p>

                  {/* Status badge — desktop only */}
                  <div className="hidden sm:block">
                    <OrderStatusBadge status={st} />
                  </div>

                  {/* Actions column — mobile shows badge+chevron, desktop shows only chevron */}
                  <div className="flex items-center gap-2">
                    <span className="sm:hidden"><OrderStatusBadge status={st} /></span>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background:"#f5ede5" }}>
                      {isExp
                        ? <ChevronUp size={14} style={{ color:"#c97d5b" }} />
                        : <ChevronDown size={14} style={{ color:"#c97d5b" }} />}
                    </div>
                  </div>
                </div>

                {/* ── Expanded Detail ── */}
                {isExp && (
                  <div className="border-t px-5 pb-6 pt-5" style={{ borderColor:"#f0e4d8", background:"#fdfaf7" }}>
                    <div className="grid md:grid-cols-2 gap-6">

                      {/* LEFT: Items + Address */}
                      <div className="space-y-5">

                        {/* Items */}
                        <div>
                          <p style={{ color:"#4a3728" }} className="text-xs font-bold uppercase tracking-wide mb-3">Order Items</p>
                          <div className="space-y-3">
                            {(order.items || []).map((item, i) => {
                              const p    = item.product;
                              const name = p?.name  || "Product";
                              const img  = p?.images?.[0] || null;
                              const price= p?.price  || 0;
                              return (
                                <div key={i} className="flex gap-3 items-center p-3 rounded-xl border"
                                  style={{ borderColor:"#e8d5c4", background:"white" }}>
                                  {img
                                    ? <img src={img} alt={name} className="w-12 h-12 object-cover rounded-lg shrink-0"/>
                                    : <div className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-xl"
                                        style={{ background:"#f5ede5" }}>🌸</div>
                                  }
                                  <div className="flex-1 min-w-0">
                                    <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{name}</p>
                                    <div className="flex gap-2 mt-0.5 flex-wrap">
                                      {item.size && <span style={{ background:"#f5ede5", color:"#9c7a62" }} className="text-xs px-2 py-0.5 rounded-full">{item.size}</span>}
                                      {item.color?.length > 0 && <span style={{ background:"#f5ede5", color:"#9c7a62" }} className="text-xs px-2 py-0.5 rounded-full">{item.color.join(", ")}</span>}
                                    </div>
                                    <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">Qty: {item.quantity}</p>
                                  </div>
                                  {price > 0 && (
                                    <p style={{ color:"#c97d5b" }} className="text-sm font-bold shrink-0">{fmt(price * item.quantity)}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="p-4 rounded-xl border" style={{ borderColor:"#e8d5c4", background:"white" }}>
                          <p style={{ color:"#4a3728" }} className="text-xs font-bold uppercase tracking-wide mb-2">Delivery Address</p>
                          <p style={{ color:"#3a2416" }} className="text-sm font-semibold">{addr.name}</p>
                          <p style={{ color:"#7a5c4a" }} className="text-sm">{addr.street}</p>
                          <p style={{ color:"#7a5c4a" }} className="text-sm">{[addr.city, addr.state, addr.pincode || addr.zipCode].filter(Boolean).join(", ")}</p>
                          {addr.phone && <p style={{ color:"#9c7a62" }} className="text-xs mt-1">📞 {addr.phone}</p>}
                        </div>
                      </div>

                      {/* RIGHT: Status + Payment */}
                      <div className="space-y-5">

                        {/* Status Pipeline */}
                        <div className="p-4 rounded-xl border" style={{ borderColor:"#e8d5c4", background:"white" }}>
                          <p style={{ color:"#4a3728" }} className="text-xs font-bold uppercase tracking-wide mb-4">Order Status Pipeline</p>
                          <div className="flex flex-col gap-2">
                            {ORDER_STATUSES.filter(s => s !== "cancelled").map((s, i) => {
                              const past    = ORDER_STATUSES.indexOf(st) > i && st !== "cancelled";
                              const current = st === s;
                              const scfg    = ORDER_STATUS_CFG[s];
                              return (
                                <div key={s} className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                                    style={{
                                      background: current ? scfg.color : past ? "#22c55e" : "#e8d5c4",
                                      color: (current || past) ? "white" : "#9c7a62",
                                    }}>
                                    {past ? "✓" : i + 1}
                                  </div>
                                  <span className="text-sm font-medium capitalize"
                                    style={{ color: current ? scfg.color : past ? "#16a34a" : "#9c7a62" }}>
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

                        {/* Order Info + Actions */}
                        <div className="p-4 rounded-xl border space-y-3" style={{ borderColor:"#e8d5c4", background:"white" }}>
                          <p style={{ color:"#4a3728" }} className="text-xs font-bold uppercase tracking-wide">Order Info</p>

                          <div className="space-y-2 text-sm">
                            {[
                              ["Order ID",       `#${order._id.slice(-8).toUpperCase()}`],
                              ["Total Amount",   fmt(total)],
                              ["Payment Status", order.paymentStatus || "—"],
                              ["Items",          `${order.items?.length || 0} item(s)`],
                            ].map(([k, v]) => (
                              <div key={k} className="flex justify-between">
                                <span style={{ color:"#9c7a62" }}>{k}</span>
                                <span style={{ color:"#4a3728" }} className="font-semibold">{v}</span>
                              </div>
                            ))}
                          </div>

                          {/* Next Status Actions */}
                          {nextStatuses.length > 0 && (
                            <div className="pt-3 border-t" style={{ borderColor:"#f0e4d8" }}>
                              <p style={{ color:"#4a3728" }} className="text-xs font-bold mb-2">Move to Next Status</p>
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

                          {/* Manual override */}
                          <div className="pt-3 border-t" style={{ borderColor:"#f0e4d8" }}>
                            <p style={{ color:"#9c7a62" }} className="text-xs mb-2">Manual Override</p>
                            <select
                              value={order.status}
                              disabled={updating === order._id}
                              onChange={e => updateStatus(order._id, e.target.value)}
                              className="w-full text-sm rounded-xl border px-3 py-2 outline-none cursor-pointer"
                              style={{ borderColor:"#e8d5c4", color:"#4a3728", background:"white" }}>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN LAYOUT (SIDEBAR + MAIN)
// ══════════════════════════════════════════════════════════════════════════════

const NAV = [
  { id:"dashboard",  icon:<LayoutDashboard size={18}/>, label:"Dashboard"  },
  { id:"customers",  icon:<Users size={18}/>,           label:"Customers"  },
  { id:"analytics",  icon:<BarChart2 size={18}/>,       label:"Analytics"  },
  { id:"orders",     icon:<Package size={18}/>,         label:"Orders"     },
  { id:"products",      icon:<Eye size={18}/>,          label:"Products"      },
];

export default function AdminPanel() {
  const [tab,            setTab]            = useState("dashboard");
  const [sidebarOpen,    setSidebarOpen]    = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const payload   = getTokenPayload();
  const adminName = payload?.name || payload?.email || "Admin";
  const adminInitial = adminName.charAt(0).toUpperCase();

  function handleEdit(product) {
    setEditingProduct(product);
    setTab("add-product");
  }

  function handleEditSuccess() {
    setEditingProduct(null);
    setTab("products");
  }

  const PAGES = {
    dashboard:     <Dashboard />,
    customers:     <CustomersTab />,
    analytics:     <AnalyticsTab />,
    orders:        <AdminOrdersTab />,
    products:      <ProductsTab onEdit={handleEdit} />,
    "add-product": <AddProductForm key={editingProduct?._id ?? "new"} initialData={editingProduct} onSuccess={handleEditSuccess} />,
  };

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"#fdf8f3", minHeight:"100vh" }} className="flex">

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className="fixed top-0 left-0 h-full z-40 flex flex-col transition-transform duration-300 lg:translate-x-0"
        style={{
          width:"220px",
          background:"#3a2416",
          transform: sidebarOpen ? "translateX(0)" : undefined,
        }}
        // on mobile hidden unless open
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor:"#4a3728" }}>
         
      <img src={FloralLogo} alt="Floral Studio" style={{
              width:"3rem",borderRadius:"50%",border:"2px solid #3a2416"
            }} />
          <div>
            <p style={{ fontFamily:"Georgia, serif", color:"#f5e6d3" }} className="font-bold leading-none">Floral Studio</p>
            <p style={{ color:"#9c7a62" }} className="text-xs">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV.map(({ id, icon, label }) => (
            <button key={id} onClick={() => { setTab(id); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all text-left"
              style={{
                color:      tab === id ? "#f5e6d3" : "#9c7a62",
                background: tab === id ? "rgba(201,125,91,0.2)" : "transparent",
                borderLeft: tab === id ? "3px solid #c97d5b"   : "3px solid transparent",
              }}>
              <span style={{ color: tab === id ? "#c97d5b" : "#7a5c4a" }}>{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t" style={{ borderColor:"#4a3728" }}>
          <div className="flex items-center gap-2 mb-3">
            <div style={{ background:"#c97d5b" }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">{adminInitial}</div>
            <div className="min-w-0">
              <p style={{ color:"#f5e6d3" }} className="text-xs font-semibold truncate">{adminName}</p>
              <p style={{ color:"#7a5c4a" }} className="text-xs">Admin</p>
            </div>
          </div>
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium hover:opacity-70"
            style={{ color:"#9c7a62" }}>
            <LogOut size={14}/> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col min-h-screen" style={{ marginLeft:"220px" }}>

        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b"
          style={{ background:"white", borderColor:"#e8d5c4" }}>
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="lg:hidden p-1.5 rounded-lg hover:opacity-70"
              style={{ color:"#5c4033" }}>
              <Menu size={20}/>
            </button>
            <div>
              <h1 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold capitalize">
                {tab === "dashboard" ? `Good Morning, ${adminName.split(" ")[0]} 🌸` : NAV.find(n => n.id === tab)?.label}
              </h1>
              <p style={{ color:"#9c7a62" }} className="text-xs">
                {new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:opacity-70" style={{ color:"#5c4033" }}>
              <Bell size={18}/>
              <span style={{ background:"#dc2626" }} className="absolute top-1 right-1 w-2 h-2 rounded-full" />
            </button>
            <a href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{ background:"#f5ede5", color:"#c97d5b" }}>
              <Home size={13}/> View Store
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {PAGES[tab]}
        </main>
      </div>
    </div>
  );
}
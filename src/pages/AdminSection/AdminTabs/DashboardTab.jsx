import { useState, useEffect, useRef } from "react";
import { authFetch } from "../../../utils/auth";
import {
  IndianRupee, ShoppingBag, Users, TrendingUp,
  ChevronRight, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { BASE, fmt, fmtK } from "./shared";

function BarChart({ data, labels, color = "var(--color-olive)" }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-24 w-full">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
            style={{ height:`${(v / max) * 96}px`, background: color, opacity: i === data.length - 1 ? 1 : 0.5 }} />
          {labels && <span className="text-xs" style={{ color:"var(--color-olive)" }}>{labels[i]}</span>}
        </div>
      ))}
    </div>
  );
}

const DASH_STATUS_COLORS = {
  delivered:    { bg:"#dcfce7", color:"#16a34a" },
  "in transit": { bg:"#fef9c3", color:"#ca8a04" },
  confirmed:    { bg:"#dbeafe", color:"#2563eb" },
  processing:   { bg:"#dbeafe", color:"#2563eb" },
  cancelled:    { bg:"#fee2e2", color:"#dc2626" },
  pending:      { bg:"var(--color-beige)", color:"var(--color-olive)" },
};

export default function Dashboard() {
  const [period,      setPeriod]      = useState("daily");
  const [kpi,         setKpi]         = useState(null);
  const [dash,        setDash]        = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [dashLoading, setDashLoading] = useState(false);
  const periodChanged = useRef(false);

  useEffect(() => {
    Promise.all([
      authFetch(`${BASE}/api/admin/analytics/kpi`).then(r => r.json()).catch(() => null),
      authFetch(`${BASE}/api/admin/analytics/dashboard?period=daily`).then(r => r.json()).catch(() => null),
    ]).then(([k, d]) => {
      setKpi(k);
      setDash(d);
      setInitialLoad(false);
      periodChanged.current = true;
    });
  }, []);

  useEffect(() => {
    if (!periodChanged.current) return;
    authFetch(`${BASE}/api/admin/analytics/dashboard?period=${period}`)
      .then(r => r.json())
      .then(data => { setDash(data); setDashLoading(false); })
      .catch(() => setDashLoading(false));
  }, [period]);

  function changePeriod(p) { setDashLoading(true); setPeriod(p); }

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

  const ov = dash?.overview;
  const stats = ov ? [
    { label:"Total Revenue",   value: fmtK(ov.totalRevenue?.value ?? 0),             change: ov.totalRevenue?.change ?? 0,   icon:<IndianRupee size={20}/>, color:"var(--color-olive)" },
    { label:"Total Orders",    value: (ov.totalOrders?.value ?? 0).toLocaleString(),  change: ov.totalOrders?.change ?? 0,    icon:<ShoppingBag size={20}/>, color:"#8b5cf6" },
    { label:"New Customers",   value: (ov.newCustomers?.value ?? 0).toLocaleString(), change: ov.newCustomers?.change ?? 0,   icon:<Users size={20}/>,       color:"#06b6d4" },
    { label:"Avg Order Value", value: fmtK(ov.avgOrderValue?.value ?? 0),            change: ov.avgOrderValue?.change ?? 0,  icon:<TrendingUp size={20}/>,  color:"#f59e0b" },
  ] : [];

  const chartData   = dash?.revenueChart ?? [];
  const chartValues = chartData.map(d => d.revenue ?? 0);
  const chartLabels = chartData.map(d => d.day ?? "");
  const recentOrders = dash?.recentOrders ?? [];

  if (initialLoad) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-7 h-7 border-2 rounded-full animate-spin"
          style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div>
        <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-xl font-bold mb-4">
          Key Performance Indicators
        </h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {kpiCards.map(({ label, value, sub, pos }) => (
            <div key={label} className="rounded-2xl p-5" style={{ background:"#1e1410" }}>
              <p style={{ color:"var(--color-olive)" }} className="text-xs font-semibold uppercase tracking-wide mb-2">{label}</p>
              <p style={{ color:"white", fontFamily:"Georgia, serif" }} className="text-3xl font-bold mb-1">{value}</p>
              {sub && <p style={{ color: pos ? "#4ade80" : "#f87171" }} className="text-xs">{sub}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Period Toggle */}
      <div className="flex items-center justify-between">
        <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-xl font-bold">Overview</h2>
        <div className="flex gap-1 p-1 rounded-full" style={{ background:"var(--color-beige)" }}>
          {["daily","weekly","monthly"].map(p => (
            <button key={p} onClick={() => changePeriod(p)}
              className="px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
              style={period === p ? { background:"var(--color-olive)", color:"white" } : { color:"var(--color-olive)" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {dashLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor:"var(--color-olive)", borderTopColor:"transparent" }} />
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map(({ label, value, change, icon, color }) => {
              const up = change >= 0;
              return (
                <div key={label} className="bg-white rounded-2xl p-5 border" style={{ borderColor:"var(--color-border)" }}>
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
                  <p style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-2xl font-bold mb-0.5">{value}</p>
                  <p style={{ color:"var(--color-olive)" }} className="text-xs">{label}</p>
                </div>
              );
            })}
          </div>

          {/* Revenue Bar Chart */}
          {chartValues.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"var(--color-border)" }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">Revenue Chart</h3>
                  <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">
                    {period === "daily" ? "Last 7 days" : period === "weekly" ? "Last 7 weeks" : "Last 12 months"}
                  </p>
                </div>
                <p style={{ color:"var(--color-olive)", fontFamily:"Georgia, serif" }} className="text-2xl font-bold">
                  {fmtK(ov?.totalRevenue?.value ?? 0)}
                </p>
              </div>
              <BarChart data={chartValues} labels={chartLabels} />
            </div>
          )}

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
              <div className="flex items-center justify-between px-6 py-4 border-b"
                style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
                <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">Recent Orders</h3>
                <button style={{ color:"var(--color-olive)" }} className="text-sm font-semibold flex items-center gap-1 hover:opacity-70">
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
                      onMouseEnter={e => e.currentTarget.style.background="var(--color-beige)"}
                      onMouseLeave={e => e.currentTarget.style.background="white"}>
                      {imgSrc
                        ? <img src={imgSrc} alt={product} className="w-10 h-10 object-cover rounded-xl shrink-0" />
                        : <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-lg"
                            style={{ background:"var(--color-beige)" }}>⌨</div>
                      }
                      <div className="flex-1 min-w-0">
                        <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-semibold truncate">{product}</p>
                        <p style={{ color:"var(--color-olive)" }} className="text-xs">{customer}</p>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full capitalize"
                        style={{ background: sc.bg, color: sc.color }}>
                        {statusLabel}
                      </span>
                      <p style={{ color:"var(--color-olive)" }} className="font-bold text-sm shrink-0">{fmt(amount)}</p>
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

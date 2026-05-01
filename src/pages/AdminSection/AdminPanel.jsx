import { useState, useEffect } from "react";
import { authFetch } from "../../utils/auth";
import {
  LayoutDashboard, Users, BarChart2, Package,
  TrendingUp, ShoppingBag, IndianRupee,
  Bell, Search, Menu, X, ChevronRight, Eye, Star,
  ArrowUpRight, ArrowDownRight, Download,
  ChevronUp, ChevronDown, LogOut, Home, Edit2, Trash2, ToggleLeft, ToggleRight,
  RefreshCw, LayoutGrid, List,
} from "lucide-react";
 import FloralLogo from "../../assets/floral-logo.png";
import { Plus } from "lucide-react";
import AddProductForm from "./AddProductForm";
// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const REVENUE = {
  daily:   { value:12480,  change:+8.2,  chart:[4200,5100,3800,6200,7100,5800,12480] },
  weekly:  { value:68900,  change:+12.4, chart:[9200,11400,8700,13200,14100,11800,10500] },
  monthly: { value:284500, change:+18.7, chart:[42000,51000,38000,62000,71000,58000,79000,88000,72000,91000,95000,102000] },
};

const RECENT_ORDERS = [
  { id:"FS-0431", customer:"Priya Sharma",   item:"Rose Bliss Bouquet",        price:1299, status:"Delivered",  time:"2 min ago",  img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=100&q=80" },
  { id:"FS-0430", customer:"Rahul Verma",    item:"Pastel Dream Arrangement",  price:3798, status:"In Transit", time:"18 min ago", img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=100&q=80" },
  { id:"FS-0429", customer:"Ananya Singh",   item:"Wildflower Wreath",         price:999,  status:"Processing", time:"45 min ago", img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=100&q=80" },
  { id:"FS-0428", customer:"Vikram Mehta",   item:"Orchid Elegance Set",       price:2199, status:"Delivered",  time:"1 hr ago",   img:"https://images.unsplash.com/photo-1566873535350-96e04c74fb1a?w=100&q=80" },
  { id:"FS-0427", customer:"Sneha Gupta",    item:"Sunflower Garden Bundle",   price:1499, status:"Cancelled",  time:"2 hr ago",   img:"https://images.unsplash.com/photo-1543218024-57a70143c369?w=100&q=80" },
  { id:"FS-0426", customer:"Rohan Kapoor",   item:"Lavender & Eucalyptus",     price:849,  status:"Delivered",  time:"3 hr ago",   img:"https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=100&q=80" },
  { id:"FS-0425", customer:"Meena Joshi",    item:"Dahlia Delight Box",        price:1699, status:"In Transit", time:"4 hr ago",   img:"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=100&q=80" },
  { id:"FS-0424", customer:"Arjun Patel",    item:"Mixed Tulip Bunch",         price:749,  status:"Delivered",  time:"5 hr ago",   img:"https://images.unsplash.com/photo-1520763185298-1b434c919102?w=100&q=80" },
];

const CUSTOMERS = [
  { id:1, name:"Priya Sharma",  email:"priya@gmail.com",  phone:"+91 98765 43210", city:"Lucknow",   orders:12, totalSpent:18400, lastOrder:"28 Apr 2025", status:"Active",  avatar:"PS", history:[
    { id:"FS-0431", item:"Rose Bliss Bouquet",       price:1299, date:"28 Apr 2025", status:"Delivered"  },
    { id:"FS-0398", item:"Orchid Elegance Set",      price:2199, date:"10 Apr 2025", status:"Delivered"  },
    { id:"FS-0372", item:"Pastel Dream Arrangement", price:1899, date:"22 Mar 2025", status:"Delivered"  },
  ]},
  { id:2, name:"Rahul Verma",   email:"rahul@gmail.com",  phone:"+91 87654 32109", city:"Delhi",     orders:8,  totalSpent:11200, lastOrder:"15 Apr 2025", status:"Active",  avatar:"RV", history:[
    { id:"FS-0430", item:"Pastel Dream Arrangement", price:3798, date:"15 Apr 2025", status:"In Transit" },
    { id:"FS-0401", item:"Sunflower Bundle",         price:1499, date:"1 Apr 2025",  status:"Delivered"  },
  ]},
  { id:3, name:"Ananya Singh",  email:"ananya@gmail.com", phone:"+91 76543 21098", city:"Mumbai",    orders:15, totalSpent:24600, lastOrder:"28 Apr 2025", status:"Active",  avatar:"AS", history:[
    { id:"FS-0429", item:"Wildflower Wreath",        price:999,  date:"28 Apr 2025", status:"Processing" },
    { id:"FS-0411", item:"Lavender & Eucalyptus",    price:849,  date:"11 Apr 2025", status:"Delivered"  },
    { id:"FS-0385", item:"Mixed Tulip Bunch",        price:749,  date:"25 Mar 2025", status:"Delivered"  },
  ]},
  { id:4, name:"Vikram Mehta",  email:"vikram@gmail.com", phone:"+91 65432 10987", city:"Bengaluru", orders:5,  totalSpent:7800,  lastOrder:"20 Apr 2025", status:"Active",  avatar:"VM", history:[
    { id:"FS-0428", item:"Orchid Elegance Set",      price:2199, date:"20 Apr 2025", status:"Delivered"  },
  ]},
  { id:5, name:"Sneha Gupta",   email:"sneha@gmail.com",  phone:"+91 54321 09876", city:"Pune",      orders:3,  totalSpent:4200,  lastOrder:"5 Mar 2025",  status:"Inactive",avatar:"SG", history:[
    { id:"FS-0427", item:"Sunflower Garden Bundle",  price:1499, date:"5 Mar 2025",  status:"Cancelled"  },
  ]},
  { id:6, name:"Rohan Kapoor",  email:"rohan@gmail.com",  phone:"+91 43210 98765", city:"Jaipur",    orders:9,  totalSpent:13500, lastOrder:"28 Apr 2025", status:"Active",  avatar:"RK", history:[
    { id:"FS-0426", item:"Lavender & Eucalyptus",    price:849,  date:"28 Apr 2025", status:"Delivered"  },
    { id:"FS-0399", item:"Rose Bliss Bouquet",       price:1299, date:"9 Apr 2025",  status:"Delivered"  },
  ]},
];

const TOP_PRODUCTS = [
  { id:1, name:"Rose Bliss Bouquet",       category:"Bouquets",     price:1299, sold:284, revenue:368916, rating:4.8, stock:42, trend:+12.4, img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80" },
  { id:2, name:"Pastel Dream Arrangement", category:"Arrangements", price:1899, sold:198, revenue:376002, rating:4.9, stock:18, trend:+8.1,  img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=200&q=80" },
  { id:3, name:"Orchid Elegance Set",      category:"Arrangements", price:2199, sold:156, revenue:342444, rating:5.0, stock:9,  trend:+21.3, img:"https://images.unsplash.com/photo-1566873535350-96e04c74fb1a?w=200&q=80" },
  { id:4, name:"Sunflower Garden Bundle",  category:"Bouquets",     price:1499, sold:241, revenue:361259, rating:4.6, stock:31, trend:-3.2,  img:"https://images.unsplash.com/photo-1543218024-57a70143c369?w=200&q=80" },
  { id:5, name:"Wildflower Wreath",        category:"Wreaths",      price:999,  sold:189, revenue:188811, rating:4.7, stock:24, trend:+5.8,  img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=200&q=80" },
  { id:6, name:"Lavender & Eucalyptus",    category:"Dried",        price:849,  sold:167, revenue:141783, rating:4.9, stock:56, trend:+15.9, img:"https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=200&q=80" },
  { id:7, name:"Dahlia Delight Box",       category:"Bouquets",     price:1699, sold:134, revenue:227666, rating:4.8, stock:12, trend:+9.2,  img:"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&q=80" },
  { id:8, name:"Mixed Tulip Bunch",        category:"Bouquets",     price:749,  sold:312, revenue:233688, rating:4.5, stock:67, trend:+2.1,  img:"https://images.unsplash.com/photo-1520763185298-1b434c919102?w=200&q=80" },
];

const STATUS_CONFIG = {
  Delivered:    { bg:"#dcfce7", color:"#16a34a", dot:"#16a34a" },
  "In Transit": { bg:"#fef9c3", color:"#ca8a04", dot:"#ca8a04" },
  Processing:   { bg:"#dbeafe", color:"#2563eb", dot:"#2563eb" },
  Cancelled:    { bg:"#fee2e2", color:"#dc2626", dot:"#dc2626" },
};

const fmt   = n => "₹" + n.toLocaleString("en-IN");
const fmtK  = n => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(1)}K` : `₹${n}`;

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────

function Sparkline({ data, color }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const W = 80, H = 32;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function Badge({ status, small }) {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.Processing;
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full ${small ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"}`}
      style={{ background: s.bg, color: s.color }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

// ─── ORDER POPUP ──────────────────────────────────────────────────────────────

function OrderPopup({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Order Details</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:opacity-70" style={{ background:"#f5ede5" }}>
            <X size={16} style={{ color:"#5c4033" }} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex gap-3 items-center">
            <img src={order.img} alt={order.item} className="w-16 h-16 object-cover rounded-2xl" />
            <div>
              <p style={{ color:"#3a2416" }} className="font-bold">{order.item}</p>
              <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">Order {order.id}</p>
              <Badge status={order.status} />
            </div>
          </div>
          {[
            ["Customer",  order.customer],
            ["Amount",    fmt(order.price)],
            ["Ordered",   order.time],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-sm">
              <span style={{ color:"#9c7a62" }}>{k}</span>
              <span style={{ color:"#4a3728" }} className="font-semibold">{v}</span>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <button style={{ background:"#f5ede5", color:"#c97d5b" }}
              className="flex-1 py-2 rounded-full text-sm font-semibold hover:opacity-80">
              View Full Order
            </button>
            <button style={{ background:"#c97d5b" }}
              className="flex-1 py-2 rounded-full text-sm font-semibold text-white hover:opacity-90">
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD TAB
// ══════════════════════════════════════════════════════════════════════════════

function Dashboard() {
  const [period,   setPeriod]   = useState("daily");
  const [popup,    setPopup]    = useState(null);
  const [notif,    setNotif]    = useState(true);
  const rev = REVENUE[period];

  const STATS = [
    { label:"Total Revenue",  value:fmtK(rev.value),  change:rev.change,  icon:<IndianRupee size={20}/>, color:"#c97d5b", chart:rev.chart },
    { label:"Total Orders",   value:"1,284",           change:+6.4,        icon:<ShoppingBag size={20}/>, color:"#8b5cf6", chart:[80,110,90,130,140,120,160] },
    { label:"New Customers",  value:"348",             change:+14.2,       icon:<Users size={20}/>,       color:"#06b6d4", chart:[30,45,38,52,48,60,72] },
    { label:"Avg Order Value",value:"₹1,840",          change:-2.1,        icon:<TrendingUp size={20}/>,  color:"#f59e0b", chart:[1600,1750,1800,1720,1900,1820,1840] },
  ];

  return (
    <div className="space-y-6">
      {/* Popup */}
      {popup && <OrderPopup order={popup} onClose={() => setPopup(null)} />}

      {/* Notif Banner */}
      {notif && (
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background:"#fef9c3", border:"1px solid #fde68a" }}>
          <Bell size={16} style={{ color:"#ca8a04" }} className="shrink-0" />
          <p className="text-sm flex-1" style={{ color:"#92400e" }}>
            🌸 <strong>5 new orders</strong> received in the last hour. 2 orders need your attention.
          </p>
          <button onClick={() => setNotif(false)}><X size={14} style={{ color:"#92400e" }} /></button>
        </div>
      )}

      {/* Period Toggle */}
      <div className="flex items-center justify-between">
        <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Overview</h2>
        <div className="flex gap-1 p-1 rounded-full" style={{ background:"#f5ede5" }}>
          {["daily","weekly","monthly"].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
              style={period === p
                ? { background:"#c97d5b", color:"white" }
                : { color:"#9c7a62" }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, icon, color, chart }) => {
          const up = change >= 0;
          return (
            <div key={label} className="bg-white rounded-2xl p-5 border" style={{ borderColor:"#e8d5c4" }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background:`${color}18`, color }}>
                  {icon}
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full`}
                  style={{ background: up ? "#dcfce7" : "#fee2e2", color: up ? "#16a34a" : "#dc2626" }}>
                  {up ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                  {Math.abs(change)}%
                </div>
              </div>
              <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold mb-0.5">{value}</p>
              <p style={{ color:"#9c7a62" }} className="text-xs mb-3">{label}</p>
              <Sparkline data={chart} color={color} />
            </div>
          );
        })}
      </div>

      {/* Revenue Bar Chart */}
      <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"#e8d5c4" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Revenue Chart</h3>
            <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">
              {period === "daily" ? "Last 7 days" : period === "weekly" ? "Last 7 weeks" : "Last 12 months"}
            </p>
          </div>
          <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }} className="text-2xl font-bold">{fmtK(rev.value)}</p>
        </div>
        <BarChart
          data={rev.chart}
          labels={period === "daily"
            ? ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
            : period === "weekly"
              ? ["W1","W2","W3","W4","W5","W6","W7"]
              : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
          }
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Recent Orders</h3>
          <button style={{ color:"#c97d5b" }} className="text-sm font-semibold flex items-center gap-1 hover:opacity-70">
            View All <ChevronRight size={14}/>
          </button>
        </div>
        <div className="divide-y" style={{ "--tw-divide-opacity":1 }}>
          {RECENT_ORDERS.map(order => (
            <div key={order.id}
              onClick={() => setPopup(order)}
              className="flex items-center gap-4 px-6 py-4 hover:cursor-pointer transition-colors"
              style={{ background:"white" }}
              onMouseEnter={e => e.currentTarget.style.background="#fdf8f3"}
              onMouseLeave={e => e.currentTarget.style.background="white"}>
              <img src={order.img} alt={order.item} className="w-10 h-10 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{order.item}</p>
                <p style={{ color:"#9c7a62" }} className="text-xs">{order.customer} · {order.time}</p>
              </div>
              <Badge status={order.status} small />
              <p style={{ color:"#c97d5b" }} className="font-bold text-sm shrink-0">{fmt(order.price)}</p>
              <span style={{ color:"#9c7a62" }} className="text-xs shrink-0">{order.id}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label:"Orders Today",     value:"47",   sub:"↑ 8 from yesterday",   color:"#c97d5b" },
          { label:"Pending Delivery", value:"12",   sub:"Estimated by 9PM",      color:"#ca8a04" },
          { label:"Low Stock Items",  value:"3",    sub:"Action needed",          color:"#dc2626" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border flex items-center gap-4" style={{ borderColor:"#e8d5c4" }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl font-bold"
              style={{ background:`${color}15`, color }}>
              {value}
            </div>
            <div>
              <p style={{ color:"#3a2416" }} className="font-bold text-sm">{label}</p>
              <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// CUSTOMERS TAB
// ══════════════════════════════════════════════════════════════════════════════

function CustomersTab() {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState(null);
  const [sortBy,   setSortBy]   = useState("totalSpent");
  const [sortDir,  setSortDir]  = useState("desc");

  const filtered = CUSTOMERS
    .filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]);

  function toggleSort(key) {
    if (sortBy === key) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(key); setSortDir("desc"); }
  }

  const sortIcon = (k) => sortBy === k
    ? sortDir === "desc" ? <ChevronDown size={13}/> : <ChevronUp size={13}/>
    : <ChevronDown size={13} className="opacity-30"/>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Customers</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm">{CUSTOMERS.length} total customers</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search customers..."
              className="pl-9 pr-4 py-2.5 rounded-full border text-sm outline-none w-52"
              style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }} />
          </div>
          <button style={{ background:"#f5ede5", color:"#c97d5b" }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80">
            <Download size={14}/> Export
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-5 items-start">
        {/* Table */}
        <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b text-xs font-bold uppercase tracking-wide"
            style={{ borderColor:"#f0e4d8", background:"#fdf8f3", color:"#9c7a62" }}>
            <span>Customer</span>
            <button onClick={() => toggleSort("orders")} className="flex items-center gap-1 hover:opacity-70">
              Orders {sortIcon("orders")}
            </button>
            <button onClick={() => toggleSort("totalSpent")} className="flex items-center gap-1 hover:opacity-70">
              Spent {sortIcon("totalSpent")}
            </button>
            <span>Status</span>
            <span></span>
          </div>

          {/* Rows */}
          {filtered.map(c => (
            <div key={c.id}
              onClick={() => setSelected(selected?.id === c.id ? null : c)}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-5 py-4 items-center border-b cursor-pointer transition-colors"
              style={{
                borderColor:"#f0e4d8",
                background: selected?.id === c.id ? "#fdf8f3" : "white",
                borderLeft: selected?.id === c.id ? "3px solid #c97d5b" : "3px solid transparent",
              }}
              onMouseEnter={e => { if(selected?.id !== c.id) e.currentTarget.style.background="#fafaf9" }}
              onMouseLeave={e => { if(selected?.id !== c.id) e.currentTarget.style.background="white" }}>
              {/* Name */}
              <div className="flex items-center gap-3 min-w-0">
                <div style={{ background:"#c97d5b" }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {c.avatar}
                </div>
                <div className="min-w-0">
                  <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{c.name}</p>
                  <p style={{ color:"#9c7a62" }} className="text-xs truncate">{c.city}</p>
                </div>
              </div>
              <p style={{ color:"#4a3728" }} className="text-sm font-medium">{c.orders}</p>
              <p style={{ color:"#c97d5b" }} className="text-sm font-bold">{fmtK(c.totalSpent)}</p>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: c.status==="Active" ? "#dcfce7" : "#f5f5f4", color: c.status==="Active" ? "#16a34a" : "#9c7a62" }}>
                {c.status}
              </span>
              <ChevronRight size={14} style={{ color:"#9c7a62" }} />
            </div>
          ))}
        </div>

        {/* Customer Detail Panel */}
        {selected ? (
          <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
            <div className="p-5 border-b" style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
              <div className="flex items-center justify-between mb-4">
                <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold">Customer Profile</p>
                <button onClick={() => setSelected(null)} className="p-1 hover:opacity-70">
                  <X size={15} style={{ color:"#9c7a62" }} />
                </button>
              </div>
              <div className="text-center">
                <div style={{ background:"#c97d5b" }}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {selected.avatar}
                </div>
                <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">{selected.name}</p>
                <p style={{ color:"#9c7a62" }} className="text-xs">{selected.email}</p>
                <p style={{ color:"#9c7a62" }} className="text-xs">{selected.phone}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x p-0" style={{ borderBottom:"1px solid #f0e4d8" }}>
              {[
                ["Orders",    selected.orders],
                ["Spent",     fmtK(selected.totalSpent)],
                ["City",      selected.city],
              ].map(([k, v]) => (
                <div key={k} className="py-4 text-center">
                  <p style={{ color:"#c97d5b", fontFamily:"Georgia, serif" }} className="font-bold">{v}</p>
                  <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{k}</p>
                </div>
              ))}
            </div>

            {/* Order History */}
            <div className="p-5">
              <p style={{ color:"#4a3728" }} className="text-sm font-bold mb-3">Order History</p>
              <div className="space-y-3">
                {selected.history.map(o => (
                  <div key={o.id} className="p-3 rounded-2xl" style={{ background:"#fdf8f3", border:"1px solid #f0e4d8" }}>
                    <div className="flex items-center justify-between mb-1">
                      <p style={{ color:"#3a2416" }} className="text-xs font-bold">{o.id}</p>
                      <Badge status={o.status} small />
                    </div>
                    <p style={{ color:"#5c4033" }} className="text-xs truncate">{o.item}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <p style={{ color:"#9c7a62" }} className="text-xs">{o.date}</p>
                      <p style={{ color:"#c97d5b" }} className="text-xs font-bold">{fmt(o.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ color:"#9c7a62" }} className="text-xs text-center mt-3">
                Last order: {selected.lastOrder}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border flex flex-col items-center justify-center py-16 text-center"
            style={{ borderColor:"#e8d5c4" }}>
            <span className="text-4xl mb-3">👤</span>
            <p style={{ color:"#4a3728" }} className="font-semibold">Select a customer</p>
            <p style={{ color:"#9c7a62" }} className="text-sm mt-1">to view their profile & order history</p>
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
  const [sortBy,  setSortBy]  = useState("sold");
  const [sortDir, setSortDir] = useState("desc");
  const [filter,  setFilter]  = useState("All");

  const CATS = ["All", "Bouquets", "Arrangements", "Wreaths", "Dried"];

  const sorted = [...TOP_PRODUCTS]
    .filter(p => filter === "All" || p.category === filter)
    .sort((a, b) => sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy]);

  const totalRevenue = TOP_PRODUCTS.reduce((s, p) => s + p.revenue, 0);
  const totalSold    = TOP_PRODUCTS.reduce((s, p) => s + p.sold, 0);

  function toggleSort(k) {
    if (sortBy === k) setSortDir(d => d === "desc" ? "asc" : "desc");
    else { setSortBy(k); setSortDir("desc"); }
  }

  const sortIcon = (k) => sortBy === k
    ? sortDir === "desc" ? <ChevronDown size={13}/> : <ChevronUp size={13}/>
    : <ChevronDown size={13} className="opacity-30"/>;

  return (
    <div className="space-y-6">
      <div>
        <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Product Analytics</h2>
        <p style={{ color:"#9c7a62" }} className="text-sm">Top selling products & performance metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label:"Total Products",  value:TOP_PRODUCTS.length,     unit:"",   color:"#c97d5b" },
          { label:"Total Revenue",   value:fmtK(totalRevenue),      unit:"",   color:"#8b5cf6" },
          { label:"Units Sold",      value:totalSold.toLocaleString(),unit:"",  color:"#06b6d4" },
          { label:"Avg Rating",      value:"4.8",                   unit:"★",  color:"#f59e0b" },
        ].map(({ label, value, unit, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border" style={{ borderColor:"#e8d5c4" }}>
            <p style={{ color, fontFamily:"Georgia, serif" }} className="text-3xl font-bold">{value}{unit}</p>
            <p style={{ color:"#9c7a62" }} className="text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue Share Visual */}
      <div className="bg-white rounded-3xl p-6 border" style={{ borderColor:"#e8d5c4" }}>
        <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold mb-5">Revenue Share by Product</h3>
        <div className="space-y-3">
          {[...TOP_PRODUCTS]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5)
            .map((p, i) => {
              const pct = Math.round((p.revenue / totalRevenue) * 100);
              const colors = ["#c97d5b","#8b5cf6","#06b6d4","#f59e0b","#22c55e"];
              return (
                <div key={p.id}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: colors[i] }} />
                      <span style={{ color:"#4a3728" }} className="text-sm font-medium">{p.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span style={{ color:"#9c7a62" }} className="text-xs">{pct}%</span>
                      <span style={{ color:"#c97d5b" }} className="text-sm font-bold">{fmtK(p.revenue)}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full" style={{ background:"#f5ede5" }}>
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width:`${pct}%`, background: colors[i] }} />
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b"
          style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
          <h3 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">All Products</h3>
          <div className="flex gap-2 flex-wrap">
            {CATS.map(c => (
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

        {/* Col Headers */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 border-b text-xs font-bold uppercase tracking-wide"
          style={{ borderColor:"#f0e4d8", background:"#fafaf9", color:"#9c7a62" }}>
          <span>Product</span>
          <span>Price</span>
          <button onClick={() => toggleSort("sold")} className="flex items-center gap-1 hover:opacity-70">
            Sold {sortIcon("sold")}
          </button>
          <button onClick={() => toggleSort("revenue")} className="flex items-center gap-1 hover:opacity-70">
            Revenue {sortIcon("revenue")}
          </button>
          <button onClick={() => toggleSort("stock")} className="flex items-center gap-1 hover:opacity-70">
            Stock {sortIcon("stock")}
          </button>
          <span>Trend</span>
        </div>

        {sorted.map((p, i) => (
          <div key={p.id}
            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-4 items-center border-b hover:bg-amber-50 transition-colors"
            style={{ borderColor:"#f0e4d8" }}>
            {/* Product */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative shrink-0">
                <img src={p.img} alt={p.name} className="w-10 h-10 object-cover rounded-xl" />
                <span className="absolute -top-1 -left-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background:"#4a3728", fontSize:"10px" }}>#{i+1}</span>
              </div>
              <div className="min-w-0">
                <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{p.name}</p>
                <div className="flex items-center gap-1">
                  <Star size={10} className="fill-amber-400 text-amber-400"/>
                  <span style={{ color:"#9c7a62" }} className="text-xs">{p.rating}</span>
                  <span style={{ color:"#d4b5a0" }} className="text-xs">· {p.category}</span>
                </div>
              </div>
            </div>
            <p style={{ color:"#4a3728" }} className="text-sm font-medium">{fmt(p.price)}</p>
            <p style={{ color:"#4a3728" }} className="text-sm font-medium">{p.sold.toLocaleString()}</p>
            <p style={{ color:"#c97d5b" }} className="text-sm font-bold">{fmtK(p.revenue)}</p>
            {/* Stock */}
            <div>
              <p style={{ color: p.stock < 15 ? "#dc2626" : "#4a3728" }} className="text-sm font-medium">{p.stock}</p>
              {p.stock < 15 && (
                <p style={{ color:"#dc2626" }} className="text-xs">Low stock!</p>
              )}
            </div>
            {/* Trend */}
            <div className={`flex items-center gap-1 text-xs font-bold`}
              style={{ color: p.trend >= 0 ? "#16a34a" : "#dc2626" }}>
              {p.trend >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
              {Math.abs(p.trend)}%
            </div>
          </div>
        ))}
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

const ORDER_STATUSES = ["Pending","Processing","Shipped","Delivered","Cancelled"];

const ORDER_STATUS_CFG = {
  Pending:    { bg:"#dbeafe", color:"#2563eb" },
  Processing: { bg:"#dbeafe", color:"#2563eb" },
  Shipped:    { bg:"#fef9c3", color:"#ca8a04" },
  Delivered:  { bg:"#dcfce7", color:"#16a34a" },
  Cancelled:  { bg:"#fee2e2", color:"#dc2626" },
};

function AdminOrdersTab() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");
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
    const matchFilter = filter === "All" || o.status === filter;
    const matchSearch = search === "" ||
      o._id.toLowerCase().includes(search.toLowerCase()) ||
      (o.shippingAddress?.name || "").toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = ["All", ...ORDER_STATUSES].reduce((acc, f) => {
    acc[f] = f === "All" ? orders.length : orders.filter(o => o.status === f).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold">Orders</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm mt-0.5">{orders.length} total orders</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"#9c7a62" }} />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by ID or customer..."
            className="pl-9 pr-4 py-2 rounded-full border text-sm outline-none w-64"
            style={{ borderColor:"#e8d5c4", background:"white", color:"#3a2416" }} />
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {["All", ...ORDER_STATUSES].filter(f => f === "All" || counts[f] > 0).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
            style={filter === f
              ? { background:"#4a3728", borderColor:"#4a3728", color:"white" }
              : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
            {f} {counts[f] > 0 ? `(${counts[f]})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-4xl block mb-3">📦</span>
          <p style={{ color:"#9c7a62" }}>No orders found</p>
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
          {/* Table header */}
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 text-xs font-bold uppercase tracking-wide"
            style={{ background:"#fdf8f3", color:"#9c7a62", borderBottom:"1px solid #f0e4d8" }}>
            <span>Order ID</span>
            <span>Customer</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Update</span>
          </div>
          {filtered.map(order => {
            const cfg  = ORDER_STATUS_CFG[order.status] || ORDER_STATUS_CFG.Pending;
            const addr = order.shippingAddress || {};
            const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short" }) : "";
            return (
              <div key={order._id}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-4 items-center border-b"
                style={{ borderColor:"#f0e4d8", background:"white" }}>

                <div>
                  <p style={{ color:"#3a2416" }} className="text-xs font-bold">#{order._id.slice(-8).toUpperCase()}</p>
                  <p style={{ color:"#9c7a62" }} className="text-xs">{date}</p>
                </div>

                <div className="min-w-0">
                  <p style={{ color:"#3a2416" }} className="text-sm font-semibold truncate">{addr.name || "—"}</p>
                  <p style={{ color:"#9c7a62" }} className="text-xs truncate">{addr.city || ""}</p>
                </div>

                <span style={{ color:"#c97d5b" }} className="font-bold text-sm whitespace-nowrap">
                  {fmt(order.totalPrice || 0)}
                </span>

                <span className="text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ background: cfg.bg, color: cfg.color }}>
                  {order.status}
                </span>

                <select
                  value={order.status}
                  disabled={updating === order._id}
                  onChange={e => updateStatus(order._id, e.target.value)}
                  className="text-xs rounded-lg border px-2 py-1.5 outline-none cursor-pointer"
                  style={{ borderColor:"#e8d5c4", color:"#4a3728", background:"white" }}>
                  {ORDER_STATUSES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
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
            <div style={{ background:"#c97d5b" }} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
            <div className="min-w-0">
              <p style={{ color:"#f5e6d3" }} className="text-xs font-semibold truncate">Ananya Mehta</p>
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
                {tab === "dashboard" ? "Good Morning, Ananya 🌸" : NAV.find(n => n.id === tab)?.label}
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
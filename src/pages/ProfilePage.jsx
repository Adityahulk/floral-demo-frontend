import { useState } from "react";
import {
  User, Mail, Phone, MapPin, Edit2, Save, X,
  Package, Heart, LogOut, Camera, Shield,
  ChevronRight, Star, Bell, Lock
} from "lucide-react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const INITIAL_USER = {
  name:    "Priya Sharma",
  email:   "priya.sharma@gmail.com",
  phone:   "+91 98765 43210",
  address: "123 MG Road, Lucknow, UP 226001",
  avatar:  null,
  joined:  "January 2024",
};

const RECENT_ORDERS = [
  { id:"FS-20250428", item:"Rose Bliss Bouquet",       price:1299, status:"Delivered",  date:"28 Apr 2025", img:"https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200&q=80" },
  { id:"FS-20250415", item:"Pastel Dream Arrangement", price:3798, status:"In Transit", date:"15 Apr 2025", img:"https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=200&q=80" },
  { id:"FS-20250401", item:"Wildflower Wreath",        price:999,  status:"Delivered",  date:"1 Apr 2025",  img:"https://images.unsplash.com/photo-1491013516836-7db643ee125a?w=200&q=80" },
];

const WISHLIST = [
  { id:1, name:"Orchid Elegance Set",  price:2199, img:"https://images.unsplash.com/photo-1566873535350-96e04c74fb1a?w=200&q=80" },
  { id:2, name:"Dahlia Delight Box",   price:1699, img:"https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&q=80" },
  { id:3, name:"Mixed Tulip Bunch",    price:749,  img:"https://images.unsplash.com/photo-1520763185298-1b434c919102?w=200&q=80" },
];

const fmt = n => "₹" + n.toLocaleString("en-IN");

const STATUS_STYLE = {
  Delivered:  { bg:"#dcfce7", color:"#16a34a" },
  "In Transit": { bg:"#fef9c3", color:"#ca8a04" },
  Processing: { bg:"#dbeafe", color:"#2563eb" },
  Cancelled:  { bg:"#fee2e2", color:"#dc2626" },
};

// ─── SIDEBAR MENU ─────────────────────────────────────────────────────────────

const MENU = [
  { id:"profile",   icon:<User size={18}/>,    label:"My Profile"    },
  { id:"orders",    icon:<Package size={18}/>,  label:"My Orders"     },
  { id:"wishlist",  icon:<Heart size={18}/>,    label:"Wishlist"      },
  { id:"addresses", icon:<MapPin size={18}/>,   label:"Addresses"     },
  { id:"security",  icon:<Lock size={18}/>,     label:"Password"      },
  { id:"notif",     icon:<Bell size={18}/>,     label:"Notifications" },
];

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const [user, setUser]   = useState(INITIAL_USER);
  const [edit, setEdit]   = useState(false);
  const [draft, setDraft] = useState(INITIAL_USER);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setUser(draft);
    setEdit(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function handleCancel() {
    setDraft(user);
    setEdit(false);
  }

  const field = (label, key, type = "text", icon) => (
    <div>
      <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5 flex items-center gap-2">
        {icon} {label}
      </label>
      {edit ? (
        <input type={type} value={draft[key]} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
          className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
          style={{ borderColor: "#c97d5b", background: "#fdf8f3", color: "#3a2416" }} />
      ) : (
        <div className="px-4 py-3 rounded-xl text-sm" style={{ background: "#f5ede5", color: "#4a3728" }}>
          {user[key] || <span style={{ color: "#bbb" }}>Not provided</span>}
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold">My Profile</h2>
          <p style={{ color: "#9c7a62" }} className="text-sm mt-1">Manage your personal information</p>
        </div>
        {!edit ? (
          <button onClick={() => setEdit(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-80"
            style={{ background: "#f5ede5", color: "#c97d5b" }}>
            <Edit2 size={14} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border"
              style={{ borderColor: "#e8d5c4", color: "#7a5c4a" }}>
              <X size={14} /> Cancel
            </button>
            <button onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white"
              style={{ background: "#c97d5b" }}>
              <Save size={14} /> Save
            </button>
          </div>
        )}
      </div>

      {saved && (
        <div className="mb-6 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2"
          style={{ background: "#dcfce7", color: "#16a34a" }}>
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl" style={{ background: "#f5ede5" }}>
        <div className="relative">
          <div style={{ background: "#c97d5b" }}
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name.charAt(0)}
          </div>
          {edit && (
            <button style={{ background: "#4a3728" }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center">
              <Camera size={13} className="text-white" />
            </button>
          )}
        </div>
        <div>
          <p style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-xl font-bold">{user.name}</p>
          <p style={{ color: "#9c7a62" }} className="text-sm">Member since {user.joined}</p>
          <div className="flex items-center gap-1 mt-1">
            <Shield size={13} style={{ color: "#22c55e" }} />
            <span style={{ color: "#22c55e" }} className="text-xs font-medium">Verified Account</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[["12","Total Orders"],["3","Wishlist Items"],["₹8.2K","Total Spent"]].map(([n, l]) => (
          <div key={l} className="text-center p-4 rounded-2xl border" style={{ borderColor: "#e8d5c4", background: "white" }}>
            <p style={{ fontFamily: "Georgia, serif", color: "#c97d5b" }} className="text-2xl font-bold">{n}</p>
            <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {field("Full Name",    "name",    "text",  <User size={14}/>)}
        {field("Email Address","email",   "email", <Mail size={14}/>)}
        {field("Phone Number", "phone",   "tel",   <Phone size={14}/>)}
        {field("Address",      "address", "text",  <MapPin size={14}/>)}
      </div>
    </div>
  );
}

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────

function OrdersTab() {
  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-2">My Orders</h2>
      <p style={{ color: "#9c7a62" }} className="text-sm mb-8">Track and manage your recent orders</p>
      <div className="space-y-4">
        {RECENT_ORDERS.map(order => {
          const s = STATUS_STYLE[order.status];
          return (
            <div key={order.id} className="flex gap-4 p-4 rounded-2xl border items-center"
              style={{ borderColor: "#e8d5c4", background: "white" }}>
              <img src={order.img} alt={order.item} className="w-16 h-16 object-cover rounded-xl shrink-0" />
              <div className="flex-1 min-w-0">
                <p style={{ color: "#3a2416" }} className="font-semibold text-sm truncate">{order.item}</p>
                <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">{order.id} · {order.date}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{ background: s.bg, color: s.color }}>
                    {order.status}
                  </span>
                  <span style={{ color: "#c97d5b" }} className="text-sm font-bold">{fmt(order.price)}</span>
                </div>
              </div>
              <button style={{ color: "#c97d5b" }} className="shrink-0 hover:opacity-70">
                <ChevronRight size={20} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── WISHLIST TAB ─────────────────────────────────────────────────────────────

function WishlistTab() {
  const [list, setList] = useState(WISHLIST);
  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-2">My Wishlist</h2>
      <p style={{ color: "#9c7a62" }} className="text-sm mb-8">{list.length} items saved</p>
      {list.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">💐</span>
          <p style={{ color: "#9c7a62" }}>Your wishlist is empty. Start adding flowers!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {list.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden border" style={{ borderColor: "#e8d5c4" }}>
              <div className="relative">
                <img src={item.img} alt={item.name} className="w-full aspect-square object-cover" />
                <button onClick={() => setList(l => l.filter(i => i.id !== item.id))}
                  className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-rose-50">
                  <X size={13} className="text-rose-400" />
                </button>
              </div>
              <div className="p-3">
                <p style={{ color: "#3a2416" }} className="text-sm font-semibold truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span style={{ color: "#c97d5b" }} className="font-bold text-sm">{fmt(item.price)}</span>
                  <button style={{ background: "#f5ede5", color: "#c97d5b" }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full hover:opacity-80">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SECURITY TAB ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [saved, setSaved] = useState(false);
  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-2">Change Password</h2>
      <p style={{ color: "#9c7a62" }} className="text-sm mb-8">Keep your account secure</p>
      {saved && (
        <div className="mb-6 px-4 py-3 rounded-2xl text-sm font-medium" style={{ background: "#dcfce7", color: "#16a34a" }}>
          ✅ Password changed successfully!
        </div>
      )}
      <div className="space-y-4 max-w-md">
        {[["Current Password","current"],["New Password","new"],["Confirm New Password","confirm"]].map(([label, key]) => (
          <div key={key}>
            <label style={{ color: "#4a3728" }} className="block text-sm font-semibold mb-1.5">{label}</label>
            <input type="password" placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
              style={{ borderColor: "#e8d5c4", background: "#fdf8f3" }} />
          </div>
        ))}
        <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000); }}
          style={{ background: "#c97d5b" }} className="w-full py-3 rounded-full text-white font-bold hover:opacity-90">
          Update Password
        </button>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS TAB ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    orders: true, offers: true, wishlist: false, newsletter: true, sms: false,
  });
  const toggle = key => setPrefs(p => ({ ...p, [key]: !p[key] }));

  const items = [
    { key:"orders",     label:"Order Updates",      sub:"Delivery status and confirmations" },
    { key:"offers",     label:"Offers & Discounts",  sub:"Exclusive deals and coupons" },
    { key:"wishlist",   label:"Wishlist Alerts",     sub:"Price drops on saved items" },
    { key:"newsletter", label:"Newsletter",          sub:"Seasonal tips and inspiration" },
    { key:"sms",        label:"SMS Notifications",   sub:"Get updates on your phone" },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold mb-2">Notifications</h2>
      <p style={{ color: "#9c7a62" }} className="text-sm mb-8">Choose what you want to hear from us</p>
      <div className="space-y-3">
        {items.map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-2xl border"
            style={{ borderColor: "#e8d5c4", background: "white" }}>
            <div>
              <p style={{ color: "#3a2416" }} className="font-semibold text-sm">{label}</p>
              <p style={{ color: "#9c7a62" }} className="text-xs mt-0.5">{sub}</p>
            </div>
            <button onClick={() => toggle(key)}
              className="w-12 h-6 rounded-full transition-all relative shrink-0"
              style={{ background: prefs[key] ? "#c97d5b" : "#e8d5c4" }}>
              <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: prefs[key] ? "calc(100% - 22px)" : "2px" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── ADDRESSES TAB ────────────────────────────────────────────────────────────

function AddressesTab() {
  const [addresses] = useState([
    { id:1, label:"Home",   address:"123 MG Road, Lucknow, UP 226001",   default:true  },
    { id:2, label:"Office", address:"45 Gomti Nagar, Lucknow, UP 226010", default:false },
  ]);
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", color: "#3a2416" }} className="text-2xl font-bold">Saved Addresses</h2>
          <p style={{ color: "#9c7a62" }} className="text-sm mt-1">Manage your delivery locations</p>
        </div>
        <button style={{ background: "#c97d5b" }} className="text-white px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90">
          + Add New
        </button>
      </div>
      <div className="space-y-4">
        {addresses.map(a => (
          <div key={a.id} className="flex gap-4 p-5 rounded-2xl border" style={{ borderColor: a.default ? "#c97d5b" : "#e8d5c4", background: "white" }}>
            <div style={{ background: "#f5ede5" }} className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <MapPin size={18} style={{ color: "#c97d5b" }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p style={{ color: "#3a2416" }} className="font-bold">{a.label}</p>
                {a.default && <span style={{ background: "#f5ede5", color: "#c97d5b" }} className="text-xs font-bold px-2 py-0.5 rounded-full">Default</span>}
              </div>
              <p style={{ color: "#7a5c4a" }} className="text-sm">{a.address}</p>
            </div>
            <button style={{ color: "#c97d5b" }} className="text-sm font-semibold hover:opacity-70 shrink-0">Edit</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [active, setActive] = useState("profile");

  const TABS = {
    profile:   <ProfileTab />,
    orders:    <OrdersTab />,
    wishlist:  <WishlistTab />,
    addresses: <AddressesTab />,
    security:  <SecurityTab />,
    notif:     <NotificationsTab />,
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#fdf8f3", minHeight: "100vh" }}>

      {/* Top Bar */}
      <div style={{ background: "#f5ede5", borderBottom: "1px solid #e8d5c4" }} className="py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2 text-sm" style={{ color: "#9c7a62" }}>
          <a href="/" className="hover:underline">Home</a>
          <span>/</span>
          <span style={{ color: "#4a3728" }} className="font-medium">My Account</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

          {/* ── Sidebar ── */}
          <div className="lg:sticky lg:top-6">
            {/* User Card */}
            <div className="p-5 rounded-3xl mb-4 text-center" style={{ background: "#4a3728" }}>
              <div style={{ background: "#c97d5b" }}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                P
              </div>
              <p style={{ fontFamily: "Georgia, serif", color: "#f5e6d3" }} className="font-bold text-lg">Priya Sharma</p>
              <p style={{ color: "#b89c8a" }} className="text-xs">priya.sharma@gmail.com</p>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-3xl overflow-hidden border" style={{ borderColor: "#e8d5c4" }}>
              {MENU.map(({ id, icon, label }, i) => (
                <button key={id} onClick={() => setActive(id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-left transition-all border-b last:border-0"
                  style={{
                    borderColor: "#f0e4d8",
                    background: active === id ? "#fdf8f3" : "white",
                    color: active === id ? "#c97d5b" : "#5c4033",
                    borderLeft: active === id ? "3px solid #c97d5b" : "3px solid transparent",
                  }}>
                  <span style={{ color: active === id ? "#c97d5b" : "#9c7a62" }}>{icon}</span>
                  {label}
                  <ChevronRight size={14} className="ml-auto" style={{ color: active === id ? "#c97d5b" : "#d0b8a8" }} />
                </button>
              ))}

              {/* Logout */}
              <button className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-t hover:bg-red-50 transition-colors"
                style={{ borderColor: "#f0e4d8", color: "#dc2626" }}>
                <LogOut size={18} /> Log Out
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border" style={{ borderColor: "#e8d5c4" }}>
            {TABS[active]}
          </div>

        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Edit2, Save, X,
  Package, Heart, LogOut, Camera, Shield,
  ChevronRight, Bell, Lock, Eye, EyeOff, Check
} from "lucide-react";
import { authFetch, clearAuth, getTokenPayload, getToken } from "../../utils/auth";

const BASE = "http://localhost:3001";
const fmt  = n => "₹" + n.toLocaleString("en-IN");

const STATUS_STYLE = {
  pending:    { bg:"#dbeafe", color:"#2563eb", label:"Pending"    },
  processing: { bg:"#dbeafe", color:"#2563eb", label:"Processing" },
  shipped:    { bg:"#fef9c3", color:"#ca8a04", label:"Shipped"    },
  delivered:  { bg:"#dcfce7", color:"#16a34a", label:"Delivered"  },
  cancelled:  { bg:"#fee2e2", color:"#dc2626", label:"Cancelled"  },
};

const MENU = [
  { id:"profile",  icon:<User size={18}/>,    label:"My Profile"    },
  { id:"orders",   icon:<Package size={18}/>,  label:"My Orders"     },
  { id:"security", icon:<Lock size={18}/>,     label:"Password"      },
  { id:"notif",    icon:<Bell size={18}/>,     label:"Notifications" },
];

// ─── PROFILE TAB ──────────────────────────────────────────────────────────────

function ProfileTab({ user, onUpdate }) {
  const [edit,      setEdit]      = useState(false);
  const [draft,     setDraft]     = useState(user);
  const [imgFile,   setImgFile]   = useState(null);   // selected File object
  const [imgPreview,setImgPreview]= useState(null);   // local blob URL for preview
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState(null);

  useEffect(() => { setDraft(user); }, [user]);

  function handleImgChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImgFile(file);
    setImgPreview(URL.createObjectURL(file));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const fd = new FormData();
      if (draft.name)  fd.append("name", draft.name);
      if (draft.phone) fd.append("contactNumber", draft.phone);
      if (imgFile)     fd.append("image", imgFile);

      const token = getToken();
      const res = await fetch(`${BASE}/api/auth/profile`, {
        method:  "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body:    fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      const updated = data.user || data.data || {};
      onUpdate({
        ...user,
        name:          updated.name          || draft.name,
        phone:         updated.contactNumber || updated.phone || draft.phone,
        profileImage:  updated.profileImage  || user.profileImage,
        totalOrders:   data.totalOrders      ?? user.totalOrders,
        totalSpent:    data.totalSpent       ?? user.totalSpent,
      });
      setEdit(false);
      setImgFile(null);
      setImgPreview(null);
      setMsg({ type:"success", text:"Profile updated successfully!" });
    } catch (err) {
      setMsg({ type:"error", text: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 3000);
    }
  }

  function handleCancel() {
    setDraft(user);
    setImgFile(null);
    setImgPreview(null);
    setEdit(false);
  }

  function field(label, key, type = "text", icon, readOnly = false) {
    return (
      <div>
        <label style={{ color:"#4a3728" }} className="flex items-center gap-2 text-sm font-semibold mb-1.5">
          {icon} {label}
        </label>
        {edit && !readOnly ? (
          <input type={type} value={draft[key] || ""} onChange={e => setDraft(d => ({ ...d, [key]: e.target.value }))}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none"
            style={{ borderColor:"#c97d5b", background:"#fdf8f3", color:"#3a2416" }} />
        ) : (
          <div className="px-4 py-3 rounded-xl text-sm flex items-center justify-between"
            style={{ background:"#f5ede5", color:"#4a3728" }}>
            <span>{(key === "phone" ? user.phone : user[key]) || <span style={{ color:"#bbb" }}>Not provided</span>}</span>
            {readOnly && <span style={{ color:"#9c7a62" }} className="text-xs">Cannot edit</span>}
          </div>
        )}
      </div>
    );
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month:"long", year:"numeric" })
    : "—";

  const avatarSrc = imgPreview || user.profileImage || null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold">My Profile</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm mt-1">Manage your personal information</p>
        </div>
        {!edit ? (
          <button onClick={() => setEdit(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-80"
            style={{ background:"#f5ede5", color:"#c97d5b" }}>
            <Edit2 size={14}/> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={handleCancel}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border"
              style={{ borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              <X size={14}/> Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-60"
              style={{ background:"#c97d5b" }}>
              <Save size={14}/> {saving ? "Saving…" : "Save"}
            </button>
          </div>
        )}
      </div>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{ background: msg.type === "success" ? "#dcfce7" : "#fee2e2", color: msg.type === "success" ? "#16a34a" : "#dc2626" }}>
          {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 p-5 rounded-2xl" style={{ background:"#f5ede5" }}>
        <div className="relative">
          {avatarSrc
            ? <img src={avatarSrc} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2" style={{ borderColor:"#c97d5b" }}/>
            : <div style={{ background:"#c97d5b" }} className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
          }
          {edit && (
            <label htmlFor="avatarInput" style={{ background:"#4a3728" }}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
              <Camera size={13} className="text-white"/>
              <input id="avatarInput" type="file" accept="image/*" className="hidden" onChange={handleImgChange}/>
            </label>
          )}
        </div>
        <div>
          <p style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">{user.name}</p>
          <p style={{ color:"#9c7a62" }} className="text-sm">Member since {joinedDate}</p>
          <div className="flex items-center gap-1 mt-1">
            <Shield size={13} style={{ color:"#22c55e" }}/>
            <span style={{ color:"#22c55e" }} className="text-xs font-medium">Verified Account</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          [user.totalOrders ?? "—", "Total Orders"],
          [user.totalSpent != null ? fmt(user.totalSpent) : "—", "Total Spent"],
        ].map(([n, l]) => (
          <div key={l} className="text-center p-4 rounded-2xl border" style={{ borderColor:"#e8d5c4", background:"white" }}>
            <p style={{ fontFamily:"Georgia, serif", color:"#c97d5b" }} className="text-2xl font-bold">{n}</p>
            <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{l}</p>
          </div>
        ))}
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {field("Full Name",     "name",  "text",  <User size={14}/>)}
        {field("Email Address", "email", "email", <Mail size={14}/>, true)}
        {field("Phone Number",  "phone", "tel",   <Phone size={14}/>)}
      </div>
    </div>
  );
}

// ─── ORDERS TAB ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch(`${BASE}/api/orders/user`)
      .then(r => r.json())
      .then(data => { setOrders((data.data || data.orders || []).slice(0, 5)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold">My Orders</h2>
        <Link to="/orders" style={{ color:"#c97d5b" }} className="text-sm font-semibold hover:opacity-70 flex items-center gap-1">
          View All <ChevronRight size={14}/>
        </Link>
      </div>
      <p style={{ color:"#9c7a62" }} className="text-sm mb-8">Your recent orders</p>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor:"#c97d5b", borderTopColor:"transparent" }}/>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl block mb-4">📦</span>
          <p style={{ color:"#9c7a62" }} className="mb-4">You haven't placed any orders yet.</p>
          <Link to="/" style={{ background:"#c97d5b" }} className="text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90">
            Start Shopping 🌸
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const s    = STATUS_STYLE[(order.status || "").toLowerCase()] || STATUS_STYLE.pending;
            const date = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "";
            const firstItem = order.items?.[0];
            const product   = firstItem?.product;
            const img       = product?.images?.[0] || null;
            const itemName  = product?.name || "Order";
            const extraCount = order.items.length - 1;

            return (
              <Link to={`/orders/${order._id}`} key={order._id}
                className="flex gap-4 p-4 rounded-2xl border items-center hover:shadow-sm transition-shadow"
                style={{ borderColor:"#e8d5c4", background:"white" }}>
                {img
                  ? <img src={img} alt={itemName} className="w-16 h-16 object-cover rounded-xl shrink-0"/>
                  : <div className="w-16 h-16 rounded-xl shrink-0 flex items-center justify-center text-2xl" style={{ background:"#f5ede5" }}>🌸</div>
                }
                <div className="flex-1 min-w-0">
                  <p style={{ color:"#3a2416" }} className="font-semibold text-sm truncate">
                    {itemName}{extraCount > 0 ? ` +${extraCount} more` : ""}
                  </p>
                  <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">
                    #{order._id.slice(-8).toUpperCase()} · {date}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                      style={{ background:s.bg, color:s.color }}>
                      {s.label}
                    </span>
                    <span style={{ color:"#c97d5b" }} className="text-sm font-bold">
                      {fmt(order.totalAmount || order.totalPrice || 0)}
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} style={{ color:"#c97d5b" }} className="shrink-0"/>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── SECURITY TAB ─────────────────────────────────────────────────────────────

function SecurityTab() {
  const [form,    setForm]    = useState({ current:"", newPass:"", confirm:"" });
  const [show,    setShow]    = useState({ current:false, newPass:false, confirm:false });
  const [saving,  setSaving]  = useState(false);
  const [msg,     setMsg]     = useState(null);

  async function handleSave() {
    if (!form.current || !form.newPass || !form.confirm) {
      setMsg({ type:"error", text:"Please fill all fields." }); return;
    }
    if (form.newPass !== form.confirm) {
      setMsg({ type:"error", text:"New passwords do not match." }); return;
    }
    if (form.newPass.length < 6) {
      setMsg({ type:"error", text:"Password must be at least 6 characters." }); return;
    }
    setSaving(true);
    try {
      const res  = await authFetch(`${BASE}/api/auth/profile`, {
        method: "PUT",
        body:   JSON.stringify({ password: form.newPass }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setForm({ current:"", newPass:"", confirm:"" });
      setMsg({ type:"success", text:"Password changed successfully!" });
    } catch (err) {
      setMsg({ type:"error", text: err.message });
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 4000);
    }
  }

  function pwField(label, key) {
    return (
      <div>
        <label style={{ color:"#4a3728" }} className="block text-sm font-semibold mb-1.5">{label}</label>
        <div className="relative">
          <input type={show[key] ? "text" : "password"} value={form[key]}
            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            placeholder="••••••••"
            className="w-full px-4 py-3 pr-11 rounded-xl border text-sm outline-none"
            style={{ borderColor:"#e8d5c4", background:"#fdf8f3" }} />
          <button type="button" onClick={() => setShow(s => ({ ...s, [key]: !s[key] }))}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-60"
            style={{ color:"#9c7a62" }}>
            {show[key] ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold mb-2">Change Password</h2>
      <p style={{ color:"#9c7a62" }} className="text-sm mb-8">Keep your account secure</p>

      {msg && (
        <div className="mb-6 px-4 py-3 rounded-2xl text-sm font-medium"
          style={{ background: msg.type === "success" ? "#dcfce7" : "#fee2e2", color: msg.type === "success" ? "#16a34a" : "#dc2626" }}>
          {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
        </div>
      )}

      <div className="space-y-4 max-w-md">
        {pwField("Current Password", "current")}
        {pwField("New Password",     "newPass")}
        {pwField("Confirm New Password", "confirm")}

        <button onClick={handleSave} disabled={saving}
          style={{ background:"#c97d5b" }}
          className="w-full py-3 rounded-full text-white font-bold hover:opacity-90 disabled:opacity-60">
          {saving ? "Updating…" : "Update Password"}
        </button>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS TAB ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    orders:true, offers:true, wishlist:false, newsletter:true, sms:false,
  });
  const [saved, setSaved] = useState(false);

  const items = [
    { key:"orders",     label:"Order Updates",     sub:"Delivery status and confirmations" },
    { key:"offers",     label:"Offers & Discounts", sub:"Exclusive deals and coupons"       },
    { key:"wishlist",   label:"Wishlist Alerts",    sub:"Price drops on saved items"        },
    { key:"newsletter", label:"Newsletter",         sub:"Seasonal tips and inspiration"     },
    { key:"sms",        label:"SMS Notifications",  sub:"Get updates on your phone"        },
  ];

  function toggle(key) { setPrefs(p => ({ ...p, [key]: !p[key] })); }

  return (
    <div>
      <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-2xl font-bold mb-2">Notifications</h2>
      <p style={{ color:"#9c7a62" }} className="text-sm mb-8">Choose what you want to hear from us</p>

      <div className="space-y-3 mb-6">
        {items.map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between p-4 rounded-2xl border"
            style={{ borderColor:"#e8d5c4", background:"white" }}>
            <div>
              <p style={{ color:"#3a2416" }} className="font-semibold text-sm">{label}</p>
              <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">{sub}</p>
            </div>
            <button onClick={() => toggle(key)}
              className="w-12 h-6 rounded-full transition-all relative shrink-0"
              style={{ background: prefs[key] ? "#c97d5b" : "#e8d5c4" }}>
              <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: prefs[key] ? "calc(100% - 22px)" : "2px" }}/>
            </button>
          </div>
        ))}
      </div>

      {saved && (
        <div className="px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2 mb-4"
          style={{ background:"#dcfce7", color:"#16a34a" }}>
          <Check size={14}/> Preferences saved!
        </div>
      )}
      <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
        style={{ background:"#c97d5b" }}
        className="px-6 py-2.5 rounded-full text-white text-sm font-bold hover:opacity-90">
        Save Preferences
      </button>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");

  // Initialize from JWT token immediately so page never shows blank
  const [user, setUser] = useState(() => {
    const p = getTokenPayload();
    if (!p) return null;
    return { name: p.name || "", email: p.email || "", phone: p.contactNumber || p.phone || "", _id: p.id || p._id };
  });

  useEffect(() => {
    authFetch(`${BASE}/api/auth/me`)
      .then(r => r.json())
      .then(data => {
        const u = data.user || data.data || data;
        if (u && (u.name || u.email)) {
          setUser({
            ...u,
            phone:        u.contactNumber || u.phone || "",
            profileImage: u.profileImage  || null,
            totalOrders:  data.totalOrders ?? 0,
            totalSpent:   data.totalSpent  ?? 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  function handleLogout() {
    clearAuth();
    navigate("/login");
  }

  const TABS = {
    profile:  user
      ? <ProfileTab user={user} onUpdate={setUser} />
      : <div className="text-center py-16"><p style={{ color:"#9c7a62" }}>Please log in to view your profile.</p></div>,
    orders:   <OrdersTab />,
    security: <SecurityTab />,
    notif:    <NotificationsTab />,
  };

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"#fdf8f3", minHeight:"100vh" }}>

      <div style={{ background:"#f5ede5", borderBottom:"1px solid #e8d5c4" }} className="py-3">
        <div className="max-w-6xl mx-auto px-4 flex items-center gap-2 text-sm" style={{ color:"#9c7a62" }}>
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color:"#4a3728" }} className="font-medium">My Account</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">

          {/* ── Sidebar ── */}
          <div className="lg:sticky lg:top-6">
            {/* User Card */}
            <div className="p-5 rounded-3xl mb-4 text-center" style={{ background:"#4a3728" }}>
              {user?.profileImage
                ? <img src={user.profileImage} alt="avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 mx-auto mb-3"
                    style={{ borderColor:"#c97d5b" }}/>
                : <div style={{ background:"#c97d5b" }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                    {user?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
              }
              <p style={{ fontFamily:"Georgia, serif", color:"#f5e6d3" }} className="font-bold text-lg truncate">
                {user?.name || "User"}
              </p>
              <p style={{ color:"#b89c8a" }} className="text-xs truncate">{user?.email || ""}</p>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-3xl overflow-hidden border" style={{ borderColor:"#e8d5c4" }}>
              {MENU.map(({ id, icon, label }) => (
                <button key={id} onClick={() => setActive(id)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-left transition-all border-b last:border-0"
                  style={{
                    borderColor:"#f0e4d8",
                    background:  active === id ? "#fdf8f3" : "white",
                    color:       active === id ? "#c97d5b" : "#5c4033",
                    borderLeft:  active === id ? "3px solid #c97d5b" : "3px solid transparent",
                  }}>
                  <span style={{ color: active === id ? "#c97d5b" : "#9c7a62" }}>{icon}</span>
                  {label}
                  <ChevronRight size={14} className="ml-auto" style={{ color: active === id ? "#c97d5b" : "#d0b8a8" }}/>
                </button>
              ))}

              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium border-t hover:bg-red-50 transition-colors"
                style={{ borderColor:"#f0e4d8", color:"#dc2626" }}>
                <LogOut size={18}/> Log Out
              </button>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border" style={{ borderColor:"#e8d5c4" }}>
            {TABS[active]}
          </div>

        </div>
      </div>
    </div>
  );
}

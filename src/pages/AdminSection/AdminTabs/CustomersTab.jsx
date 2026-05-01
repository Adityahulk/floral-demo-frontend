import { useState, useEffect } from "react";
import { authFetch } from "../../../utils/auth";
import { Search, ChevronRight, X, Edit2 } from "lucide-react";
import { BASE, fmt, fmtK } from "./shared";

function initials(name = "") {
  return name.trim().split(" ").filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join("");
}

export default function CustomersTab() {
  const [users,        setUsers]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [total,        setTotal]        = useState(0);
  const [page,         setPage]         = useState(1);
  const LIMIT = 20;

  const [search,       setSearch]       = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [selected,     setSelected]     = useState(null);
  const [toggling,     setToggling]     = useState(null);

  const [editing,      setEditing]      = useState(false);
  const [editForm,     setEditForm]     = useState({});
  const [saving,       setSaving]       = useState(false);
  const [editError,    setEditError]    = useState("");

  useEffect(() => {
    const params = new URLSearchParams({ page, limit: LIMIT });
    if (activeFilter !== "all") params.set("active", activeFilter);
    authFetch(`${BASE}/api/auth/admin/users?${params}`)
      .then(r => r.json())
      .then(data => { setUsers(data.users || []); setTotal(data.total || 0); setLoading(false); })
      .catch(() => setLoading(false));
  }, [page, activeFilter]);

  function changeFilter(af) { setLoading(true); setActiveFilter(af); setPage(1); }
  function handlePageChange(pg) { setLoading(true); setPage(pg); }

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
      const res  = await authFetch(`${BASE}/api/auth/admin/users/${u._id}/status`, { method: "PATCH" });
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
      const res  = await authFetch(`${BASE}/api/auth/admin/users/${selected._id}`, {
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
          {[["all","All"],["true","Active"],["false","Inactive"]].map(([val, label]) => (
            <button key={val} onClick={() => changeFilter(val)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
              style={activeFilter === val
                ? { background:"#4a3728", borderColor:"#4a3728", color:"white" }
                : { borderColor:"#e8d5c4", color:"#7a5c4a" }}>
              {label}
            </button>
          ))}
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

        {/* Table */}
        <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
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

                <p style={{ color:"#5c4033" }} className="text-xs truncate">{u.contactNumber || "—"}</p>
                <p style={{ color:"#4a3728" }} className="text-sm font-semibold text-center">{u.totalOrders ?? "—"}</p>
                <p style={{ color:"#c97d5b" }} className="text-xs font-bold">
                  {u.totalSpent != null ? fmtK(u.totalSpent) : "—"}
                </p>

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

        {/* Detail / Edit Panel */}
        {selected ? (
          <div className="bg-white rounded-3xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
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
                  { key:"name",          label:"Full Name", type:"text"  },
                  { key:"email",         label:"Email",     type:"email" },
                  { key:"contactNumber", label:"Phone",     type:"tel"   },
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

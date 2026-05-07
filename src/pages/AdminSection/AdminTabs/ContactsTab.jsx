import { useState, useEffect } from "react";
import { Trash2, RefreshCw, Mail, MailOpen, CheckCircle, Search } from "lucide-react";
import { authFetch } from "../../../utils/auth";
import { BASE } from "./shared";

const STATUS_CONFIG = {
  unread:   { label: "Unread",   bg: "#dbeafe", color: "#2563eb" },
  read:     { label: "Read",     bg: "#f3f4f6", color: "#6b7280" },
  resolved: { label: "Resolved", bg: "#dcfce7", color: "#16a34a" },
};

export default function ContactsTab() {
  const [contacts, setContacts]     = useState([]);
  const [loading,  setLoading]      = useState(true);
  const [filter,   setFilter]       = useState("all");
  const [search,   setSearch]       = useState("");
  const [selected, setSelected]     = useState(null);
  const [deleting, setDeleting]     = useState(null);

  function load() {
    setLoading(true);
    authFetch(`${BASE}/api/contact?status=${filter}&limit=100`)
      .then(r => r.json())
      .then(d => { setContacts(d.data ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { load(); }, [filter]);

  async function setStatus(id, status) {
    await authFetch(`${BASE}/api/contact/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setContacts(prev => prev.map(c => c._id === id ? { ...c, status } : c));
    if (selected?._id === id) setSelected(s => ({ ...s, status }));
  }

  async function remove(id) {
    setDeleting(id);
    await authFetch(`${BASE}/api/contact/${id}`, { method: "DELETE" });
    setContacts(prev => prev.filter(c => c._id !== id));
    if (selected?._id === id) setSelected(null);
    setDeleting(null);
  }

  const filtered = contacts.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.message.toLowerCase().includes(search.toLowerCase())
  );

  const unreadCount = contacts.filter(c => c.status === "unread").length;

  return (
    <div className="flex gap-6 h-full">

      {/* ── List Panel ── */}
      <div className="flex-1 min-w-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color:"var(--color-olive)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-9 pr-4 py-2 rounded-full border text-sm outline-none"
              style={{ borderColor:"var(--color-border)", background:"white" }} />
          </div>
          <button onClick={load} className="p-2 rounded-full border hover:opacity-70" style={{ borderColor:"var(--color-border)" }}>
            <RefreshCw size={15} style={{ color:"var(--color-olive)" }} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5 flex-wrap">
          {["all","unread","read","resolved"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize border transition-all"
              style={filter === f
                ? { background:"var(--color-charcoal)", color:"white", borderColor:"var(--color-charcoal)" }
                : { borderColor:"var(--color-border)", color:"var(--color-olive)" }}>
              {f}{f === "all" && unreadCount > 0 && <span className="ml-1.5 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-xs">{unreadCount}</span>}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="space-y-3">
            {Array(5).fill(null).map((_,i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background:"var(--color-beige)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Mail size={40} className="mx-auto mb-3" style={{ color:"#d0b8a8" }} />
            <p style={{ color:"var(--color-olive)" }}>No messages found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(c => (
              <div key={c._id}
                onClick={() => { setSelected(c); if (c.status === "unread") setStatus(c._id, "read"); }}
                className="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-md"
                style={{
                  borderColor: selected?._id === c._id ? "var(--color-olive)" : "var(--color-border)",
                  background:  selected?._id === c._id ? "var(--color-beige)" : "white",
                  borderLeftWidth: c.status === "unread" ? "3px" : "1px",
                  borderLeftColor: c.status === "unread" ? "var(--color-olive)" : (selected?._id === c._id ? "var(--color-olive)" : "var(--color-border)"),
                }}>
                <div className="shrink-0 mt-0.5">
                  {c.status === "unread"
                    ? <Mail size={16} style={{ color:"var(--color-olive)" }} />
                    : <MailOpen size={16} style={{ color:"var(--color-olive)" }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-semibold truncate">{c.name}</p>
                    <span className="text-xs shrink-0" style={{ color:"var(--color-olive)" }}>
                      {new Date(c.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short" })}
                    </span>
                  </div>
                  <p style={{ color:"var(--color-olive)" }} className="text-xs truncate mb-1">{c.email} · {c.topic}</p>
                  <p style={{ color:"var(--color-olive)" }} className="text-xs truncate">{c.message}</p>
                </div>
                <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: STATUS_CONFIG[c.status].bg, color: STATUS_CONFIG[c.status].color }}>
                  {STATUS_CONFIG[c.status].label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Panel ── */}
      {selected ? (
        <div className="w-96 shrink-0 rounded-3xl border p-6 bg-white self-start sticky top-4" style={{ borderColor:"var(--color-border)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 style={{ color:"var(--color-charcoal)", fontFamily:"Georgia,serif" }} className="font-bold text-lg">{selected.name}</h3>
              <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">{selected.email}</p>
              {selected.phone && <p style={{ color:"var(--color-olive)" }} className="text-xs">{selected.phone}</p>}
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{ background: STATUS_CONFIG[selected.status].bg, color: STATUS_CONFIG[selected.status].color }}>
              {STATUS_CONFIG[selected.status].label}
            </span>
          </div>

          <div className="mb-4 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}>
            {selected.topic}
          </div>

          <p style={{ color:"var(--color-charcoal)" }} className="text-sm leading-relaxed mb-5 whitespace-pre-wrap">{selected.message}</p>

          <p style={{ color:"var(--color-sage)" }} className="text-xs mb-5">
            {new Date(selected.createdAt).toLocaleString("en-IN", { dateStyle:"medium", timeStyle:"short" })}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {selected.status !== "resolved" && (
              <button onClick={() => setStatus(selected._id, "resolved")}
                className="flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{ background:"#dcfce7", color:"#16a34a" }}>
                <CheckCircle size={15} /> Mark Resolved
              </button>
            )}
            {selected.status === "resolved" && (
              <button onClick={() => setStatus(selected._id, "unread")}
                className="flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                style={{ background:"#dbeafe", color:"#2563eb" }}>
                <Mail size={15} /> Reopen
              </button>
            )}
            <button onClick={() => remove(selected._id)} disabled={deleting === selected._id}
              className="flex items-center justify-center gap-2 py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
              style={{ background:"#fee2e2", color:"#dc2626" }}>
              <Trash2 size={15} /> {deleting === selected._id ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      ) : (
        <div className="w-96 shrink-0 rounded-3xl border p-6 bg-white flex flex-col items-center justify-center text-center self-start"
          style={{ borderColor:"var(--color-border)", minHeight:"200px" }}>
          <MailOpen size={36} className="mb-3" style={{ color:"#d0b8a8" }} />
          <p style={{ color:"var(--color-olive)" }} className="text-sm">Select a message to read it</p>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { Save, RefreshCw, ToggleLeft, ToggleRight, Trash2, Mail, Download } from "lucide-react";
import { authFetch } from "../../../utils/auth";
import { BASE } from "./shared";

export default function NewsletterTab() {
  const [config,      setConfig]      = useState(null);
  const [subscribers, setSubscribers] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [toast,       setToast]       = useState(null);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  function load() {
    setLoading(true);
    Promise.all([
      fetch(`${BASE}/api/newsletter`).then(r => r.json()),
      authFetch(`${BASE}/api/newsletter/subscribers`).then(r => r.json()),
    ])
      .then(([cfg, subs]) => {
        if (cfg.success) setConfig(cfg.data);
        if (subs.success) setSubscribers(subs.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function save() {
    setSaving(true);
    try {
      const r = await authFetch(`${BASE}/api/newsletter`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      const d = await r.json();
      if (d.success) { setConfig(d.data); showToast("Saved successfully!"); }
      else showToast(d.message ?? "Save failed.", false);
    } catch { showToast("Save failed.", false); }
    finally { setSaving(false); }
  }

  async function removeSub(id) {
    if (!confirm("Remove this subscriber?")) return;
    try {
      const r = await authFetch(`${BASE}/api/newsletter/subscribers/${id}`, { method: "DELETE" });
      const d = await r.json();
      if (d.success) {
        setSubscribers(s => s.filter(x => x._id !== id));
        showToast("Subscriber removed.");
      } else showToast(d.message ?? "Delete failed.", false);
    } catch { showToast("Delete failed.", false); }
  }

  function exportCSV() {
    if (subscribers.length === 0) return;
    const rows = [["Email", "Subscribed At", "Active"]];
    subscribers.forEach(s => rows.push([s.email, new Date(s.createdAt).toISOString(), s.active]));
    const csv = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function setField(k, v) { setConfig(c => ({ ...c, [k]: v })); }

  if (loading) return <div className="text-center py-20"><RefreshCw size={24} className="animate-spin mx-auto" style={{ color:"var(--color-olive)" }} /></div>;
  if (!config)  return <p className="text-center py-10" style={{ color:"var(--color-olive)" }}>Failed to load config.</p>;

  return (
    <div className="max-w-3xl space-y-6">

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium"
          style={{ background: toast.ok ? "var(--color-charcoal)" : "#dc2626", color: "white" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="text-xl font-bold">Newsletter</h2>
          <p style={{ color:"var(--color-olive)" }} className="text-sm">{subscribers.length} total subscriber{subscribers.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background:"var(--color-olive)" }}>
          <Save size={15}/> {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl border bg-white" style={{ borderColor:"var(--color-border)" }}>
        <div>
          <p style={{ color:"var(--color-charcoal)" }} className="font-semibold text-sm">Show Newsletter Section</p>
          <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5">Hide the entire section sitewide</p>
        </div>
        <button onClick={() => setField("enabled", !config.enabled)}>
          {config.enabled
            ? <ToggleRight size={32} style={{ color:"var(--color-olive)" }} />
            : <ToggleLeft  size={32} style={{ color:"#d0b8a8" }} />}
        </button>
      </div>

      {/* Copy fields */}
      <div className="p-5 rounded-2xl border bg-white space-y-4" style={{ borderColor:"var(--color-border)" }}>
        <p style={{ color:"var(--color-charcoal)" }} className="font-semibold text-sm">Section Copy</p>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color:"var(--color-olive)" }}>Emoji / Icon</label>
          <input value={config.emoji ?? ""} onChange={e => setField("emoji", e.target.value)}
            className="w-20 px-3 py-2 rounded-xl border text-lg text-center outline-none"
            style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }} />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color:"var(--color-olive)" }}>Heading</label>
          <input value={config.heading ?? ""} onChange={e => setField("heading", e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }} />
        </div>

        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color:"var(--color-olive)" }}>Sub-heading</label>
          <textarea value={config.subheading ?? ""} onChange={e => setField("subheading", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
            style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color:"var(--color-olive)" }}>Button Text</label>
            <input value={config.buttonText ?? ""} onChange={e => setField("buttonText", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
              style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }} />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color:"var(--color-olive)" }}>Success Message</label>
            <input value={config.successText ?? ""} onChange={e => setField("successText", e.target.value)}
              className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
              style={{ borderColor:"var(--color-border)", color:"var(--color-charcoal)" }} />
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <label className="text-xs font-medium block mb-2" style={{ color:"var(--color-olive)" }}>Preview</label>
          <div className="rounded-xl px-6 py-8 text-center" style={{ background:"var(--color-beige)" }}>
            <span className="text-3xl block mb-2">{config.emoji}</span>
            <p style={{ fontFamily:"Georgia,serif", color:"var(--color-charcoal)" }} className="text-xl font-bold mb-1">{config.heading}</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">{config.subheading}</p>
          </div>
        </div>
      </div>

      {/* Subscribers list */}
      <div className="p-5 rounded-2xl border bg-white space-y-3" style={{ borderColor:"var(--color-border)" }}>
        <div className="flex items-center justify-between mb-1">
          <div>
            <p style={{ color:"var(--color-charcoal)" }} className="font-semibold text-sm">Subscribers</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">{subscribers.length} total</p>
          </div>
          <button onClick={exportCSV} disabled={subscribers.length === 0}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full disabled:opacity-50"
            style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}>
            <Download size={13}/> Export CSV
          </button>
        </div>

        {subscribers.length === 0 ? (
          <div className="text-center py-8" style={{ color:"var(--color-olive)" }}>
            <Mail size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No subscribers yet.</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor:"var(--color-border)" }}>
            {subscribers.map(s => (
              <div key={s._id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <p style={{ color:"var(--color-charcoal)" }} className="text-sm font-medium truncate">{s.email}</p>
                  <p style={{ color:"var(--color-olive)" }} className="text-xs">
                    {new Date(s.createdAt).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                  </p>
                </div>
                <button onClick={() => removeSub(s._id)} className="shrink-0 p-2 rounded-lg hover:bg-red-50">
                  <Trash2 size={15} style={{ color:"#dc2626" }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

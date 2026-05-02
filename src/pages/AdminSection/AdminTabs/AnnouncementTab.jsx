import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Save, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { authFetch } from "../../../utils/auth";
import { BASE } from "./shared";

export default function AnnouncementTab() {
  const [config,  setConfig]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [toast,   setToast]   = useState(null);

  function showToast(msg, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  }

  function load() {
    setLoading(true);
    fetch(`${BASE}/api/announcement`)
      .then(r => r.json())
      .then(d => { if (d.success) setConfig(d.data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(load, []);

  async function save() {
    setSaving(true);
    try {
      const r = await authFetch(`${BASE}/api/announcement`, {
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

  function setField(k, v) { setConfig(c => ({ ...c, [k]: v })); }

  function addMsg() {
    setConfig(c => ({ ...c, messages: [...(c.messages ?? []), { text: "", active: true }] }));
  }

  function updateMsg(i, k, v) {
    setConfig(c => {
      const msgs = [...c.messages];
      msgs[i] = { ...msgs[i], [k]: v };
      return { ...c, messages: msgs };
    });
  }

  function removeMsg(i) {
    setConfig(c => ({ ...c, messages: c.messages.filter((_, idx) => idx !== i) }));
  }

  if (loading) return <div className="text-center py-20"><RefreshCw size={24} className="animate-spin mx-auto" style={{ color:"#c97d5b" }} /></div>;
  if (!config)  return <p className="text-center py-10" style={{ color:"#9c7a62" }}>Failed to load config.</p>;

  const activeCount = (config.messages ?? []).filter(m => m.active).length;

  return (
    <div className="max-w-2xl space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium"
          style={{ background: toast.ok ? "#4a3728" : "#dc2626", color: "white" }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="text-xl font-bold">Announcement Bar</h2>
          <p style={{ color:"#9c7a62" }} className="text-sm">{activeCount} active message{activeCount !== 1 ? "s" : ""} rotating</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background:"#c97d5b" }}>
          <Save size={15}/> {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Enable toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl border bg-white" style={{ borderColor:"#e8d5c4" }}>
        <div>
          <p style={{ color:"#3a2416" }} className="font-semibold text-sm">Show Announcement Bar</p>
          <p style={{ color:"#9c7a62" }} className="text-xs mt-0.5">Hide the bar sitewide without deleting messages</p>
        </div>
        <button onClick={() => setField("enabled", !config.enabled)}>
          {config.enabled
            ? <ToggleRight size={32} style={{ color:"#c97d5b" }} />
            : <ToggleLeft  size={32} style={{ color:"#d0b8a8" }} />}
        </button>
      </div>

      {/* Appearance */}
      <div className="p-5 rounded-2xl border bg-white space-y-4" style={{ borderColor:"#e8d5c4" }}>
        <p style={{ color:"#3a2416" }} className="font-semibold text-sm">Appearance</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color:"#7a5c4a" }}>Background Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.bgColor} onChange={e => setField("bgColor", e.target.value)}
                className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor:"#e8d5c4" }} />
              <input value={config.bgColor} onChange={e => setField("bgColor", e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none font-mono"
                style={{ borderColor:"#e8d5c4", color:"#3a2416" }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color:"#7a5c4a" }}>Text Color</label>
            <div className="flex items-center gap-2">
              <input type="color" value={config.textColor} onChange={e => setField("textColor", e.target.value)}
                className="w-10 h-10 rounded-lg border cursor-pointer" style={{ borderColor:"#e8d5c4" }} />
              <input value={config.textColor} onChange={e => setField("textColor", e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none font-mono"
                style={{ borderColor:"#e8d5c4", color:"#3a2416" }} />
            </div>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color:"#7a5c4a" }}>Rotation Interval (seconds)</label>
          <input type="number" min={1} max={30} value={config.interval}
            onChange={e => setField("interval", Number(e.target.value))}
            className="w-28 px-3 py-2 rounded-xl border text-sm outline-none"
            style={{ borderColor:"#e8d5c4", color:"#3a2416" }} />
        </div>

        {/* Live Preview */}
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color:"#7a5c4a" }}>Preview</label>
          <div className="rounded-xl py-2 px-4 text-center text-sm font-medium"
            style={{ background: config.bgColor, color: config.textColor }}>
            {(config.messages ?? []).find(m => m.active)?.text ?? "No active messages"}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-5 rounded-2xl border bg-white space-y-3" style={{ borderColor:"#e8d5c4" }}>
        <div className="flex items-center justify-between mb-1">
          <p style={{ color:"#3a2416" }} className="font-semibold text-sm">Messages</p>
          <button onClick={addMsg}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ background:"#f5ede5", color:"#c97d5b" }}>
            <Plus size={13}/> Add Message
          </button>
        </div>

        {(config.messages ?? []).length === 0 && (
          <p className="text-sm text-center py-4" style={{ color:"#9c7a62" }}>No messages yet. Add one above.</p>
        )}

        {(config.messages ?? []).map((m, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl border"
            style={{ borderColor: m.active ? "#e8d5c4" : "#f0e4d8", background: m.active ? "white" : "#fdf8f3" }}>
            <GripVertical size={16} style={{ color:"#d0b8a8" }} className="shrink-0 cursor-grab" />
            <input
              value={m.text}
              onChange={e => updateMsg(i, "text", e.target.value)}
              placeholder="Enter announcement text..."
              className="flex-1 text-sm outline-none bg-transparent"
              style={{ color:"#3a2416" }}
            />
            <button onClick={() => updateMsg(i, "active", !m.active)} className="shrink-0">
              {m.active
                ? <ToggleRight size={24} style={{ color:"#c97d5b" }} />
                : <ToggleLeft  size={24} style={{ color:"#d0b8a8" }} />}
            </button>
            <button onClick={() => removeMsg(i)} className="shrink-0 hover:opacity-70">
              <Trash2 size={15} style={{ color:"#dc2626" }} />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

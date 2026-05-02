import { useState, useEffect } from "react";

const BASE = "http://localhost:3001";

const FALLBACK = {
  messages: [
    { text: "🌸 Free delivery on orders above ₹999", active: true },
  ],
  bgColor: "#4a3728",
  textColor: "#f5e6d3",
  interval: 3,
  enabled: true,
};

export default function AnnouncementBar() {
  const [config, setConfig] = useState(FALLBACK);
  const [idx, setIdx]       = useState(0);

  useEffect(() => {
    fetch(`${BASE}/api/announcement`)
      .then(r => r.json())
      .then(d => { if (d.success && d.data) setConfig(d.data); })
      .catch(() => {});
  }, []);

  const active = (config.messages ?? []).filter(m => m.active);

  useEffect(() => {
    if (active.length <= 1) return;
    const t = setInterval(() => setIdx(i => (i + 1) % active.length), (config.interval ?? 3) * 1000);
    return () => clearInterval(t);
  }, [active.length, config.interval]);

  if (!config.enabled || active.length === 0) return null;

  return (
    <div style={{ background: config.bgColor, color: config.textColor }}
      className="text-center py-2 text-sm font-medium transition-colors duration-300">
      {active[idx % active.length]?.text}
    </div>
  );
}

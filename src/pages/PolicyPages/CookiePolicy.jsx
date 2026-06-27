
import { useState } from "react";
import {
  Shield, FileText, Cookie, ChevronDown, ChevronUp,
  Mail, Phone, CheckCircle, AlertCircle,
  RefreshCw, Globe, ChevronRight, Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BUSINESS_INFO } from "../../constants/StaticVariables";

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function PageHero({ icon, tag, title, subtitle, updated }) {
  return (
    <section className="relative overflow-hidden py-16" style={{ background:"var(--color-charcoal)" }}>
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background:"var(--color-olive)" }} />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10"  style={{ background:"var(--color-beige)" }} />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background:"rgba(95,111,82,0.2)" }}>
          <span style={{ color:"var(--color-sage)" }}>{icon}</span>
        </div>
        <span style={{ background:"rgba(95,111,82,0.2)", color:"var(--color-sage)" }}
          className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-4">
          {tag}
        </span>
        <h1 style={{ fontFamily:"Georgia, serif", color:"var(--color-beige)" }} className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
        <p style={{ color:"var(--color-sage)" }} className="text-base leading-relaxed max-w-xl mx-auto mb-4">{subtitle}</p>
        <p style={{ color:"var(--color-olive)" }} className="text-xs">Last updated: {updated}</p>
      </div>
    </section>
  );
}

function Section({ title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 rounded-2xl border overflow-hidden" style={{ borderColor:"var(--color-border)" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ background: open ? "var(--color-beige)" : "white" }}>
        <div className="flex items-center gap-3">
          <div style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">{title}</h2>
        </div>
        {open
          ? <ChevronUp size={18} style={{ color:"var(--color-olive)" }} />
          : <ChevronDown size={18} style={{ color:"var(--color-olive)" }} />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 bg-white">
          <div style={{ color:"var(--color-charcoal)" }} className="text-sm leading-relaxed space-y-3">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

function Highlight({ icon, text, type = "info" }) {
  const styles = {
    info:    { bg:"#dbeafe", color:"#1d4ed8", border:"#bfdbfe" },
    success: { bg:"#dcfce7", color:"#15803d", border:"#bbf7d0" },
    warning: { bg:"#fef9c3", color:"#a16207", border:"#fde68a" },
    danger:  { bg:"#fee2e2", color:"#b91c1c", border:"#fecaca" },
  };
  const s = styles[type];
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl my-3"
      style={{ background: s.bg, border:`1px solid ${s.border}` }}>
      <span style={{ color: s.color }} className="shrink-0 mt-0.5">{icon}</span>
      <p style={{ color: s.color }} className="text-sm leading-relaxed">{text}</p>
    </div>
  );
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2 mt-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span style={{ color:"var(--color-olive)" }} className="mt-1 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactCard() {
  return (
    <div className="mt-10 p-6 rounded-3xl" style={{ background:"var(--color-charcoal)" }}>
      <h3 style={{ fontFamily:"Georgia, serif", color:"var(--color-beige)" }} className="font-bold text-xl mb-2 text-center">
        Have Questions?
      </h3>
      <p style={{ color:"var(--color-sage)" }} className="text-sm text-center mb-6">
        Our team is happy to help clarify anything in this policy.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <a href="mailto:thefloralstudiosurat@gmail.com"
          className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background:"rgba(95,111,82,0.2)" }}>
          <Mail size={18} style={{ color:"var(--color-sage)" }} />
          <div>
            <p style={{ color:"var(--color-beige)" }} className="text-sm font-semibold">Email Us</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">thefloralstudiosurat@gmail.com</p>
          </div>
        </a>
        <a href={BUSINESS_INFO.phoneHref}
          className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background:"rgba(95,111,82,0.2)" }}>
          <Phone size={18} style={{ color:"var(--color-sage)" }} />
          <div>
            <p style={{ color:"var(--color-beige)" }} className="text-sm font-semibold">Call Us</p>
            <p style={{ color:"var(--color-olive)" }} className="text-xs">{BUSINESS_INFO.phoneDisplay}</p>
          </div>
        </a>
      </div>
    </div>
  );
}

// ─── COOKIE DATA ──────────────────────────────────────────────────────────────

const COOKIE_TYPES = [
  {
    name:"Essential Cookies",
    icon:"🔒",
    canDisable: false,
    desc:"These cookies are strictly necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling in forms.",
    examples:[
      { name:"session_id",     purpose:"Maintains your login session",               duration:"Session" },
      { name:"cart_token",     purpose:"Remembers your shopping cart contents",       duration:"7 days"  },
      { name:"csrf_token",     purpose:"Protects against cross-site request forgery", duration:"Session" },
      { name:"cookie_consent", purpose:"Remembers your cookie preferences",           duration:"1 year"  },
    ]
  },
  {
    name:"Analytics Cookies",
    icon:"📊",
    canDisable: true,
    desc:"These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information is aggregated and anonymous.",
    examples:[
      { name:"_ga",  purpose:"Google Analytics — distinguishes users",       duration:"2 years"  },
      { name:"_gid", purpose:"Google Analytics — distinguishes users",       duration:"24 hours" },
      { name:"_gat", purpose:"Google Analytics — throttles request rate",    duration:"1 minute" },
    ]
  },
  {
    name:"Functional Cookies",
    icon:"⚙️",
    canDisable: true,
    desc:"These cookies enable the website to provide enhanced functionality and personalisation, such as remembering your preferences.",
    examples:[
      { name:"recently_viewed", purpose:"Tracks recently viewed products",            duration:"7 days"  },
      { name:"wishlist_id",     purpose:"Persists your wishlist when not logged in",  duration:"90 days" },
    ]
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// COOKIE POLICY
// ══════════════════════════════════════════════════════════════════════════════

const PREF_KEYS = { "Analytics Cookies":"analytics", "Functional Cookies":"functional" };

const SAVED_PREFS_KEY = "fs_cookie_prefs";

function CookiePolicyComponent() {
  const [prefs, setPrefs] = useState(() => {
    try { return JSON.parse(localStorage.getItem(SAVED_PREFS_KEY)) || { analytics: true, functional: true }; }
    catch { return { analytics: true, functional: true }; }
  });
  const [saved, setSaved] = useState(false);

  function toggle(key) { setPrefs(p => ({ ...p, [key]: !p[key] })); setSaved(false); }

  function savePrefs() {
    localStorage.setItem(SAVED_PREFS_KEY, JSON.stringify(prefs));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      <PageHero
        icon={<Cookie size={32}/>}
        tag="Legal"
        title="Cookie Policy"
        subtitle="We use cookies to improve your experience, analyse traffic, and personalise content. Here's exactly what we use and why."
        updated="28 April 2025"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">

        <Highlight type="info"
          icon={<AlertCircle size={16}/>}
          text="Cookies are small text files stored on your device when you visit our website. They help us remember your preferences and understand how you use our site." />

        {/* Cookie Preferences Manager */}
        <div className="bg-white rounded-3xl border overflow-hidden mb-6" style={{ borderColor:"var(--color-border)" }}>
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
            <div style={{ background:"var(--color-beige)", color:"var(--color-olive)" }} className="w-8 h-8 rounded-xl flex items-center justify-center">
              <Cookie size={16}/>
            </div>
            <h2 style={{ fontFamily:"Georgia, serif", color:"var(--color-charcoal)" }} className="font-bold text-lg">Manage Cookie Preferences</h2>
          </div>
          <div className="p-6">
            {saved && (
              <div className="mb-4 p-3 rounded-xl flex items-center gap-2" style={{ background:"#dcfce7" }}>
                <CheckCircle size={14} style={{ color:"#16a34a" }} />
                <p className="text-sm font-semibold" style={{ color:"#15803d" }}>Preferences saved successfully!</p>
              </div>
            )}
            <div className="space-y-4">
              {COOKIE_TYPES.map(ct => {
                const key = PREF_KEYS[ct.name];
                const isOn = ct.canDisable ? (key ? prefs[key] : false) : true;
                return (
                  <div key={ct.name} className="flex items-start justify-between gap-4 p-4 rounded-2xl border"
                    style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xl shrink-0">{ct.icon}</span>
                      <div>
                        <p style={{ color:"var(--color-charcoal)" }} className="font-semibold text-sm">{ct.name}</p>
                        <p style={{ color:"var(--color-olive)" }} className="text-xs mt-0.5 leading-relaxed">{ct.desc}</p>
                      </div>
                    </div>
                    {ct.canDisable ? (
                      <button onClick={() => toggle(key)}
                        className="w-12 h-6 rounded-full transition-all relative shrink-0 mt-1"
                        style={{ background: isOn ? "var(--color-olive)" : "var(--color-border)" }}>
                        <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                          style={{ left: isOn ? "calc(100% - 22px)" : "2px" }} />
                      </button>
                    ) : (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 mt-1"
                        style={{ background:"#dcfce7", color:"#16a34a" }}>
                        Always On
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <button onClick={savePrefs}
              style={{ background:"var(--color-olive)" }}
              className="mt-5 w-full py-3 rounded-full font-semibold text-white hover:opacity-90 text-sm">
              Save My Preferences
            </button>
          </div>
        </div>

        {/* Cookie Details */}
        {COOKIE_TYPES.map(ct => (
          <Section key={ct.name} title={`${ct.icon} ${ct.name}`} icon={<Cookie size={16}/>}>
            <p>{ct.desc}</p>
            <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor:"var(--color-border)" }}>
              <div className="grid grid-cols-3 px-4 py-2 text-xs font-bold uppercase tracking-wide"
                style={{ background:"var(--color-beige)", color:"var(--color-olive)" }}>
                <span>Cookie Name</span>
                <span>Purpose</span>
                <span>Duration</span>
              </div>
              {ct.examples.map((ex, i) => (
                <div key={i} className="grid grid-cols-3 px-4 py-3 text-xs border-t items-start"
                  style={{ borderColor:"var(--color-border)" }}>
                  <code style={{ color:"var(--color-olive)", background:"var(--color-beige)" }}
                    className="px-1.5 py-0.5 rounded text-xs font-mono w-fit">
                    {ex.name}
                  </code>
                  <span style={{ color:"var(--color-charcoal)" }} className="pr-3">{ex.purpose}</span>
                  <span style={{ color:"var(--color-olive)" }}>{ex.duration}</span>
                </div>
              ))}
            </div>
          </Section>
        ))}

        <Section title="Third-Party Cookies" icon={<Globe size={16}/>}>
          <p>Some cookies on our website are set by third-party services we use. These include:</p>
          <BulletList items={[
            "Google Analytics — website traffic analysis (privacy.google.com)",
            "Razorpay — payment processing (razorpay.com/privacy)",
          ]} />
          <p className="mt-3">We do not control these third-party cookies. Please refer to the respective privacy policies of these providers for more information.</p>
        </Section>

        <Section title="How to Control Cookies" icon={<Settings size={16}/>}>
          <p>You can control and manage cookies in several ways:</p>
          <p className="mt-2 font-semibold" style={{ color:"var(--color-charcoal)" }}>Using our Preference Manager:</p>
          <p>Use the preference toggle above to enable or disable non-essential cookie categories.</p>
          <p className="mt-3 font-semibold" style={{ color:"var(--color-charcoal)" }}>Through your browser settings:</p>
          <BulletList items={[
            "Chrome: Settings → Privacy and Security → Cookies and other site data",
            "Firefox: Settings → Privacy & Security → Cookies and Site Data",
            "Safari: Preferences → Privacy → Manage Website Data",
            "Edge: Settings → Cookies and Site Permissions → Cookies and site data",
          ]} />
          <Highlight type="warning"
            icon={<AlertCircle size={16}/>}
            text="Disabling essential cookies may break core functionality such as login, cart, and checkout. We recommend keeping essential cookies enabled for the best shopping experience." />
        </Section>

        <Section title="Updates to This Policy" icon={<RefreshCw size={16}/>}>
          <p>We may update this Cookie Policy periodically to reflect changes in the cookies we use or applicable legislation. When we post changes, we will revise the 'Last Updated' date at the top of this page.</p>
          <p className="mt-3">For significant changes, we will notify you via a banner on our website or by email.</p>
        </Section>

        <ContactCard />
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN
// ══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id:"/privacy-policy",   label:"Privacy Policy",   icon:<Shield size={16}/>   },
  { id:"/terms-conditions", label:"Terms of Service", icon:<FileText size={16}/> },
  { id:"/cookie-policy",    label:"Cookie Policy",    icon:<Cookie size={16}/>   },
];

export default function CookiePolicy() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"var(--color-beige)", minHeight:"100vh" }}>
      <CookiePolicyComponent />
      <div className="border-t py-8" style={{ borderColor:"var(--color-border)", background:"var(--color-beige)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p style={{ color:"var(--color-olive)" }} className="text-sm mb-4">Also read our other policies:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {TABS.filter(t => t.id !== "/cookie-policy").map(t => (
              <button key={t.id} onClick={() => { navigate(t.id); window.scrollTo({ top:0, behavior:"smooth" }); }}
                className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
                style={{ color:"var(--color-olive)" }}>
                {t.icon} {t.label} <ChevronRight size={13}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


import { useState } from "react";
import {
  Shield, FileText, Cookie, ChevronDown, ChevronUp,
  Mail, Phone, CheckCircle, AlertCircle,
   RefreshCw, Globe, ChevronRight,
   Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsConditions from "./TermsConditions";
// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function PageHero({ icon, tag, title, subtitle, updated }) {
  return (
    <section className="relative overflow-hidden py-16" style={{ background:"#4a3728" }}>
      <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-10" style={{ background:"#c97d5b" }} />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full opacity-10"  style={{ background:"#f5e6d3" }} />
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background:"rgba(201,125,91,0.2)" }}>
          <span style={{ color:"#f5c8a8" }}>{icon}</span>
        </div>
        <span style={{ background:"rgba(201,125,91,0.2)", color:"#f5c8a8" }}
          className="inline-block text-xs uppercase tracking-widest font-semibold px-3 py-1 rounded-full mb-4">
          {tag}
        </span>
        <h1 style={{ fontFamily:"Georgia, serif", color:"#f5e6d3" }} className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
        <p style={{ color:"#c4a088" }} className="text-base leading-relaxed max-w-xl mx-auto mb-4">{subtitle}</p>
        <p style={{ color:"#7a5c4a" }} className="text-xs">Last updated: {updated}</p>
      </div>
    </section>
  );
}

function Section({ title, icon, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4 rounded-2xl border overflow-hidden" style={{ borderColor:"#e8d5c4" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        style={{ background: open ? "#fdf8f3" : "white" }}>
        <div className="flex items-center gap-3">
          <div style={{ background:"#f5ede5", color:"#c97d5b" }}
            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            {icon}
          </div>
          <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">{title}</h2>
        </div>
        {open
          ? <ChevronUp size={18} style={{ color:"#c97d5b" }} />
          : <ChevronDown size={18} style={{ color:"#9c7a62" }} />}
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2 bg-white">
          <div style={{ color:"#5c4033" }} className="text-sm leading-relaxed space-y-3">
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
          <span style={{ color:"#c97d5b" }} className="mt-1 shrink-0">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ContactCard() {
  return (
    <div className="mt-10 p-6 rounded-3xl" style={{ background:"#4a3728" }}>
      <h3 style={{ fontFamily:"Georgia, serif", color:"#f5e6d3" }} className="font-bold text-xl mb-2 text-center">
        Have Questions?
      </h3>
      <p style={{ color:"#b89c8a" }} className="text-sm text-center mb-6">
        Our team is happy to help clarify anything in this policy.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <a href="mailto:hello@floralstudio.in"
          className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background:"rgba(201,125,91,0.2)" }}>
          <Mail size={18} style={{ color:"#f5c8a8" }} />
          <div>
            <p style={{ color:"#f5e6d3" }} className="text-sm font-semibold">Email Us</p>
            <p style={{ color:"#9c7a62" }} className="text-xs">hello@floralstudio.in</p>
          </div>
        </a>
        <a href="tel:+919876543210"
          className="flex items-center gap-3 p-4 rounded-2xl hover:opacity-90 transition-opacity"
          style={{ background:"rgba(201,125,91,0.2)" }}>
          <Phone size={18} style={{ color:"#f5c8a8" }} />
          <div>
            <p style={{ color:"#f5e6d3" }} className="text-sm font-semibold">Call Us</p>
            <p style={{ color:"#9c7a62" }} className="text-xs">+91 98765 43210</p>
          </div>
        </a>
      </div>
    </div>
  );
}



// ══════════════════════════════════════════════════════════════════════════════
// COOKIE POLICY
// ══════════════════════════════════════════════════════════════════════════════

const COOKIE_TYPES = [
  {
    name:"Essential Cookies",
    icon:"🔒",
    canDisable: false,
    color:"#16a34a",
    desc:"These cookies are strictly necessary for the website to function and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling in forms.",
    examples:[
      { name:"session_id",        purpose:"Maintains your login session",                   duration:"Session"  },
      { name:"cart_token",        purpose:"Remembers your shopping cart contents",           duration:"7 days"   },
      { name:"csrf_token",        purpose:"Protects against cross-site request forgery",     duration:"Session"  },
      { name:"cookie_consent",    purpose:"Remembers your cookie preferences",               duration:"1 year"   },
    ]
  },
  {
    name:"Analytics Cookies",
    icon:"📊",
    canDisable: true,
    color:"#2563eb",
    desc:"These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. All information is aggregated and anonymous.",
    examples:[
      { name:"_ga",               purpose:"Google Analytics — distinguishes users",          duration:"2 years"  },
      { name:"_gid",              purpose:"Google Analytics — distinguishes users",          duration:"24 hours" },
      { name:"_gat",              purpose:"Google Analytics — throttles request rate",        duration:"1 minute" },
    ]
  },
  {
    name:"Functional Cookies",
    icon:"⚙️",
    canDisable: true,
    color:"#7c3aed",
    desc:"These cookies enable the website to provide enhanced functionality and personalisation, such as remembering your preferences and language settings.",
    examples:[
      { name:"preferred_city",    purpose:"Remembers your selected delivery city",           duration:"30 days"  },
      { name:"wishlist_id",       purpose:"Persists your wishlist when not logged in",        duration:"90 days"  },
      { name:"recently_viewed",   purpose:"Tracks recently viewed products",                  duration:"7 days"   },
    ]
  },
  {
    name:"Marketing Cookies",
    icon:"📢",
    canDisable: true,
    color:"#c97d5b",
    desc:"These cookies may be set through our site by our advertising partners to build a profile of your interests and show you relevant advertisements on other sites.",
    examples:[
      { name:"_fbp",              purpose:"Facebook Pixel — tracks ad conversions",          duration:"90 days"  },
      { name:"_gcl_au",           purpose:"Google Ads — conversion tracking",                duration:"90 days"  },
    ]
  },
];

function CookiePolicyComponent() {
  const [prefs, setPrefs] = useState({ analytics: true, functional: true, marketing: false });
  const [saved, setSaved] = useState(false);

  function toggle(key) { setPrefs(p => ({ ...p, [key]: !p[key] })); setSaved(false); }
  function savePrefs() { setSaved(true); setTimeout(() => setSaved(false), 3000); }

  const keyMap = { "Analytics Cookies":"analytics", "Functional Cookies":"functional", "Marketing Cookies":"marketing" };

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
        <div className="bg-white rounded-3xl border overflow-hidden mb-6" style={{ borderColor:"#e8d5c4" }}>
          <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
            <div style={{ background:"#f5ede5", color:"#c97d5b" }} className="w-8 h-8 rounded-xl flex items-center justify-center">
              <Cookie size={16}/>
            </div>
            <h2 style={{ fontFamily:"Georgia, serif", color:"#3a2416" }} className="font-bold text-lg">Manage Cookie Preferences</h2>
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
                const key = keyMap[ct.name];
                const isOn = ct.canDisable ? (key ? prefs[key] : false) : true;
                return (
                  <div key={ct.name} className="flex items-start justify-between gap-4 p-4 rounded-2xl border"
                    style={{ borderColor:"#f0e4d8", background:"#fdf8f3" }}>
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-xl shrink-0">{ct.icon}</span>
                      <div>
                        <p style={{ color:"#3a2416" }} className="font-semibold text-sm">{ct.name}</p>
                        <p style={{ color:"#7a5c4a" }} className="text-xs mt-0.5 leading-relaxed">{ct.desc}</p>
                      </div>
                    </div>
                    {ct.canDisable ? (
                      <button onClick={() => toggle(key)}
                        className="w-12 h-6 rounded-full transition-all relative shrink-0 mt-1"
                        style={{ background: isOn ? "#c97d5b" : "#e8d5c4" }}>
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
              style={{ background:"#c97d5b" }}
              className="mt-5 w-full py-3 rounded-full font-semibold text-white hover:opacity-90 text-sm">
              Save My Preferences
            </button>
          </div>
        </div>

        {/* Cookie Details */}
        {COOKIE_TYPES.map(ct => (
          <Section key={ct.name} title={`${ct.icon} ${ct.name}`} icon={<Cookie size={16}/>}>
            <p>{ct.desc}</p>
            <div className="mt-4 rounded-2xl overflow-hidden border" style={{ borderColor:"#e8d5c4" }}>
              <div className="grid grid-cols-3 px-4 py-2 text-xs font-bold uppercase tracking-wide"
                style={{ background:"#fdf8f3", color:"#9c7a62" }}>
                <span>Cookie Name</span>
                <span>Purpose</span>
                <span>Duration</span>
              </div>
              {ct.examples.map((ex, i) => (
                <div key={i} className="grid grid-cols-3 px-4 py-3 text-xs border-t items-start"
                  style={{ borderColor:"#f0e4d8" }}>
                  <code style={{ color:"#c97d5b", background:"#fdf8f3" }}
                    className="px-1.5 py-0.5 rounded text-xs font-mono w-fit">
                    {ex.name}
                  </code>
                  <span style={{ color:"#5c4033" }} className="pr-3">{ex.purpose}</span>
                  <span style={{ color:"#9c7a62" }}>{ex.duration}</span>
                </div>
              ))}
            </div>
          </Section>
        ))}

        <Section title="Third-Party Cookies" icon={<Globe size={16}/>}>
          <p>Some cookies on our website are set by third-party services we use. These include:</p>
          <BulletList items={[
            "Google Analytics — website traffic analysis (privacy.google.com)",
            "Facebook Pixel — advertising and conversion tracking (facebook.com/privacy)",
            "Razorpay — payment processing (razorpay.com/privacy)",
            "Intercom — customer support chat (intercom.com/terms)",
            "YouTube — embedded video content (policies.google.com)",
          ]} />
          <p className="mt-3">We do not control these third-party cookies. Please refer to the respective privacy policies of these providers for more information.</p>
        </Section>

        <Section title="How to Control Cookies" icon={<Settings size={16}/>}>
          <p>You can control and manage cookies in several ways:</p>
          <p className="mt-2 font-semibold" style={{ color:"#4a3728" }}>Using our Preference Manager:</p>
          <p>Use the preference toggle above to enable or disable non-essential cookie categories.</p>
          <p className="mt-3 font-semibold" style={{ color:"#4a3728" }}>Through your browser settings:</p>
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
// MAIN — Tab switcher
// ══════════════════════════════════════════════════════════════════════════════

const TABS = [
  { id:"/privacy-policy", label:"Privacy Policy",    icon:<Shield size={16}/>,   page:<PrivacyPolicy />   },
  { id:"/terms-conditions",   label:"Terms of Service",  icon:<FileText size={16}/>, page:<TermsConditions />  },
  { id:"/cookie-policy", label:"Cookie Policy",     icon:<Cookie size={16}/>,   page:<CookiePolicy />    },
];

export default function CookiePolicy() {
  const active = "/cookie-policy";
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily:"system-ui, sans-serif", background:"#fdf8f3", minHeight:"100vh" }}>
      <CookiePolicyComponent />
      {/* Footer Links */}
      <div className="border-t py-8" style={{ borderColor:"#e8d5c4", background:"#f5ede5" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p style={{ color:"#9c7a62" }} className="text-sm mb-4">Also read our other policies:</p>
          <div className="flex justify-center gap-4 flex-wrap">
            {TABS.filter(t => t.id !== active).map(t => (
              <button key={t.id} onClick={() => { 
                navigate(`/${t.id}`);
                window.scrollTo({ top:0, behavior:"smooth" });
             }}
                className="flex items-center gap-1.5 text-sm font-semibold hover:opacity-70 transition-opacity"
                style={{ color:"#c97d5b" }}>
                {t.icon} {t.label} <ChevronRight size={13}/>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}